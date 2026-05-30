/**
 * public/data/column.json → microCMS（wesoft-column / categories）へインポート
 *
 * 使い方:
 *   cd front-end
 *   npm run import:column          # 新規 POST + マップ済みは PUT
 *   npm run import:column -- --dry-run
 *
 * 必要な .env.local:
 *   REACT_APP_MICROCMS_SERVICE_DOMAIN
 *   MICROCMS_WRITE_API_KEY  （POST/PUT 権限付き）
 *   REACT_APP_MICROCMS_ARTICLE_ENDPOINT=wesoft-column
 *   REACT_APP_MICROCMS_CATEGORY_ENDPOINT=categories
 *
 * 任意:
 *   IMPORT_SITE_ORIGIN=https://example.com  … 本文内 img の絶対 URL 用
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

const rootDir = path.join(__dirname, "..");
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

/** プレーンテキスト body → microCMS リッチエディタ用 HTML */
function bodyToContentHtml(article) {
  const origin = process.env.IMPORT_SITE_ORIGIN?.trim().replace(/\/$/, "");
  const parts = article.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const blocks = [];

  if (article.thumbnail && origin && article.thumbnail.startsWith("/")) {
    blocks.push(
      `<figure><img src="${origin}${article.thumbnail}" alt="" /></figure>`
    );
  }

  for (const p of parts) {
    blocks.push(`<p>${escapeHtml(p)}</p>`);
  }

  return blocks.join("\n");
}

function loadMap() {
  if (!fs.existsSync(mapPath)) {
    return { categories: {}, articles: {} };
  }
  return JSON.parse(fs.readFileSync(mapPath, "utf8"));
}

function saveMap(map) {
  fs.writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`, "utf8");
}

function loadColumnJson() {
  const jsonPath = path.join(rootDir, "public", "data", "column.json");
  return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
}

function loadCategoryOverrides() {
  if (!fs.existsSync(categoryMapPath)) return {};
  const raw = JSON.parse(fs.readFileSync(categoryMapPath, "utf8"));
  return raw.categories ?? raw;
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
          `  1) microCMS 管理画面で categories に POST 権限を付与する\n` +
          `  2) または管理画面でカテゴリを手動作成し scripts/column-category-map.json に id を記載する\n` +
          `  例: { "categories": { "business": "xxxx", "tech": "yyyy", "column": "zzzz" } }`
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
    content: bodyToContentHtml(article),
    category: categoryId,
  };

  return payload;
}

async function importArticles(columnData, map) {
  const articleEndpoint = getArticleEndpoint();

  for (const article of columnData.articles) {
    const payload = buildArticlePayload(article, map);
    const mappedId = map.articles[article.id];

    if (dryRun) {
      console.log(
        `  [article] ${mappedId ? "PATCH" : "POST"} ${article.id}: ${article.title}`
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

  if (!process.env.IMPORT_SITE_ORIGIN?.trim()) {
    console.warn(
      "[import-column] IMPORT_SITE_ORIGIN 未設定: 本文内のサムネイル img は省略されます（eyecatch フィールドは未使用）"
    );
  }

  const columnData = loadColumnJson();
  const map = loadMap();

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
