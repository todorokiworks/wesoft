/**
 * デプロイ先に応じたベースパス・URLの設定
 *
 * - テスト (GitHub Pages): REACT_APP_BASE_PATH=/wesoft
 * - 本番 (納品): REACT_APP_BASE_PATH 未設定 → ルートで動作
 */

/** データ取得用のベースURL（fetchのパスに付与） */
export const getDataBaseUrl = (): string => {
  const basePath = process.env.REACT_APP_BASE_PATH;
  if (basePath) {
    return basePath.startsWith("/") ? basePath : `/${basePath}`;
  }
  if (process.env.PUBLIC_URL) {
    try {
      const pathname = new URL(process.env.PUBLIC_URL).pathname;
      return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    } catch {
      return "";
    }
  }
  return "";
};

/** React Routerのbasename */
export const getRouterBasename = (): string => getDataBaseUrl();

/**
 * JSONデータ等の画像パスにベースパスを付与
 * /image/xxx のような相対パスを /wesoft/image/xxx に変換
 */
export const getImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = getDataBaseUrl();
  if (!base) return url;
  return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
};
