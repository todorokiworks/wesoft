import "../css/subpage.less";
import React from "react";
import { getImageUrl } from "../config";
import PageMeta from "../common/PageMeta";
import SubpageTitle from "../common/SubpageTitle";
import FaqStickyLink from "../common/FaqStickyLink";
import { PAGE_META } from "../seo/pageMeta";

const IEEE_PAPERS = [
  {
    title: "多層情報相互作用を用いた新しい分散重力検索アルゴリズム",
    href: "https://doi.org/10.1109/ACCESS.2021.3136239",
  },
  {
    title: "TDSD: 三重異性検索ダイナミクスに基づく新しい進化アルゴリズム",
    href: "https://doi.org/10.1109/ACCESS.2020.2989029",
  },
];

const ScientificCareer: React.FC = () => {
  return (
    <div className="subpage subpage--scientific-career">
      <PageMeta {...PAGE_META["/scientific_career"]} />
      <SubpageTitle titleJa="研究事業" titleEn="Research" as="h1" />
      <FaqStickyLink />
      <section
        className="subpage-section scientific-career scientific-career--dark"
        aria-label="研究事業の概要"
      >
        <div className="scientific-career__inner">
          <header className="scientific-career__hero">
            <h2 className="scientific-career__hero-title">
              <span
                className="scientific-career__hero-bar"
                aria-hidden
              />
              <span className="scientific-career__hero-title-text">
                研究・技術基盤受託開発を支える、もう一つの実績
              </span>
            </h2>
            <p className="scientific-career__lead">
              ウィソフトでは、受託開発を主軸としながら、その品質と将来性を支える技術基盤として、研究活動にも継続して取り組んでいます。技術の理解と応用力を高めることで、日々の開発業務の土台を強化しています。
            </p>
          </header>

          <div className="scientific-career__row">
            <div className="scientific-career__col scientific-career__col--text">
              <h3 className="scientific-career__subhead">
                研究分野A（人工知能）研究
              </h3>
              <p className="scientific-career__body">
                ディープラーニングを中心とした人工知能分野において、識別や予測精度の向上を目的とした研究を行っています。単一技術にとどまらず、複数の技術を組み合わせることで、将来的な実用化につながる可能性を見据えた研究を進めています。
              </p>
            </div>
            <div className="scientific-career__col scientific-career__col--media">
              <img
                src={getImageUrl("/image/img_sc_ai.png")}
                alt="WE Ai ロゴ（power by WeAI）"
              />
            </div>
          </div>

          <div className="scientific-career__publications">
            <p className="scientific-career__publications-banner">
              利用研究者がIEEE（技術専門機関）で発表した論文の例
            </p>
            <ul className="scientific-career__paper-list">
              {IEEE_PAPERS.map((paper) => (
                <li key={paper.href}>
                  <span className="scientific-career__paper-title">
                    {paper.title}
                  </span>
                  <a
                    href={paper.href}
                    className="scientific-career__paper-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {paper.href}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="scientific-career__row--joint">
            <h3 className="scientific-career__subhead scientific-career__subhead--ruled">
              共同研究実績（徳島大学）
            </h3>
            <div className="scientific-career__row scientific-career__row--joint">
              <div className="scientific-career__col scientific-career__col--text">

                <p className="scientific-career__body">
                  徳島大学との共同研究として、AIを活用した洋上風力発電向け風車レイアウト最適化システムの研究開発に参画。社会インフラ分野における高度な最適化技術の実装を通じ、実用化を見据えた技術基盤の強化に取り組んでいます。
                </p>
              </div>
              <div className="scientific-career__col scientific-career__col--media">
                <img
                  src={getImageUrl("/image/img_sc_case.png")}
                  alt="洋上風力発電の風車群"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScientificCareer;
