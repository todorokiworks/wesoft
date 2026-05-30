/**
 * microCMS WRITE API（POST / PUT / PATCH）共通
 * スクリプト専用 — クライアント bundle には含めない
 */
const DEFAULT_ARTICLE_ENDPOINT = "wesoft-column";
const DEFAULT_CATEGORY_ENDPOINT = "categories";

function getServiceDomain() {
  const domain =
    process.env.REACT_APP_MICROCMS_SERVICE_DOMAIN?.trim() ||
    process.env.MICROCMS_SERVICE_DOMAIN?.trim();
  if (!domain) {
    throw new Error(
      "REACT_APP_MICROCMS_SERVICE_DOMAIN が未設定です（.env.local を確認）"
    );
  }
  return domain;
}

function getWriteApiKey() {
  const key =
    process.env.MICROCMS_WRITE_API_KEY?.trim() ||
    process.env.REACT_APP_MICROCMS_WRITE_API_KEY?.trim() ||
    process.env.REACT_APP_MICROCMS_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "MICROCMS_WRITE_API_KEY が未設定です。管理画面で POST/PUT 権限付き API キーを作成してください"
    );
  }
  return key;
}

function getArticleEndpoint() {
  return (
    process.env.REACT_APP_MICROCMS_ARTICLE_ENDPOINT?.trim() ||
    DEFAULT_ARTICLE_ENDPOINT
  );
}

function getCategoryEndpoint() {
  return (
    process.env.REACT_APP_MICROCMS_CATEGORY_ENDPOINT?.trim() ||
    DEFAULT_CATEGORY_ENDPOINT
  );
}

function apiBase() {
  return `https://${getServiceDomain()}.microcms.io/api/v1`;
}

function headers() {
  return {
    "X-MICROCMS-API-KEY": getWriteApiKey(),
    "Content-Type": "application/json",
  };
}

async function parseError(res) {
  let detail = "";
  try {
    const json = await res.json();
    detail = json.message || JSON.stringify(json);
  } catch {
    detail = await res.text();
  }
  return detail;
}

/** GET（既存コンテンツの照合用 — 読み取りキーでも可） */
async function listContents(endpoint, query = "limit=100") {
  const readKey =
    process.env.REACT_APP_MICROCMS_API_KEY?.trim() || getWriteApiKey();
  const url = `${apiBase()}/${endpoint}?${query}`;
  const res = await fetch(url, {
    headers: { "X-MICROCMS-API-KEY": readKey },
  });
  if (!res.ok) {
    throw new Error(`GET ${endpoint}: ${res.status} ${await parseError(res)}`);
  }
  const json = await res.json();
  return json.contents ?? [];
}

async function createContent(endpoint, body) {
  const url = `${apiBase()}/${endpoint}`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await parseError(res);
    if (detail.includes("POST is forbidden")) {
      throw new Error(
        "POST 権限がありません。microCMS 管理画面 → API キーで wesoft-column / categories に POST・PUT を付与したキーを MICROCMS_WRITE_API_KEY に設定してください"
      );
    }
    throw new Error(`POST ${endpoint}: ${res.status} ${detail}`);
  }
  return res.json();
}

async function updateContent(endpoint, contentId, body) {
  const url = `${apiBase()}/${endpoint}/${contentId}`;

  for (const method of ["PATCH", "PUT"]) {
    const res = await fetch(url, {
      method,
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (res.ok) {
      return res.json();
    }
    const detail = await parseError(res);
    if (method === "PATCH" && detail.includes("PATCH is forbidden")) {
      continue;
    }
    throw new Error(
      `${method} ${endpoint}/${contentId}: ${res.status} ${detail}`
    );
  }

  throw new Error(
    `PATCH ${endpoint}/${contentId}: 更新権限がありません。API キーに PATCH 権限を付与してください`
  );
}

module.exports = {
  getArticleEndpoint,
  getCategoryEndpoint,
  listContents,
  createContent,
  updateContent,
};
