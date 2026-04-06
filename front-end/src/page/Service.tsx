import "../css/subpage.less";
import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../config";
import SubpageTitle from "../common/SubpageTitle";
import FaqStickyLink from "../common/FaqStickyLink";

const SERVICE_SOFTWARE_CARDS = [
  {
    image: "/image/img_service_biz01.png",
    alt: "工場・物流をイメージしたイラスト",
    title: "業務システム開発",
    description:
      "製造・物流・小売など、現場業務に根ざしたシステムの企画から開発までを担当します。在庫管理、生産管理、販売管理など、お客様の課題に即した業務システムを構築します。",
  },
  {
    image: "/image/img_service_biz02.png",
    alt: "開発・保守をイメージしたイラスト",
    title: "受託・請負開発",
    description:
      "要件定義、基本・詳細設計、開発、テスト、保守運用までを一括でお引き受けします。お客様のビジネス変化に対応し、継続的に価値を提供できるシステムへと育てていきます。",
  },
  {
    image: "/image/img_service_biz03.png",
    alt: "協業・チーム開発をイメージしたイラスト",
    title: "開発体制提供・協業開発",
    description:
      "SIer様やパートナー企業との協業を通じて、エンジニアの投入や工程の一部担当など、柔軟な開発体制の構築をサポートします。品質とスケジュールを両立した協働開発を実現します。",
  },
] as const;

const SERVICE_ACHIEVEMENT_COL1 = [
  "通信キャリア向け請求・料金システム",
  "製造業向け生産管理・トレーサビリティシステム",
  "公共系向け業務ワークフローシステム",
];

const SERVICE_ACHIEVEMENT_COL2 = [
  "金融機関向け社内ポータル・基幹システム連携",
  "小売向け多店舗在庫・発注管理システム",
  "人事評価・勤怠・給与連携の人事労務基盤",
];

const SERVICE_STRENGTH_ITEMS = [
  {
    image: "/image/img_service_strength01.png",
    alt: "オフィスで打ち合わせをするビジネスパーソン",
    line1: "要件定義から運用まで",
    line2: "一貫対応する受託・請負開発",
    body:
      "要件定義や業務分析から設計、開発、テスト、運用保守までを一つのチームで切れ目なく支援します。工程ごとに担当が分断されることなく知識と責任を持ち続けることで、長く安定して使い続けられるシステムの実現を目指します。",
  },
  {
    image: "/image/img_service_strength02.png",
    alt: "サーバールームで端末を操作するエンジニア",
    line1: "多様な開発手法を用いた",
    line2: "中小～大規模システム開発",
    body:
      "アジャイルなどの反復型開発から、計画性を重視した大規模の進行まで、プロジェクトの規模や特性に応じて最適な進め方をご提案します。さまざまな技術領域にも柔軟に対応し、中小規模から大規模まで幅広いシステム開発をお手伝いします。",
  },
  {
    image: "/image/img_service_strength03.png",
    alt: "デジタルサービスを表すアイコンとイメージ",
    line1: "SIer・パートナー案件で培った",
    line2: "開発品質",
    body:
      "SIer様やパートナー企業との協業で培ってきた品質基準や進捗管理のノウハウを活かし、透明性の高いコミュニケーションと確実なマイルストーン管理を行います。信頼できる成果物と安定したプロジェクト運営をお約束します。",
  },
] as const;

const Service: React.FC = () => {
  return (
    <div className="subpage subpage--service">
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
              アジャイルやウォーターフォールなど、プロジェクトに適した開発手法を組み合わせ、要件の整理から実装・テストまでを支援します。オンプレミスからクラウドまで、最適な環境でのシステム構築をご提案します。
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
                教室を確保し、講師による対面とオンラインを組み合わせた教育サービスを提供しています。企業研修から個人向け講座まで、目的に応じたカリキュラムをご用意します。
              </p>
              <p className="service-business__lower-subhead">［教育内容］</p>
              <ul className="service-business__lower-list">
                <li>在日外国人向け日本語教育プログラム</li>
                <li>日本人向け中国語教育プログラム</li>
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
                日本と中国をはじめとする海外との間で、日用品やデジタルコンテンツなどの輸出入・販売を行っています。現地のニーズを踏まえた商材選定と安定的なサプライチェーンにより、ビジネスを支援します。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Service;
