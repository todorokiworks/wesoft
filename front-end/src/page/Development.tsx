import "../css/subpage.less";
import React, { useState } from "react";
import { getImageUrl } from "../config";
import PageMeta from "../common/PageMeta";
import SubpageTitle from "../common/SubpageTitle";
import FaqStickyLink from "../common/FaqStickyLink";
import { PAGE_META } from "../seo/pageMeta";

type DevelopmentCaseDetail = {
  id: string;
  title: string;
  alt: string;
  challenges: string[];
  solutions: string[];
  results: string[];
  notes: {
    language: string;
    environment: string;
    duration: string;
  };
};

const DEVELOPMENT_CASES: DevelopmentCaseDetail[] = [
  {
    id: "01",
    title: "クラウド経費精算システム",
    alt: "インフラ管理用EDIシステムのイメージ",
    challenges: [
      "全国規模で展開する物流拠点の在庫、入出荷情報をリアルタイムで把握したい。",
      "既存のEDIシステムは処理速度が遅く、データの不整合が発生しやすい。",
      "セキュリティレベルの向上を図り、外部サイバー攻撃への耐性を高める。",
    ],
    solutions: [
      "クラウド基盤を採用し、システムの可用性と拡張性を大幅に向上させた。",
      "独自のデータ同期アルゴリズムを開発し、不整合をゼロに抑える仕組みを構築。",
      "多要素認証と通信の暗号化を徹底し、セキュリティ対策を強化。",
    ],
    results: [
      "処理スピードが従来比3倍に向上し、業務効率化を実現。",
      "システムダウンタイムがほぼゼロになり、安定稼働を継続。",
      "セキュリティ事故の発生リスクを大幅に低減させた。",
    ],
    notes: {
      language: "Go, Python, TypeScript",
      environment: "AWS (EC2, RDS, S3), Docker, Kubernetes",
      duration: "10ヶ月",
    },
  },
  {
    id: "02",
    title: "大手専門技術商社の\n各システムデータの集約・統合・連携",
    alt: "需要予測・在庫最適化のイメージ",
    challenges: [
      "過去の販売データに基づいた需要予測が不正確で、在庫過多や欠品が頻発。",
      "予測精度の向上により、コスト削減と売上最大化を同時に達成したい。",
    ],
    solutions: [
      "深層学習アルゴリズムを採用し、過去の販売実績や気象データ、SNSトレンドなどを統合的に分析。",
      "リアルタイムでの需要変動に対応可能な予測モデルを構築。",
    ],
    results: [
      "予測精度が従来比で20%向上し、在庫コストを15%削減。",
      "欠品による機会損失を大幅に低減し、売上向上に寄与。",
    ],
    notes: {
      language: "Python",
      environment: "Google Cloud (Vertex AI, BigQuery), PyTorch",
      duration: "8ヶ月",
    },
  },
  {
    id: "03",
    title: "洋上風力発電レイアウト最適化プラットフォーム",
    alt: "再生可能エネルギー監視のイメージ",
    challenges: [
      "各地に点在する太陽光・風力発電所の稼働状況をリアルタイムで一括監視したい。",
      "故障予兆を早期に検知し、メンテナンスコストの最適化を図りたい。",
    ],
    solutions: [
      "IoTデバイスを活用し、発電量や機器のステータスをクラウドへリアルタイム送信。",
      "異常検知AIを導入し、通常とは異なる挙動を自動的にアラート通知。",
    ],
    results: [
      "遠隔監視により現地確認の頻度が減り、運用コストを30%削減。",
      "故障の早期発見により、売電機会の損失を最小限に抑えた。",
    ],
    notes: {
      language: "C++, Java, JavaScript",
      environment: "Azure (IoT Hub, Stream Analytics), Cosmos DB",
      duration: "12ヶ月",
    },
  },
  {
    id: "04",
    title: "給与計算パッケージ構築",
    alt: "電子決済プラットフォームのイメージ",
    challenges: [
      "高いセキュリティ水準と、大量のトランザクションを高速で処理する能力が求められる。",
      "既存の決済システムとの連携をスムーズに行いたい。",
    ],
    solutions: [
      "マイクロサービスアーキテクチャを採用し、スケーラビリティと保守性を確保。",
      "ブロックチェーン技術を一部導入し、取引の透明性と改ざん防止を強化。",
    ],
    results: [
      "秒間数万件の決済処理を安定して実行可能。",
      "セキュリティ監査をクリアし、高い信頼性を獲得。",
    ],
    notes: {
      language: "Java, Kotlin",
      environment: "AWS (Lambda, DynamoDB), Hyperledger Fabric",
      duration: "18ヶ月",
    },
  },
  {
    id: "05",
    title: "適格請求書発行パッケージ開発",
    alt: "遠隔医療診断支援のイメージ",
    challenges: [
      "離島や僻地の患者が専門医の診察を受けるためのハードルが高い。",
      "高解像度の画像データを遅延なく共有し、正確な診断を支援したい。",
    ],
    solutions: [
      "5G通信を活用した高精細映像伝送システムを構築。",
      "医師同士がリアルタイムでコミュニケーションを取れるWeb会議機能を統合。",
    ],
    results: [
      "遠隔地でも質の高い医療サービスを提供可能になった。",
      "診断までの時間を短縮し、患者の負担を軽減。",
    ],
    notes: {
      language: "Swift, Kotlin, Python",
      environment: "AWS (AppSync, MediaLive), WebRTC",
      duration: "14ヶ月",
    },
  },
  {
    id: "06",
    title: "人材開発パッケージ構築",
    alt: "人事評価・タレントマネジメントのイメージ",
    challenges: [
      "従業員のスキルや評価が属人化しており、適材適所の配置が困難。",
      "評価プロセスの透明性を高め、従業員のモチベーションを向上させたい。",
    ],
    solutions: [
      "スキルマップの可視化と、360度評価機能を備えたシステムを開発。",
      "AIによるキャリアパス提案機能を搭載。",
    ],
    results: [
      "人材配置の最適化が進み、組織全体の生産性が向上。",
      "評価に対する納得感が高まり、離職率の低下に貢献。",
    ],
    notes: {
      language: "Ruby, TypeScript",
      environment: "Heroku, PostgreSQL, React",
      duration: "9ヶ月",
    },
  },
  {
    id: "07",
    title: "求人サイト マイページシステム構築",
    alt: "ECサイト・マイページのイメージ",
    challenges: [
      "既存のマイページが使いにくく、ユーザーの離脱率が高い。",
      "パーソナライズされた情報の提供により、リピート率を向上させたい。",
    ],
    solutions: [
      "UI/UXを全面的に見直し、直感的で使いやすいインターフェースを設計。",
      "ユーザーの購買履歴に基づいたレコメンドエンジンを導入。",
    ],
    results: [
      "マイページの利用率が向上し、リピート購入率が25%増加。",
      "顧客満足度調査で高い評価を獲得。",
    ],
    notes: {
      language: "PHP, JavaScript",
      environment: "AWS (CloudFront, S3), Laravel, Vue.js",
      duration: "6ヶ月",
    },
  },
  {
    id: "08",
    title: "公会計システム構築",
    alt: "在庫管理システムのイメージ",
    challenges: [
      "紙やExcelでの管理により、在庫のズレや入力ミスが多発。",
      "リアルタイムでの在庫確認ができず、過剰発注が発生していた。",
    ],
    solutions: [
      "バーコードスキャンによる入出庫管理システムを導入。",
      "クラウド上で一元管理し、複数拠点からの同時アクセスを可能にした。",
    ],
    results: [
      "在庫の精度が大幅に向上し、棚卸し作業の時間を50%短縮。",
      "適正な在庫管理により、キャッシュフローが改善。",
    ],
    notes: {
      language: "C#, SQL",
      environment: "Azure (SQL Database, App Service), .NET",
      duration: "7ヶ月",
    },
  },
];

