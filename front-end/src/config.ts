/**
 * 納品環境は常にルート配信前提のため、ベースパスは利用しない。
 */

/** データ取得用のベースURL（fetchのパスに付与） */
export const getDataBaseUrl = (): string => {
  return "";
};

/** React Routerのbasename */
export const getRouterBasename = (): string => getDataBaseUrl();

/**
 * JSONデータ等の画像URLを正規化
 */
export const getImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return url;
  return `/${url}`;
};
