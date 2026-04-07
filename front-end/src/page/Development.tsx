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
    tools?: string;
    language?: string;
    environment?: string;
    duration?: string;
  };
};

const DEVELOPMENT_CASES: DevelopmentCaseDetail[] = [
  {
    id: "01",
    title: "クラウド経費精算システム",
    alt: "インフラ管理用EDIシステムのイメージ",
    challenges: [
      "経費精算は手入力や紙の領収書管理が多く、業務負担が大きい",
      "経費データ入力や領収書確認など、申請者・経理双方に手間がかかる",
      "手入力による金額・日付などの入力ミスが発生しやすい",
      "キャッシュレス決済の増加により、取引データ管理が複雑化している "
    ],
    solutions: [
      "クラウド型経費精算システム、スマホアプリ(iOS&Android)により申請～承認～精算を一元管理",
      "銀行口座・クレジットカード・電子マネーの取引明細を自動取得",
      "領収書をスマホ撮影し、AI-OCRで日付・金額・支払先を自動読取",
      "Cカードや駅入力から交通費を自動計算",
      "会計システム連携や電子帳簿保存法対応によるペーパーレス化 "
    ],
    results: [
      "経費データ入力の手間を削減し、業務効率を向上",
      "手入力ミスや申請漏れなどヒューマンエラーを低減",
      "経費申請から承認までをスマートフォンで完結可能",
      "ペーパーレス経理とバックオフィス業務のDXを実現 "
    ],
    notes: {
      language: "Springboot、Oracle Cloud、React、Flatter、PostgreSQL",
      environment: "",
      duration: "30人月",
    },
  },
  {
    id: "02",
    title: "大手専門技術商社の\n各システムデータの集約・統合・連携",
    alt: "需要予測・在庫最適化のイメージ",
    challenges: [
      "人手による各システムからのデータ収集・加工の作業には多大な工数がかかる",
      "基幹業務のリアルタイム処理をデータ連携で実現し、業務推進をスピードアップしたい",
    ],
    solutions: [
      "関連システム間のデータの集約・統合・連携プロジェクトへ参画",
      "データ連携基盤を一本化し、150を超えるデータ連携処理方式を刷新",
      "保守運用を前提とした安定的な開発体制を構築"
    ],
    results: [
      "対象業務の一連の業務プロセスを自動化し、RPAツール以上の業務効率化を実現",
      "大幅な工数削減を実現し、より新鮮なデータ活用が可能に",
      "データ連携の共通基盤を構築し、個別開発を回避して最短・低コストで移行"
    ],
    notes: {
      tools: "DataSpider Servista",
      language: "AWS、Azrue、Salesforce、Kintone、各種Database",
      duration: "４人チーム（運用保守２人、開発２人）",
    },
  },
  {
    id: "03",
    title: "洋上風力発電レイアウト最適化プラットフォーム",
    alt: "洋上風力発電レイアウト最適化のイメージ",
    challenges: [
      "洋上風力発電では、風車間の Wake（尾流）効果により最大約30%の発電量損失が発生する可能性がある。",
      "不適切な風車配置は発電効率や事業収益性を低下させる。",
      "風車配置の最適化は計算量が多く、従来手法では効率的な探索が難しい。",
    ],
    solutions: [
      "AI最適化アルゴリズム（iSE）を用いた風車配置最適化システムを開発（マイクロサービス構成による独立スケーリング）。",
      "Webベースのシミュレーションプラットフォームを構築。",
      "風況データ・設置条件をもとに風車配置を自動最適化。",
      "最適化過程や結果をリアルタイム可視化。",
    ],
    results: [
      "風車配置の自動最適化により発電効率向上を支援。",
      "Wake影響分析や発電量予測により設計検討を高度化。",
      "洋上風力発電プロジェクトの計画・評価を効率化。",
    ],
    notes: {
      language:
        "Frontend / Backend / Python Engine、Spring Boot、Python、PostgreSQL / Redis、WebSocket",
      environment: "",
      duration: "40人月",
    },
  },
  {
    id: "04",
    title: "給与計算パッケージ構築",
    alt: "給与計算システムのイメージ",
    challenges: [
      "給与計算は税金・社会保険などの計算が複雑で、担当者の負担が大きい。",
      "手作業や複数システム管理により、ミスや二重入力が発生しやすい。",
      "給与明細の印刷・配布などアナログ業務が多く、効率が低い。",
      "年末調整や法改正対応など専門知識が必要で、運用負担が大きい。",
    ],
    solutions: [
      "クラウド型給与計算システムを構築し、業務を一元管理。",
      "税金・社会保険料などの給与計算を自動化。",
      "給与明細の電子化によるペーパーレス化。",
      "勤怠・会計、税務・労務申請システムとのデータ連携機能を提供。",
      "年末調整や帳票作成など、給与関連業務をシステム化。",
    ],
    results: [
      "給与計算業務の効率化と作業時間の削減。",
      "計算ミスや入力ミスのリスクを低減。",
      "ペーパーレス化による業務コスト削減。",
      "給与・経理データの連携により管理精度が向上。",
    ],
    notes: {
      language: "SpringBoot、AWS、JasperReport",
      environment: "",
      duration: "100人月",
    },
  },
  {
    id: "05",
    title: "適格請求書発行パッケージ開発",
    alt: "適格請求書・インボイス対応システムのイメージ",
    challenges: [
      "消費税の仕入税額控除を受けるための新たな改正として、インボイス制度（適格請求書等保存方式）が2023年10月に開始。",
      "消費税課税事業者が対象で、取引内容や消費税率、消費税額などの記載要件を満たした請求書などの発行・保存が求められる。",
    ],
    solutions: [
      "インボイス制度に完全対応したクラウドサービスを開発し、見積〜領収まで一貫した業務対応を実現。",
      "API Gateway経由で完全な会計連携（自動仕訳、入金消し込）およびPeppolへのデータ送信（デジタルインボイス対応）。",
      "マスタにて税率などの各種情報を動的に管理し、税制変更に柔軟に対応。",
      "10数個の書類テンプレート指定、デザインのカスタマイズ、自動発行、メール配信、各種帳票出力など豊富な機能を提供。",
    ],
    results: [
      "インボイス制度要件100％準拠を実現し、現行ユーザーを維持。新規のクラウド移行や他社からの乗り換えユーザーも多く獲得。",
      "柔軟な設定機能とシステム連携対応でユーザーから好評。",
      "柔軟なシステム内部設計により、税制変更や新要望の追加を小工数で対応可能に。",
    ],
    notes: {
      language: "SpringBoot、Oracle Cloud、PDFBox、Bootstrap、jQuery",
      environment: "",
      duration: "30人月",
    },
  },
  {
    id: "06",
    title: "人材開発パッケージ構築",
    alt: "人事評価・タレントマネジメントのイメージ",
    challenges: [
      "経営資源のうち、人材が最も重要であり、企業経営を左右するが、多くの企業で人材管理（タレントマネジメント）が十分にできていない。",
      "7割以上の企業が人手不足を感じており、適切な人材配置や育成が機能していないケースが多い。",
      "具体的な手法が分からない、あるいは何から手をつければいいか不明確である。",
    ],
    solutions: [
      "数百社の人事コンサルティング実績をもとに、人材管理をクラウド化したパッケージを構築。",
      "経験・貢献・処遇・適性などの把握、能力に適した研修、満足度・ストレス調査、組織全般の分析・提案機能を実装。",
      "柔軟なマスタ設定機能・権限制御、各企業に特化した自由カスタマイズ可能な属性・機能。",
      "社会職業能力評価シートを網羅（厚生労働省仕様準拠）。",
    ],
    results: [
      "多くの情報把握と多角的な分析・可視化を可能にし、会社の競争力強化と社員の能力・モチベーション向上の相乗効果を実現。",
      "人事面や部門別の課題を抽出し、人事戦略の立案や組織改善対策に重要な情報提供ができた。",
      "十分な拡張性を備えたシステム内部設計により、要望対応や各種マスタ更新を無修正／小工数で対応可能に。",
    ],
    notes: {
      language: "SpringBoot、AWS、HighCharts、Bootstrap",
      environment: "",
      duration: "60人月",
    },
  },
  {
    id: "07",
    title: "求人サイト マイページシステム構築",
    alt: "求人・求職者向けマイページのイメージ",
    challenges: [
      "求人応募や登録手続きが電話・メール中心で管理が煩雑。",
      "本人確認書類や口座情報などの提出・管理に手間がかかる。",
      "応募状況や就業手続きの進捗が分かりにくい。",
      "給与明細などの情報確認が紙や個別対応となり、業務負担が大きい。",
    ],
    solutions: [
      "求職者専用のマイページを構築し、登録から就業までの情報を一元管理。",
      "ヒアリングシート、本人確認書類、顔写真などのオンライン登録機能を実装。",
      "求人検索や応募・就業準備手続きをマイページ上で管理可能にし、給与振込口座登録や給与明細確認などの給与関連機能をシステム化。",
      "通知・問い合わせ・FAQなどのサポート機能を提供。",
    ],
    results: [
      "求人応募から就業手続きまでオンラインで完結。",
      "書類提出や情報管理の効率化により業務負担を軽減。",
      "求職者の利便性向上とスムーズな就業手続きが可能に。",
      "求人紹介・就業管理の業務効率化を実現。",
    ],
    notes: {
      language: "SpringBoot、Bootstrap",
      environment: "",
      duration: "20人月",
    },
  },
  {
    id: "08",
    title: "公会計システム構築",
    alt: "地方自治体向け公会計システムのイメージ",
    challenges: [
      "地方自治体の財務データ（歳入歳出データ・固定資産など）の管理が複雑。",
      "単式会計データから複式仕訳への変換や財務書類作成に多くの手作業が発生。",
      "固定資産管理や減価償却計算、連結会計処理などの業務負担が大きい。",
      "財務データの分析や行政経営への活用が十分に行われていない。",
    ],
    solutions: [
      "公会計業務を一元管理する公会計システムを構築。",
      "歳入歳出データの複式仕訳変換機能を実装。",
      "固定資産管理・減価償却処理機能を提供。",
      "財務帳票作成および連結精算機能を実装。",
      "財務データの分析機能を提供し、AIによる評価提案の自動作成に対応。",
    ],
    results: [
      "単式会計データから複式仕訳への変換を自動化。",
      "財務書類作成業務の効率化を実現。",
      "固定資産管理や減価償却計算の一元管理を実現。",
      "財務データの可視化・分析により行政経営を支援。",
    ],
    notes: {
      language: "SpringBoot、Bootstrap、jQuery、生成AI",
      environment: "",
      duration: "40人月",
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
            <h4 className="development-case-card__block-heading">対応</h4>
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
                {item.notes.tools && (
                  <tr>
                    <th scope="row">ツール</th>
                    <td>{item.notes.tools}</td>
                  </tr>
                )}
                <tr>
                  <th scope="row">技術</th>
                  <td>{item.notes.language}</td>
                </tr>

                <tr>
                  <th scope="row">規模</th>
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