function DevelopmentCaseTitle({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {index > 0 ? <br /> : null}
          {line}
        </React.Fragment>
      ))}
    </>
  );
}

function DevelopmentCaseCard({ item }: { item: DevelopmentCaseDetail }) {
  const [open, setOpen] = useState(false);
  const panelId = `development-case-panel-${item.id}`;

  return (
    <article
      className="development-case-card"
      id={`development-case-${item.id}`}
    >
      <h3 className="development-case-card__title">
        <span className="development-case-card__title-bar" aria-hidden />
        <span className="development-case-card__title-text">
          <DevelopmentCaseTitle text={item.title} />
        </span>
      </h3>
      <div className="development-case-card__media">
        <img
          src={getImageUrl(`/image/img_development${item.id}.png`)}
          alt={item.alt}
        />
      </div>
      <button
        type="button"
        className={`development-case-card__footer${open ? " development-case-card__footer--open" : ""}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="development-case-card__footer-label">詳細を見る</span>
        <span className="development-case-card__chevron" aria-hidden />
      </button>
      {open ? (
        <div
          id={panelId}
          className="development-case-card__panel"
          role="region"
          aria-label={`${item.title.replace(/\n/g, "")}の詳細`}
        >
          <section className="development-case-card__block development-case-card__block--challenge">
            <h4 className="development-case-card__block-heading">課題</h4>
            <ul className="development-case-card__list">
              {item.challenges.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          <section className="development-case-card__block development-case-card__block--solution">
            <h4 className="development-case-card__block-heading">対策</h4>
            <ul className="development-case-card__list">
              {item.solutions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          <section className="development-case-card__block development-case-card__block--result">
            <h4 className="development-case-card__block-heading">成果</h4>
            <ul className="development-case-card__list">
              {item.results.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          <section className="development-case-card__block development-case-card__block--notes">
            <h4 className="development-case-card__block-heading">備考</h4>
            <table className="development-case-card__notes">
              <tbody>
                <tr>
                  <th scope="row">言語</th>
                  <td>{item.notes.language}</td>
                </tr>
                <tr>
                  <th scope="row">環境</th>
                  <td>{item.notes.environment}</td>
                </tr>
                <tr>
                  <th scope="row">期間</th>
                  <td>{item.notes.duration}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      ) : null}
    </article>
  );
}

const Development: React.FC = () => {
  return (
    <div className="subpage subpage--development">
      <PageMeta {...PAGE_META["/development"]} />
      <SubpageTitle titleJa="開発事例" titleEn="development" as="h1" />
      <FaqStickyLink />
      <section
        className="subpage-section development-cases"
        aria-label="開発事例一覧"
      >
        <div className="development-cases__grid">
          {DEVELOPMENT_CASES.map((item) => (
            <DevelopmentCaseCard key={item.id} item={item} />
          ))}
        </div>
      </section>


    </div>
  );
};

export default Development;
