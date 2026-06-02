/**
 * microCMS マネジメント API: 画像アップロード（POST /api/v1/media）
 */
const fs = require("fs");
const path = require("path");

const MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function getServiceDomain() {
  const domain =
    process.env.REACT_APP_MICROCMS_SERVICE_DOMAIN?.trim() ||
    process.env.MICROCMS_SERVICE_DOMAIN?.trim();
  if (!domain) {
    throw new Error("REACT_APP_MICROCMS_SERVICE_DOMAIN が未設定です");
  }
  return domain;
}

function getApiKey() {
  const key =
    process.env.MICROCMS_WRITE_API_KEY?.trim() ||
    process.env.REACT_APP_MICROCMS_WRITE_API_KEY?.trim() ||
    process.env.REACT_APP_MICROCMS_API_KEY?.trim();
  if (!key) {
    throw new Error("MICROCMS_WRITE_API_KEY が未設定です");
  }
  return key;
}

function managementApiBase() {
  return `https://${getServiceDomain()}.microcms-management.io/api/v1`;
}

/**
 * column.json の thumbnail をローカルファイルパスに解決
 * @returns {string | null} 絶対パス。既に https の場合は null（呼び出し側で URL をそのまま使用）
 */
function resolveLocalImagePath(thumbnail, publicDir) {
  const raw = thumbnail?.trim();
  if (!raw || raw.startsWith("http://") || raw.startsWith("https://")) {
    return null;
  }
  const rel = raw.replace(/^\//, "");
  const filePath = path.join(publicDir, rel);
  if (!fs.existsSync(filePath)) {
    throw new Error(`画像ファイルが見つかりません: ${filePath}（thumbnail: ${raw}）`);
  }
  return filePath;
}

/**
 * ローカル画像を microCMS にアップロードし、画像 URL を返す
 */
async function uploadImageFile(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `画像が 5MB を超えています（API 上限）: ${filePath} (${stat.size} bytes)`
    );
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) {
    throw new Error(`未対応の画像形式です: ${ext}（${filePath}）`);
  }

  const buffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: mime }), fileName);

  const res = await fetch(`${managementApiBase()}/media`, {
    method: "POST",
    headers: {
      "X-MICROCMS-API-KEY": getApiKey(),
    },
    body: form,
  });

  if (!res.ok) {
    let detail = "";
    try {
      const json = await res.json();
      detail = json.message || JSON.stringify(json);
    } catch {
      detail = await res.text();
    }
    if (res.status === 403 || detail.includes("Forbidden")) {
      throw new Error(
        "メディアのアップロード権限がありません。microCMS 管理画面 → API キー →「メディアのアップロード」を有効にしてください"
      );
    }
    throw new Error(`メディアアップロード失敗: ${res.status} ${detail}`);
  }

  const json = await res.json();
  if (!json.url) {
    throw new Error(`メディアアップロードのレスポンスに url がありません: ${filePath}`);
  }
  return json.url;
}

module.exports = {
  resolveLocalImagePath,
  uploadImageFile,
};
