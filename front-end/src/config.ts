/**
 * 納品環境は常にルート配信前提。
 * ローカル開発時も PUBLIC_URL=/ でルート配信と同じパス解決にする。
 */

/** アプリのベースパス（先頭スラッシュ付き、未設定時は空文字） */
export const getBasePath = (): string => {
  const envBase = process.env.REACT_APP_BASE_PATH?.trim();
  if (envBase) {
    return envBase.startsWith("/") ? envBase : `/${envBase}`;
  }
  if (process.env.NODE_ENV === "development") {
    return "";
  }
  const publicUrl = process.env.PUBLIC_URL?.trim();
  if (!publicUrl || publicUrl === "/") {
    return "";
  }
  try {
    const pathname = new URL(publicUrl, "http://localhost").pathname;
    if (!pathname || pathname === "/") {
      return "";
    }
    return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  } catch {
    return "";
  }
};

/** @deprecated getBasePath のエイリアス */
export const getDataBaseUrl = (): string => getBasePath();

/** React Router の basename */
export const getRouterBasename = (): string => getBasePath();

/**
 * public 配下の静的アセット URL（/image, /data, /pdf など）
 * 絶対 URL（http/https）はそのまま返す
 */
export const getAssetUrl = (path: string | undefined): string => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getBasePath();
  return base ? `${base}${normalized}` : normalized;
};

/** 画像パス用（getAssetUrl のエイリアス） */
export const getImageUrl = (url: string | undefined): string => getAssetUrl(url);

/** public/data 配下の JSON 取得 URL */
export const getDataUrl = (filename: string): string => {
  const name = filename.replace(/^\/?data\//, "");
  return getAssetUrl(`/data/${name}`);
};
