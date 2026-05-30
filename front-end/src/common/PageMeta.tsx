import React, { useEffect } from "react";
import type { PageMeta as PageMetaType } from "../seo/pageMeta";

function upsertMetaName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export type PageMetaProps = PageMetaType;

/**
 * document.title と meta description を設定（SPA 内遷移用）
 */
const PageMeta: React.FC<PageMetaProps> = ({ title, description }) => {
  useEffect(() => {
    document.title = title;
    upsertMetaName("description", description);
    upsertMetaProperty("og:title", title);
    upsertMetaProperty("og:description", description);
    upsertMetaProperty("og:type", "article");
  }, [title, description]);

  return null;
};

export default PageMeta;
