import "../css/subpage.less";
import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import { getDataBaseUrl, getImageUrl } from "../config";
import PageMeta from "../common/PageMeta";
import SkeletonView from "../common/SkeletonView";
import SubpageTitle from "../common/SubpageTitle";
import * as ColumnEntity from "../entities/Column";
import FaqStickyLink from "../common/FaqStickyLink";
import {
  articlePageMeta,
  COLUMN_CATEGORIES_META,
  COLUMN_INDEX_META,
} from "../seo/pageMeta";

const PAGE_SIZE = 5;

export type ColumnOutletContext = {
  data: ColumnEntity.ColumnData;
};

function excerptText(body: string, maxLen: number): string {
  const flat = body.replace(/\s+/g, " ").trim();
  if (flat.length <= maxLen) {
    return flat;
  }
  return `${flat.slice(0, maxLen)}…`;
}

function useColumnJson(): {
  data: ColumnEntity.ColumnData | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<ColumnEntity.ColumnData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = Date.now();
    fetch(`${getDataBaseUrl()}/data/column.json?t=${t}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((json: ColumnEntity.ColumnData) => {
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError(e.message ?? "load error");
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

const sidebarPathSegments = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const colIdx = segments.lastIndexOf("column");
  const rest = colIdx >= 0 ? segments.slice(colIdx + 1) : [];
  const isListIndex = rest.length === 0;
  const isCategoriesPage = rest[0] === "categories";
  return { isListIndex, isCategoriesPage, rest };
};

/** 空行区切りでブロック分け。先頭を本文前段、画像の後に続きを表示 */
function splitArticleBody(body: string): { before: string[]; after: string[] } {
  const parts = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length <= 1) {
    return { before: parts, after: [] };
  }
  return { before: [parts[0]], after: parts.slice(1) };
}

const ColumnSidebarLinks: React.FC<{ data: ColumnEntity.ColumnData }> = ({
  data,
}) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const activeCategory = searchParams.get("category");
  const { isListIndex, isCategoriesPage } = sidebarPathSegments(
    location.pathname
  );
  const allArticlesCurrent =
    isListIndex && !activeCategory && !isCategoriesPage;

  return (
    <>
      <div className="column-sidebar__head">
        <span className="column-sidebar__head-accent" aria-hidden="true" />
        <h2 className="column-sidebar__heading">カテゴリ</h2>
      </div>
      <nav className="column-sidebar__nav" aria-label="カテゴリナビ">
        <ul className="column-sidebar__list">
          <li className="column-sidebar__list-item">
            <Link
              to="/column"
              className={
                allArticlesCurrent
                  ? "column-sidebar__link column-sidebar__link--current"
                  : "column-sidebar__link"
              }
            >
              <span
                className="column-sidebar__link-icon"
                aria-hidden="true"
              />
              <span className="column-sidebar__link-text">すべて</span>
            </Link>
          </li>
          {data.categories.map((c) => {
            const current = activeCategory === c.id;
            return (
              <li key={c.id} className="column-sidebar__list-item">
                <Link
                  to={`/column?category=${encodeURIComponent(c.id)}`}
                  className={
                    current
                      ? "column-sidebar__link column-sidebar__link--current"
                      : "column-sidebar__link"
                  }
                >
                  <span
                    className="column-sidebar__link-icon"
                    aria-hidden="true"
                  />
                  <span className="column-sidebar__link-text">{c.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

    </>
  );
};

/** レイアウト: サイドバー + 記事エリア（子ルートは Outlet） */
const ColumnLayout: React.FC = () => {
  const { data, loading, error } = useColumnJson();

  if (loading) {
    return <SkeletonView />;
  }

  if (error || !data) {
    return <div className="subpage">Error: {error ?? "no data"}</div>;
  }

  return (
    <div className="subpage subpage--column">
      <SubpageTitle titleJa="コラム" titleEn="column" />
      <FaqStickyLink />
      <section className="subpage-section column-page" aria-label="コラム">
        <div className="column-layout">
          <div className="column-main">
            <Outlet context={{ data } satisfies ColumnOutletContext} />
          </div>
          <aside className="column-sidebar" aria-label="カテゴリー">
            <ColumnSidebarLinks data={data} />
          </aside>
        </div>
      </section>
    </div>
  );
};

export const ColumnListPage: React.FC = () => {
  const { data } = useOutletContext<ColumnOutletContext>();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!categoryFilter) {
      return data.articles;
    }
    return data.articles.filter((a) => a.category === categoryFilter);
  }, [data.articles, categoryFilter]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter]);

  const total = filtered.length;
  const slice = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const listMeta = useMemo(() => {
    if (!categoryFilter) {
      return COLUMN_INDEX_META;
    }
    const label = ColumnEntity.getCategoryLabel(data, categoryFilter);
    return {
      title: `${label}｜${COLUMN_INDEX_META.title}`,
      description: COLUMN_INDEX_META.description,
    };
  }, [categoryFilter, data]);

  return (
    <>
      <PageMeta {...listMeta} />
      <ul className="column-article-list">
        {slice.map((item) => (
          <li key={item.id} className="column-article-card">
            <Link to={`/column/${item.id}`} className="column-article-card__link">
              <div className="column-article-card__header">
                <h2 className="column-article-card__title">
                  <span
                    className="column-article-card__title-accent"
                    aria-hidden="true"
                  />
                  <span className="column-article-card__title-text">
                    {item.title}
                  </span>
                </h2>
              </div>
              <span className="column-article-card__category">
                {ColumnEntity.getCategoryLabel(data, item.category)}
              </span>
              <div className="column-article-card__main">
                <div className="column-article-card__content-row">
                  <div className="column-article-card__thumb">
                    {item.thumbnail ? (
                      <img
                        src={getImageUrl(item.thumbnail)}
                        alt=""
                        className="column-article-card__img"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="column-article-card__img-placeholder"
                        aria-hidden
                      />
                    )}
                  </div>
                  <p className="column-article-card__excerpt">
                    {excerptText(item.body, 160)}
                  </p>
                </div>
                <span className="column-article-card__cta">もっと見る</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      {total > PAGE_SIZE ? (
        <div className="column-pagination">
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={(p) => {
              setPage(p);
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            }}
            showSizeChanger={false}
          />
        </div>
      ) : null}
    </>
  );
};

export const ColumnCategoriesPage: React.FC = () => {
  const { data } = useOutletContext<ColumnOutletContext>();

  return (
    <div className="column-categories">
      <PageMeta {...COLUMN_CATEGORIES_META} />
      <h2 className="column-categories__title">カテゴリ一覧</h2>
      <p className="column-categories__lead">
        興味のあるカテゴリから記事一覧へ移動できます。
      </p>
      <ul className="column-categories__grid">
        {data.categories.map((c) => {
          const count = data.articles.filter((a) => a.category === c.id).length;
          return (
            <li key={c.id} className="column-categories__item">
              <Link
                to={`/column?category=${encodeURIComponent(c.id)}`}
                className="column-categories__card"
              >
                <span className="column-categories__name">{c.label}</span>
                <span className="column-categories__count">{count} 件</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="column-categories__back">
        <NavLink to="/column" className="column-categories__back-link">
          コラム一覧へ戻る
        </NavLink>
      </p>
    </div>
  );
};

export const ColumnArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { data } = useOutletContext<ColumnOutletContext>();

  const article = data.articles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <div className="column-article-missing">
        <PageMeta {...COLUMN_INDEX_META} />
        <p>記事が見つかりません。</p>
        <Link to="/column">コラム一覧へ</Link>
      </div>
    );
  }

  const categoryLabel = ColumnEntity.getCategoryLabel(data, article.category);
  const { before, after } = splitArticleBody(article.body);
  const articleMeta = articlePageMeta(article.title, article.body);

  return (
    <article className="column-article-detail">
      <PageMeta {...articleMeta} />
      <div className="column-article-detail__card">
        <header className="column-article-detail__header">
          <h1 className="column-article-detail__title">
            <span
              className="column-article-detail__title-accent"
              aria-hidden="true"
            />
            <span className="column-article-detail__title-text">
              {article.title}
            </span>
          </h1>
        </header>
        <p className="column-article-detail__category-pill">{categoryLabel}</p>
        <div className="column-article-detail__content">
          {before.map((block, i) => (
            <p key={`col-b-${i}`} className="column-article-detail__para">
              {block}
            </p>
          ))}
          {article.thumbnail ? (
            <figure className="column-article-detail__figure">
              <img
                src={getImageUrl(article.thumbnail)}
                alt=""
                className="column-article-detail__figure-img"
              />
            </figure>
          ) : null}
          {after.map((block, i) => (
            <p key={`col-a-${i}`} className="column-article-detail__para">
              {block}
            </p>
          ))}
        </div>
        <p className="column-article-detail__back">
          <Link to="/column">一覧へ戻る</Link>
        </p>
      </div>
    </article>
  );
};

export default ColumnLayout;
