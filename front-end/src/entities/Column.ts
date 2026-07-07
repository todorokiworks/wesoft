export interface ColumnCategory {
  id: string;
  label: string;
}

export interface ColumnArticle {
  id: string;
  title: string;
  category: string;
  /** 公開日（microCMS の publishedAt / createdAt、ISO 8601） */
  publishedAt?: string;
  /** プレーンテキスト（一覧抜粋・SEO） */
  body: string;
  /** microCMS の HTML 本文（詳細表示用） */
  bodyHtml?: string;
  /** microCMS の metaDiscription（meta description 用、未設定時は本文から生成） */
  metaDescription?: string;
  thumbnail: string;
}

export interface ColumnData {
  categories: ColumnCategory[];
  articles: ColumnArticle[];
}

export function getCategoryLabel(
  data: ColumnData | null,
  categoryId: string
): string {
  if (!data) return categoryId;
  return data.categories.find((c) => c.id === categoryId)?.label ?? categoryId;
}

/** 記事の公開日を表示用に整形（例: 2026年6月15日） */
export function formatArticleDate(iso?: string): string | null {
  if (!iso?.trim()) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
