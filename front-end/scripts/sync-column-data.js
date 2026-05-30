/**
 * ビルド前: microCMS の内容を public/data/column.json に同期（SEO・プリレンダ用）
 */
const fs = require("fs");
const path = require("path");
const { loadEnvFiles } = require("./lib/load-env");
const {
  getColumnData,
  isMicroCmsConfigured,
} = require("./lib/column-data-node");

const rootDir = path.join(__dirname, "..");
loadEnvFiles(rootDir);

async function main() {
  if (!isMicroCmsConfigured()) {
    console.log("[sync-column-data] microCMS 未設定のためスキップ");
    return;
  }

  const publicDir = path.join(rootDir, "public");
  const outPath = path.join(publicDir, "data", "column.json");
  const data = await getColumnData({ publicDir });
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(
    `[sync-column-data] wrote ${data.articles.length} articles → public/data/column.json`
  );
}

main().catch((err) => {
  console.error("[sync-column-data]", err);
  process.exit(1);
});
