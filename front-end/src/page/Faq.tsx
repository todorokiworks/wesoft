import "../css/subpage.less";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDataBaseUrl } from "../config";
import FaqStickyLink from "../common/FaqStickyLink";
import SkeletonView from "../common/SkeletonView";
import SubpageTitle from "../common/SubpageTitle";

type FaqBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "link"; text: string; to: string };

type FaqItem = {
  question: string;
  blocks: FaqBlock[];
};

type FaqPayload = {
  items: FaqItem[];
};

function FaqAnswerBlocks({ blocks }: { blocks: FaqBlock[] }) {
  return (
    <>
      {blocks.map((block, bi) => {
        if (block.type === "p") {
          return (
            <p key={`b-${bi}`} className="faq-item__text">
              {block.text}
            </p>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={`b-${bi}`} className="faq-item__list">
              {block.items.map((line, li) => (
                <li key={li}>{line}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "link") {
          return (
            <p key={`b-${bi}`} className="faq-item__link-wrap">
              <Link to={block.to} className="faq-item__link">
                {block.text}
              </Link>
            </p>
          );
        }
        return null;
      })}
    </>
  );
}

const Faq: React.FC = () => {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  const toggle = useCallback((index: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const t = Date.now();
    fetch(`${getDataBaseUrl()}/data/faq.json?t=${t}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data: FaqPayload) => {
        setItems(data.items ?? []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const panelIds = useMemo(
    () => items.map((_, i) => `faq-answer-${i}`),
    [items],
  );

  if (loading) {
    return <SkeletonView />;
  }

  if (error) {
    return (
      <div className="subpage subpage--faq">
        <div className="faq-error">読み込みに失敗しました: {error}</div>
      </div>
    );
  }

  return (
    <div className="subpage subpage--faq">
      <SubpageTitle titleJa="よくある質問" titleEn="faq" as="h1" />

      <section className="subpage-section faq-section" aria-label="よくある質問一覧">
        <div className="faq-accordion" role="list">
          {items.map((item, index) => {
            const isOpen = open.has(index);
            const answerId = panelIds[index];
            return (
              <article
                key={answerId}
                className="faq-item"
                role="listitem"
              >
                <h2 className="faq-item__heading">
                  <button
                    type="button"
                    id={`faq-q-${index}`}
                    className="faq-item__trigger"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() => toggle(index)}
                  >
                    <span className="faq-item__q-badge" aria-hidden>
                      Q
                    </span>
                    <span className="faq-item__q-text">{item.question}</span>
                    <span
                      className={
                        isOpen
                          ? "faq-item__chevron faq-item__chevron--open"
                          : "faq-item__chevron"
                      }
                      aria-hidden
                    />
                  </button>
                </h2>
                <div
                  id={answerId}
                  className={
                    isOpen
                      ? "faq-item__panel faq-item__panel--open"
                      : "faq-item__panel"
                  }
                  role="region"
                  aria-labelledby={`faq-q-${index}`}
                  aria-hidden={!isOpen}
                >
                  <div className="faq-item__panel-inner">
                    <span className="faq-item__a-badge" aria-hidden>
                      A
                    </span>
                    <div className="faq-item__body">
                      <FaqAnswerBlocks blocks={item.blocks} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <FaqStickyLink />
    </div>
  );
};

export default Faq;
