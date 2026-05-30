/**
 * ビルド後: コラム関連ルートを Puppeteer でプリレンダ（GitHub Pages 向け HTML 出力）
 */
const fs = require("fs");
const path = require("path");
const http = require("http");
const puppeteer = require("puppeteer");
const { loadEnvFiles } = require("./lib/load-env");
const { getColumnData } = require("./lib/column-data-node");

const rootDir = path.join(__dirname, "..");
const buildDir = path.join(rootDir, "build");
const PORT = 34567;

loadEnvFiles(rootDir);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

function getBasePath() {
  const raw = process.env.REACT_APP_BASE_PATH?.trim();
  if (raw) return raw.startsWith("/") ? raw : `/${raw}`;
  return "";
}

function routeToOutputPath(routePath, basePath) {
  let rel = routePath;
  if (basePath && rel.startsWith(basePath)) {
    rel = rel.slice(basePath.length) || "/";
  }
  rel = rel.replace(/^\//, "");
  if (!rel) return path.join(buildDir, "index.html");
  return path.join(buildDir, rel, "index.html");
}

function resolveRequestPath(urlPath, basePath) {
  let rel = urlPath.split("?")[0];
  if (basePath && rel.startsWith(basePath)) {
    rel = rel.slice(basePath.length) || "/";
  }
  if (!rel.startsWith("/")) rel = `/${rel}`;
  return rel;
}

function findFile(relPath) {
  const normalized = relPath.replace(/^\//, "");
  if (!normalized) {
    return path.join(buildDir, "index.html");
  }

  const direct = path.join(buildDir, normalized);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) {
    return direct;
  }

  const withIndex = path.join(buildDir, normalized, "index.html");
  if (fs.existsSync(withIndex)) {
    return withIndex;
  }

  return path.join(buildDir, "index.html");
}

/** /wesoft/static/... → build/static/... のようにベースパス付き URL を解決する */
function createStaticServer(basePath) {
  return http.createServer((req, res) => {
    try {
      const rel = resolveRequestPath(req.url || "/", basePath);
      const filePath = findFile(rel);
      const ext = path.extname(filePath).toLowerCase();
      const type = MIME[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": type });
      fs.createReadStream(filePath).pipe(res);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(String(err));
    }
  });
}

function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      fetch(url)
        .then((res) => {
          if (res.ok) resolve();
          else throw new Error(`status ${res.status}`);
        })
        .catch(() => {
          if (Date.now() - start > timeoutMs) {
            reject(new Error(`Server did not start: ${url}`));
            return;
          }
          setTimeout(tick, 200);
        });
    };
    tick();
  });
}

async function prerenderRoute(browser, url, outFile) {
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.warn(`[prerender-column] console: ${msg.text()}`);
    }
  });
  page.on("pageerror", (err) => {
    console.warn(`[prerender-column] pageerror: ${err.message}`);
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForFunction(
      () =>
        Boolean(
          document.querySelector(
            ".column-article-list, .column-categories, .column-article-detail"
          )
        ),
      { timeout: 90000 }
    );
    const html = await page.content();
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html, "utf8");
    console.log(
      `[prerender-column] ${url} → ${path.relative(buildDir, outFile)}`
    );
  } finally {
    await page.close();
  }
}

async function main() {
  if (process.env.SKIP_COLUMN_PRERENDER === "1") {
    console.log("[prerender-column] SKIP_COLUMN_PRERENDER=1 のためスキップ");
    return;
  }

  if (!fs.existsSync(buildDir)) {
    throw new Error(`build ディレクトリがありません: ${buildDir}`);
  }

  const basePath = getBasePath();
  const publicDir = path.join(rootDir, "public");
  const data = await getColumnData({ publicDir });
  const articleIds = data.articles.map((a) => a.id).filter(Boolean);

  const routes = [
    `${basePath}/column`,
    `${basePath}/column/categories`,
    ...articleIds.map((id) => `${basePath}/column/${id}`),
  ];

  const server = createStaticServer(basePath);
  await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${PORT}`;

  try {
    await waitForServer(`${origin}${basePath || ""}/`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      for (const route of routes) {
        const url = `${origin}${route.startsWith("/") ? route : `/${route}`}`;
        const outFile = routeToOutputPath(route, basePath);
        await prerenderRoute(browser, url, outFile);
      }
    } finally {
      await browser.close();
    }
  } finally {
    server.close();
  }

  console.log(`[prerender-column] ${routes.length} ページをプリレンダしました`);
}

main().catch((err) => {
  console.error("[prerender-column]", err);
  process.exit(1);
});
