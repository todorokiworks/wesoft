/**
 * クラプロ用 KW シート（title / description）に基づくメタ情報
 */

export type PageMeta = {
  title: string;
  description: string;
};

/** シート「コラム」行（/column 一覧・カテゴリ一覧などで共用） */
export const COLUMN_INDEX_META: PageMeta = {
  title: "ソフトウェア開発・技術情報コラム｜受託開発のウィソフト",
  description:
    "ウィソフトのコラムでは、ソフトウェア開発やシステム開発、AI技術などに関する情報を発信しています。受託開発で培った知見をもとに、技術動向や開発ノウハウを分かりやすく解説します。開発現場で役立つ実践的な情報をお届けします。",
};

export const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "ソフトウェア受託開発・業務システム開発｜ウィソフト株式会社",
    description:
      "ソフトウェア受託・請負開発ならウィソフト。業務システムやWebシステムなど企業の課題に合わせたソフトウェア開発を提供します。企画・設計から開発・運用までワンストップで対応し、DX推進と業務効率化を支援します。",
  },
  "/service": {
    title: "ソフトウェア受託開発サービス｜ウィソフト株式会社",
    description:
      "ウィソフトのソフトウェア受託・請負開発サービス。業務システム、Webシステム、各種アプリケーションの設計・開発・運用まで対応。企業の業務課題に合わせた最適なシステム開発を提供します。",
  },
  "/company": {
    title: "会社情報｜ソフトウェア受託開発のウィソフト",
    description:
      "ウィソフトの会社情報ページです。会社概要、企業理念、事業内容などをご紹介。ソフトウェア受託・請負開発を中心に、企業の業務課題を解決するシステム開発サービスを提供しています。",
  },
  "/development": {
    title: "ソフトウェア開発実績｜受託開発のウィソフト",
    description:
      "ウィソフトが手がけたソフトウェア受託・請負開発の実績をご紹介。業務システムやWebシステムなど、さまざまな業界の開発事例を掲載しています。豊富な経験と技術力で最適なシステム開発を実現します。",
  },
  "/scientific_career": {
    title: "研究事業（AI開発）｜ソフトウェア受託開発のウィソフト",
    description:
      "ウィソフトの研究事業では、AI（人工知能）や最適化技術などの先端技術の研究開発に取り組んでいます。受託開発で培った技術力を基盤に、論文発表や共同研究を通じて、実用化を見据えたソフトウェア開発を推進しています。",
  },
  "/recruit": {
    title: "PM・エンジニア募集｜ソフトウェア受託開発のウィソフト",
    description:
      "ウィソフトの採用情報。ソフトウェア受託・請負開発を行うエンジニアをはじめ、PMや営業職を募集しています。業務システムやWebシステム開発を通じて企業のDXを支える仕事に挑戦できる環境です。",
  },
  "/inquiry": {
    title: "開発のご相談・お問い合わせ｜ソフトウェア受託開発のウィソフト",
    description:
      "ウィソフトへのお問い合わせはこちら。ソフトウェア開発のご相談、受託開発のご依頼、技術に関するご質問などお気軽にお問い合わせください。",
  },
  "/faq": {
    title: "よくある質問｜ソフトウェア受託開発のウィソフト",
    description:
      "ウィソフトのよくある質問ページです。ソフトウェア受託・請負開発に関するご相談内容や開発の流れ、費用、対応範囲など、お客様から多く寄せられる質問と回答をまとめています。",
  },
};

/** シート未掲載のため、サイトトップの description 方針に合わせた補完 */
export const NEWS_PAGE_META: PageMeta = {
  title: "新着情報｜ソフトウェア受託開発のウィソフト",
  description: PAGE_META["/"].description,
};

/** 事業内容ページ（シート未掲載・サービスページの説明を流用） */
export const BUSINESS_PAGE_META: PageMeta = {
  title: "事業内容｜ソフトウェア受託開発のウィソフト",
  description: PAGE_META["/service"].description,
};

export const COLUMN_CATEGORIES_META: PageMeta = {
  title: `カテゴリ一覧｜${COLUMN_INDEX_META.title}`,
  description: COLUMN_INDEX_META.description,
};

export function articlePageMeta(
  articleTitle: string,
  body: string,
  metaDescription?: string
): PageMeta {
  // microCMS の metaDiscription があれば優先、なければ本文から生成
  const explicit = metaDescription?.replace(/\s+/g, " ").trim();
  if (explicit) {
    return {
      title: `${articleTitle}｜${COLUMN_INDEX_META.title}`,
      description: explicit,
    };
  }

  const flat = body.replace(/\s+/g, " ").trim();
  const max = 120;
  const description =
    flat.length === 0
      ? COLUMN_INDEX_META.description
      : flat.length > max
        ? `${flat.slice(0, max)}…`
        : flat;
  return {
    title: `${articleTitle}｜${COLUMN_INDEX_META.title}`,
    description,
  };
}
