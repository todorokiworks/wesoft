export interface ColumnCategory {
  id: string;
  label: string;
}

export interface ColumnArticle {
  id: string;
  title: string;
  category: string;
  /** プレーンテキスト（一覧抜粋・SEO） */
  body: string;
  /** microCMS の HTML 本文（詳細表示用） */
  bodyHtml?: string;
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
