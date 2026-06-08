import { getDataUrl } from "../config";
import type { ColumnData } from "../entities/Column";
import {
  fetchColumnFromMicroCms,
  isMicroCmsConfigured,
} from "./microcmsColumn";

/** 本番ビルドは prebuild で同期した column.json を優先（プリレンダ・SEO 向け） */
export async function fetchColumnData(): Promise<ColumnData> {
  const loadJson = async (): Promise<ColumnData> => {
    const res = await fetch(`${getDataUrl("column.json")}?t=${Date.now()}`);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json() as Promise<ColumnData>;
  };

  if (process.env.NODE_ENV === "production") {
    return loadJson();
  }

  if (isMicroCmsConfigured()) {
    return fetchColumnFromMicroCms();
  }

  return loadJson();
}
