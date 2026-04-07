import "../css/subpage.less";
import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../config";
import PageMeta from "../common/PageMeta";
import SubpageTitle from "../common/SubpageTitle";
import FaqStickyLink from "../common/FaqStickyLink";
import { PAGE_META } from "../seo/pageMeta";

const SERVICE_SOFTWARE_CARDS = [
  {
    image: "/image/img_service_biz01.png",
    alt: "工場・物流をイメージしたイラスト",
    title: "業務システム開発",
    description:
      "製造、物流、卸売などの現場業務を支えるシステムを設計から開発、運用まで一体で対応します。業務の流れや制約を理解したうえで、実務に定着する仕組みを構築します。",
  },
  {
    image: "/image/img_service_biz02.png",
    alt: "開発・保守をイメージしたイラスト",
    title: "受託・請負開発",
    description:
      "要件整理から設計、開発、テスト、本番稼働、保守までを責任を持って対応します。小規模な案件から一定規模の開発まで、安定した品質で継続的に支えます。",
  },
  {
    image: "/image/img_service_biz03.png",
    alt: "協業・チーム開発をイメージしたイラスト",
    title: "開発体制提供・協業開発",
    description:
      "SIerやパートナー企業との連携を前提に、チームの一員として開発を支援します。既存体制と調和しながら品質と進行を維持し、長期的な協業関係を築きます。",
  },
] as const;

const SERVICE_ACHIEVEMENT_COL1 = [
  "適格請求書発行システム（保守開発中）",
  "人材開発システム（保守開発中）",
  "給与計算パッケージ開発（保守開発中）",
  "お仕事検索サイト（保守開発中）"
];

const SERVICE_ACHIEVEMENT_COL2 = [
  "動物病院会計会計パッケージ開発",
  "会計パッケージアドオン開発",
  "大手石油会社販売システム開発",
  "クラウドサービス課金システム開発"
];

const SERVICE_STRENGTH_ITEMS = [
  {
    image: "/image/img_service_strength01.png",
    alt: "オフィスで打ち合わせをするビジネスパーソン",
    line1: "要件定義から運用まで",
    line2: "一貫対応する受託・請負開発",
    body:
      "要件検討から設計、開発、運用までを分断せず、一つの流れとしてチームで関わり続けます。全体を見通した判断により、短期的な完成だけでなく、長期的に使い続けられる安定した仕組みを実現します。",
  },
  {
    image: "/image/img_service_strength02.png",
    alt: "サーバールームで端末を操作するエンジニア",
    line1: "多様な開発手法を用いた",
    line2: "中小～大規模システム開発",
    body:
      "開発規模や進め方に固定されず、小規模な反復型開発から一定規模の計画型開発まで柔軟に対応します。多様な技術領域と環境に適応できる体制により、目的に合った最適な開発を選択できます。",
  },
  {
    image: "/image/img_service_strength03.png",
    alt: "デジタルサービスを表すアイコンとイメージ",
    line1: "SIer・パートナー案件で培った",
    line2: "開発品質",
    body:
      "SIerやパートナー企業との協業で培った品質基準と進行管理の経験を基盤に、外部連携の中でも品質を揺らがせない開発を行います。信頼を前提とした対応力が、安定した成果提供を支えています。",
  },
] as const;

