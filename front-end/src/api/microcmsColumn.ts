import type {
  ColumnArticle,
  ColumnCategory,
  ColumnData,
} from "../entities/Column";

type MicroCmsListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

type MicroCmsImage = {
  url: string;
  height?: number;
  width?: number;
};

type MicroCmsCategoryRef = {
  id: string;
  name?: string;
};

/** wesoft-column API のレコード */
type WesoftColumnRecord = {
  id: string;
  title?: string;
  content?: string;
  eyecatch?: MicroCmsImage | null;
  category?: MicroCmsCategoryRef | null;
};

const DEFAULT_ENDPOINT = "wesoft-column";

export function isMicroCmsConfigured(): boolean {
  return Boolean(
    process.env.REACT_APP_MICROCMS_SERVICE_DOMAIN?.trim() &&
      process.env.REACT_APP_MICROCMS_API_KEY?.trim()
  );
}

function microCmsBaseUrl(): string {
  const domain = process.env.REACT_APP_MICROCMS_SERVICE_DOMAIN?.trim() ?? "";
  return `https://${domain}.microcms.io/api/v1`;
}

function microCmsHeaders(): HeadersInit {
  return {
    "X-MICROCMS-API-KEY": process.env.REACT_APP_MICROCMS_API_KEY?.trim() ?? "",
  };
}

function getEndpoint(): string {
  return (
    process.env.REACT_APP_MICROCMS_ARTICLE_ENDPOINT?.trim() || DEFAULT_ENDPOINT
  );
}

/** HTML をプレーンテキストに（一覧の抜粋・SEO 用） */
export function stripHtml(html: string): string {
  if (typeof document !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
  }
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildCategories(records: WesoftColumnRecord[]): ColumnCategory[] {
  const map = new Map<string, string>();
  for (const record of records) {
    const cat = record.category;
    if (!cat?.id) continue;
    map.set(cat.id, cat.name?.trim() || cat.id);
  }
  return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
}

function mapArticle(record: WesoftColumnRecord): ColumnArticle {
  const html = record.content?.trim() ?? "";
  const plain = html ? stripHtml(html) : "";

  return {
    id: record.id,
    title: record.title?.trim() ?? "",
    category: record.category?.id?.trim() ?? "",
    body: plain,
    bodyHtml: html || undefined,
    thumbnail: record.eyecatch?.url?.trim() ?? "",
  };
}

async function fetchWesoftColumnList(): Promise<WesoftColumnRecord[]> {
  const endpoint = getEndpoint();
  const url = `${microCmsBaseUrl()}/${endpoint}?limit=100&orders=-publishedAt`;
  const res = await fetch(url, { headers: microCmsHeaders() });
  if (!res.ok) {
    throw new Error(`microCMS ${endpoint}: ${res.status}`);
  }
  const json = (await res.json()) as MicroCmsListResponse<WesoftColumnRecord>;
  return json.contents ?? [];
}

/** microCMS（wesoft-column）からコラムデータを取得し、既存 UI 用の形に変換する */
export async function fetchColumnFromMicroCms(): Promise<ColumnData> {
  const records = await fetchWesoftColumnList();
  const categories = buildCategories(records);
  const articles = records.map(mapArticle);
  return { categories, articles };
}
