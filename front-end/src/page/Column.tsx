import "../css/subpage.less";
import React, { useEffect, useMemo, useState } from "react";
import type { To } from "react-router-dom";
import {
  Link,
  NavLink,
  Outlet,
  createSearchParams,
  useLocation,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
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

/** 親レイアウトから子ルートへ渡す Outlet 用コンテキスト（column.json のパース結果） */
export type ColumnOutletContext = {
  data: ColumnEntity.ColumnData;
};

/**
 * 一覧カード用に本文を短い文字列に圧縮する。
 * 改行・連続空白を1スペースにし、maxLen を超えたら切り詰めて末尾に「…」を付与する。
 */
function excerptText(body: string, maxLen: number): string {
  const flat = body.replace(/\s+/g, " ").trim();
  if (flat.length <= maxLen) {
    return flat;
  }
  return `${flat.slice(0, maxLen)}…`;
}

/**
 * column.json を1回だけ取得するフック。
 * マウント時に fetch し、loading / error / data を返す。成功時は categories と articles を含むオブジェクトが入る。
 */
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

/**
 * 現在の pathname から「column セグメントより後ろ」だけを取り出し、一覧 index か・カテゴリ一覧ページかを判定する。
 * サイドバーで「すべて」に current スタイルを付けるかどうかに使う。
 */
const sidebarPathSegments = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const colIdx = segments.lastIndexOf("column");
  const rest = colIdx >= 0 ? segments.slice(colIdx + 1) : [];
  const isListIndex = rest.length === 0;
  const isCategoriesPage = rest[0] === "categories";
  return { isListIndex, isCategoriesPage, rest };
};

type ColumnListLinkTarget = { to: To; relative?: "path" };

/**
 * /column 一覧（オプションで ?category=）への Link 用。
 * /column/categories や /column/:articleId のように「column の右にパスがある」ときは relative="path" と .. で
 * 実際の URL を1階層上げ、basename 付き環境でもカテゴリ一覧から一覧へ確実に切り替わるようにする。
 */
function columnListLink(
  pathname: string,
  categoryId: string | null
): ColumnListLinkTarget {
  const { rest } = sidebarPathSegments(pathname);
  const nestedUnderColumn = rest.length > 0;

  if (categoryId === null) {
    if (nestedUnderColumn) {
      return { to: { pathname: ".." }, relative: "path" };
    }
    return { to: "/column" };
  }

  const search = createSearchParams({ category: categoryId }).toString();
  if (nestedUnderColumn) {
    return { to: { pathname: "..", search }, relative: "path" };
  }
  return { to: { pathname: "/column", search } };
}

/**
 * 本文を空行境界でパラグラフ単位に分割する。
 * 2ブロック以上ある場合は先頭だけを before（画像より前）、残りを after（画像より後）にし、詳細ページで中央に画像を挟めるようにする。
 */
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

/**
 * カテゴリ別ナビ。「すべて」は /column、各カテゴリは ?category= のクエリ付きで一覧に遷移。
 * クエリと pathname を照合し、該当リンクに --current クラスを付ける。
 */
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
  const allLink = columnListLink(location.pathname, null);

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
              to={allLink.to}
              {...(allLink.relative ? { relative: allLink.relative } : {})}
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
            const catLink = columnListLink(location.pathname, c.id);
            return (
              <li key={c.id} className="column-sidebar__list-item">
                <Link
                  to={catLink.to}
                  {...(catLink.relative ? { relative: catLink.relative } : {})}
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

/**
 * コラム親ルート。column.json を読み込み、共通の見出し・FAQリンク・2カラム枠を描画する。
 * メイン領域は <Outlet /> で子ルート（一覧 / カテゴリ一覧 / 記事詳細）を差し替え、data を Outlet context で渡す。
 */
const ColumnLayout: React.FC = () => {
  const { data, loading, error } = useColumnJson();
  const location = useLocation();

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
            <Outlet
              key={`${location.pathname}${location.search}`}
              context={{ data } satisfies ColumnOutletContext}
            />
          </div>
          <aside className="column-sidebar" aria-label="カテゴリー">
            <ColumnSidebarLinks data={data} />
          </aside>
        </div>
      </section>
    </div>
  );
};

/**
 * /column の index。?category= があればそのカテゴリに絞り込み、なければ全記事。
 * クライアント側で PAGE_SIZE 件ずつスライスし、Ant Design Pagination でページング。カテゴリ変更時はページを1に戻す。
 * SEO 用の title はカテゴリ付きのときだけプレフィックスを付ける。
 */
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

/**
 * /column/categories。全カテゴリをグリッド表示し、各カードから該当 ?category= の一覧へリンクする。
 * 件数は articles を category id でカウントした値を表示する。
 */
export const ColumnCategoriesPage: React.FC = () => {
  const { data } = useOutletContext<ColumnOutletContext>();
  const location = useLocation();

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
          const cardLink = columnListLink(location.pathname, c.id);
          return (
            <li key={c.id} className="column-categories__item">
              <Link
                to={cardLink.to}
                {...(cardLink.relative ? { relative: cardLink.relative } : {})}
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

/**
 * /column/:articleId。URL パラメータの articleId で記事を検索し、見つからなければ案内のみ表示。
 * 見つかった場合は splitArticleBody で前後に分け、サムネ画像を段落の間に挿入して読みやすく並べる。PageMeta は記事単位。
 */
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
