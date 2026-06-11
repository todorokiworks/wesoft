/**
 * ビルドスクリプト用: microCMS / column.json からコラムデータを取得
 */
const fs = require("fs");
const path = require("path");

const DEFAULT_ENDPOINT = "wesoft-column";

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isMicroCmsConfigured() {
  return Boolean(
    process.env.REACT_APP_MICROCMS_SERVICE_DOMAIN?.trim() &&
      process.env.REACT_APP_MICROCMS_API_KEY?.trim()
  );
}

function getEndpoint() {
  return (
    process.env.REACT_APP_MICROCMS_ARTICLE_ENDPOINT?.trim() || DEFAULT_ENDPOINT
  );
}

function buildCategories(records) {
  const map = new Map();
  for (const record of records) {
    const cat = record.category;
    if (!cat?.id) continue;
    map.set(cat.id, cat.name?.trim() || cat.id);
  }
  return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
}

function mapArticle(record) {
  const html = record.content?.trim() ?? "";
  const plain = html ? stripHtml(html) : "";
  // microCMS スキーマのフィールド ID は metaDiscription（綴りはスキーマ準拠）
  const metaDescription =
    record.metaDiscription?.trim() || record.metaDescription?.trim() || "";
  return {
    id: record.id,
    title: record.title?.trim() ?? "",
    category: record.category?.id?.trim() ?? "",
    body: plain,
    ...(metaDescription ? { metaDescription } : {}),
    thumbnail: record.eyecatch?.url?.trim() ?? "",
  };
}

async function fetchFromMicroCms() {
  const domain = process.env.REACT_APP_MICROCMS_SERVICE_DOMAIN.trim();
  const key = process.env.REACT_APP_MICROCMS_API_KEY.trim();
  const endpoint = getEndpoint();
  const url = `https://${domain}.microcms.io/api/v1/${endpoint}?limit=100&orders=-publishedAt`;
  const res = await fetch(url, {
    headers: { "X-MICROCMS-API-KEY": key },
  });
  if (!res.ok) {
    throw new Error(`microCMS ${endpoint}: ${res.status}`);
  }
  const json = await res.json();
  const records = json.contents ?? [];
  return {
    categories: buildCategories(records),
    articles: records.map(mapArticle),
  };
}

function readColumnJson(publicDir) {
  const jsonPath = path.join(publicDir, "data", "column.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`column.json not found: ${jsonPath}`);
  }
  return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
}

/**
 * @param {{ publicDir?: string }} [options]
 * @returns {Promise<{ categories: object[], articles: object[] }>}
 */
async function getColumnData(options = {}) {
  const publicDir =
    options.publicDir || path.join(__dirname, "../../public");
  if (isMicroCmsConfigured()) {
    return fetchFromMicroCms();
  }
  return readColumnJson(publicDir);
}

module.exports = {
  getColumnData,
  isMicroCmsConfigured,
  stripHtml,
};
