/**
 * public/data/column.json → microCMS（wesoft-column / categories）へインポート
 *
 * 使い方:
 *   cd front-end
 *   npm run import:column          # 新規 POST + マップ済みは PATCH
 *   npm run import:column -- --dry-run
 *
 * 必要な .env.local:
 *   REACT_APP_MICROCMS_SERVICE_DOMAIN
 *   MICROCMS_WRITE_API_KEY  （POST/PATCH + メディアのアップロード権限）
 *   REACT_APP_MICROCMS_ARTICLE_ENDPOINT=wesoft-column
 *   REACT_APP_MICROCMS_CATEGORY_ENDPOINT=categories
 */
const fs = require("fs");
const path = require("path");
const { loadEnvFiles } = require("./lib/load-env");
const {
  getArticleEndpoint,
  getCategoryEndpoint,
  listContents,
  createContent,
  updateContent,
} = require("./lib/microcms-write");
const {
  resolveLocalImagePath,
  uploadImageFile,
} = require("./lib/microcms-media");

const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const mapPath = path.join(__dirname, "column-microcms-map.json");
const categoryMapPath = path.join(__dirname, "column-category-map.json");

loadEnvFiles(rootDir);

const dryRun = process.argv.includes("--dry-run");

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** サムネイル URL（microCMS または外部）を解決 */
function resolveThumbnailUrl(thumbnail, imageMap) {
  const raw = thumbnail?.trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }
  return imageMap[raw] ?? "";
}

/** プレーンテキスト body → microCMS リッチエディタ用 HTML */
function bodyToContentHtml(article, imageMap) {
  const parts = article.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const blocks = [];
  const thumbUrl = resolveThumbnailUrl(article.thumbnail, imageMap);

  if (thumbUrl) {
    blocks.push(`<figure><img src="${thumbUrl}" alt="" /></figure>`);
  }

  for (const p of parts) {
    blocks.push(`<p>${escapeHtml(p)}</p>`);
  }

  return blocks.join("\n");
}

function loadMap() {
  if (!fs.existsSync(mapPath)) {
    return { categories: {}, articles: {}, images: {} };
  }
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  if (!map.images) map.images = {};
  return map;
}

function saveMap(map) {
  fs.writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`, "utf8");
}

function loadColumnJson() {
  const jsonPath = path.join(publicDir, "data", "column.json");
  return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
}

function loadCategoryOverrides() {
  if (!fs.existsSync(categoryMapPath)) return {};
  const raw = JSON.parse(fs.readFileSync(categoryMapPath, "utf8"));
  return raw.categories ?? raw;
}

/** column.json で使われるローカル画像を microCMS にアップロード */
async function ensureImages(columnData, map) {
  const paths = new Set();
  for (const article of columnData.articles) {
    const local = resolveLocalImagePath(article.thumbnail, publicDir);
    if (local) {
      paths.add(article.thumbnail.trim());
    }
  }

  if (paths.size === 0) {
    console.log("  [image] ローカル画像なし");
    return;
  }

  for (const thumbPath of paths) {
    if (map.images[thumbPath]) {
      console.log(`  [image] ${thumbPath} → マップ済み`);
      continue;
    }

    const filePath = resolveLocalImagePath(thumbPath, publicDir);
    if (!filePath) continue;

    if (dryRun) {
      console.log(`  [image] ${thumbPath} → アップロード（dry-run）`);
      map.images[thumbPath] = `https://dry-run.example/${path.basename(filePath)}`;
      continue;
    }

    const url = await uploadImageFile(filePath);
    map.images[thumbPath] = url;
    console.log(`  [image] ${thumbPath} → アップロード完了`);
  }
}

async function ensureCategories(columnData, map) {
  const categoryEndpoint = getCategoryEndpoint();
  const overrides = loadCategoryOverrides();
  const existing = await listContents(categoryEndpoint);
  const byName = new Map(existing.map((c) => [c.name, c.id]));

  for (const cat of columnData.categories) {
    if (map.categories[cat.id]) {
      console.log(`  [category] ${cat.label} → マップ済み (${map.categories[cat.id]})`);
      continue;
    }

    if (overrides[cat.id]) {
      map.categories[cat.id] = overrides[cat.id];
      console.log(`  [category] ${cat.label} → 手動マップ (${overrides[cat.id]})`);
      continue;
    }

    const found = byName.get(cat.label);
    if (found) {
      map.categories[cat.id] = found;
      console.log(`  [category] ${cat.label} → 既存 (${found})`);
      continue;
    }

    if (dryRun) {
      console.log(`  [category] ${cat.label} → POST（dry-run）`);
      map.categories[cat.id] = `dry-run-${cat.id}`;
      continue;
    }

    try {
      const created = await createContent(categoryEndpoint, { name: cat.label });
      map.categories[cat.id] = created.id;
      byName.set(cat.label, created.id);
      console.log(`  [category] ${cat.label} → 作成 (${created.id})`);
    } catch (err) {
      if (!String(err.message).includes("POST is forbidden") &&
          !String(err.message).includes("POST 権限")) {
        throw err;
      }
      throw new Error(
        `カテゴリ「${cat.label}」を作成できません（categories API に POST 権限なし）。\n` +
          `  scripts/column-category-map.json に id を記載してください`
      );
    }
  }
}

function buildArticlePayload(article, map) {
  const categoryId = map.categories[article.category];
  if (!categoryId) {
    throw new Error(
      `カテゴリ "${article.category}" が未解決です（${article.title}）`
    );
  }

  const payload = {
    title: article.title,
    content: bodyToContentHtml(article, map.images),
    category: categoryId,
  };

  const eyecatch = resolveThumbnailUrl(article.thumbnail, map.images);
  if (eyecatch) {
    payload.eyecatch = eyecatch;
  }

  return payload;
}

async function importArticles(columnData, map) {
  const articleEndpoint = getArticleEndpoint();

  for (const article of columnData.articles) {
    const payload = buildArticlePayload(article, map);
    const mappedId = map.articles[article.id];

    if (dryRun) {
      console.log(
        `  [article] ${mappedId ? "PATCH" : "POST"} ${article.id}: ${article.title}` +
          (payload.eyecatch ? "（eyecatch あり）" : "")
      );
      if (!mappedId) map.articles[article.id] = `dry-run-${article.id}`;
      continue;
    }

    if (mappedId && !mappedId.startsWith("dry-run-")) {
      await updateContent(articleEndpoint, mappedId, payload);
      console.log(`  [article] PATCH ${article.id} → ${mappedId}: ${article.title}`);
    } else {
      const created = await createContent(articleEndpoint, payload);
      map.articles[article.id] = created.id;
      console.log(`  [article] POST ${article.id} → ${created.id}: ${article.title}`);
    }
  }
}

async function main() {
  console.log("[import-column] column.json → microCMS");
  if (dryRun) console.log("[import-column] --dry-run（API は呼び出しません）");

  const columnData = loadColumnJson();
  const map = loadMap();

  console.log("[import-column] 画像（eyecatch）…");
  await ensureImages(columnData, map);

  console.log("[import-column] カテゴリ…");
  await ensureCategories(columnData, map);

  console.log("[import-column] 記事…");
  await importArticles(columnData, map);

  if (!dryRun) {
    saveMap(map);
    console.log(`[import-column] マップ保存: ${path.relative(rootDir, mapPath)}`);
  }

  console.log(
    `[import-column] 完了（カテゴリ ${columnData.categories.length} / 記事 ${columnData.articles.length}）`
  );
}

main().catch((err) => {
  console.error("[import-column]", err.message || err);
  process.exit(1);
});