const Service: React.FC = () => {
  return (
    <div className="subpage subpage--service">
      <PageMeta {...PAGE_META["/service"]} />
      <section className="subpage-section service-mv" aria-label="サービス紹介">
        <SubpageTitle titleJa="サービス" titleEn="service" as="h1" />
        <FaqStickyLink />
        <div className="service-mv__catchphrase">
          <p className="service-mv__catchphrase-text">
            業務システム・Webシステムの受託・請負開発
          </p>
          <span className="service-mv__catchphrase-line" aria-hidden />
        </div>
        <div className="service-mv__figure">
          <img
            src={getImageUrl("/image/img_service_mv.png")}
            alt="クラウドとネットワークを表現したサービスメインビジュアル"
          />
        </div>
        <p className="service-mv__description">
          ソフトウェア・システム開発を幅広く支援しており、Webアプリ、スマホアプリ、業務システム、クラウドサービスなどの受託開発を主力としています。「使われ続けるシステム」を目指し、要件定義から設計、開発、テスト、保守運用まで一貫したサービスを提供することで、お客様のビジネスを支援します。
        </p>
      </section>

      <section
        className="subpage-section service-strength"
        aria-labelledby="service-strength-heading"
      >
        <h2 id="service-strength-heading" className="service-strength__banner">
          ウィソフトの受託・請負開発の<strong>強み</strong>
        </h2>
        <div className="service-strength__inner">
          {SERVICE_STRENGTH_ITEMS.map((item) => (
            <article key={item.image} className="service-strength__row">
              <div className="service-strength__media">
                <img src={getImageUrl(item.image)} alt={item.alt} />
              </div>
              <div className="service-strength__body">
                <h3 className="service-strength__heading">
                  <span className="service-strength__heading-line1">
                    {item.line1}
                  </span>
                  <span className="service-strength__heading-line2">
                    {item.line2}
                  </span>
                </h3>
                <p className="service-strength__text">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className="subpage-section service-business"
        aria-labelledby="service-business-software-heading"
      >
        <div className="service-business__inner">
          <div className="service-business__block">
            <h2
              id="service-business-software-heading"
              className="service-business__section-title"
            >
              <span
                className="service-business__section-title-bar"
                aria-hidden
              />
              <span className="service-business__section-title-text">
                ソフトウェア開発事業
              </span>
            </h2>
            <p className="service-business__lead">
              様々な分野において、言語・OSを問わずオープンシステム全般の要件検討から本番運用まで受託・請負の経験を有しており、小規模のアジャイル開発から大規模なウォーターフォール開発まで幅広く対応しております。
            </p>

            <div className="service-business__grid3">
              {SERVICE_SOFTWARE_CARDS.map((card) => (
                <article key={card.image} className="service-business__card">
                  <div className="service-business__card-img">
                    <img
                      src={getImageUrl(card.image)}
                      alt={card.alt}
                    />
                  </div>
                  <h3 className="service-business__card-title">
                    {card.title}
                  </h3>
                  <p className="service-business__card-text">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="service-business__achievements">
              <h3 className="service-business__achievements-title">
                代表的な開発実績
              </h3>
              <div className="service-business__achievements-cols">
                <ul className="service-business__achievements-list">
                  {SERVICE_ACHIEVEMENT_COL1.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <ul className="service-business__achievements-list">
                  {SERVICE_ACHIEVEMENT_COL2.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="service-business__cta-wrap">
              <Link
                to="/development"
                className="service-business__cta"
              >
                開発実績はこちら
              </Link>
            </div>
          </div>

          <div className="service-business__lower">
            <div className="service-business__lower-col">
              <h2 className="service-business__section-title">
                <span
                  className="service-business__section-title-bar"
                  aria-hidden
                />
                <span className="service-business__section-title-text">
                  教育事業
                </span>
              </h2>
              <div className="service-business__lower-media">
                <img
                  src={getImageUrl("/image/img_service_biz04.png")}
                  alt="研修・講義の様子"
                />
              </div>
              <p className="service-business__lower-text">
                1対1、人数によって教室設立も展開しております。
              </p>
              <p className="service-business__lower-subhead">［教育内容］</p>
              <ul className="service-business__lower-list">
                <li>対外国人の日本語教育</li>
                <li>対日本人の中国語教育</li>
              </ul>
            </div>

            <div className="service-business__lower-col">
              <h2 className="service-business__section-title">
                <span
                  className="service-business__section-title-bar"
                  aria-hidden
                />
                <span className="service-business__section-title-text">
                  販売事業
                </span>
              </h2>
              <div className="service-business__lower-media">
                <img
                  src={getImageUrl("/image/img_service_biz05.png")}
                  alt="データとネットワークをイメージしたグラフィック"
                />
              </div>
              <p className="service-business__lower-text">
                日中間における生活雑貨やデジタル製品などの輸出入及び販売事業を展開しております。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Service;
