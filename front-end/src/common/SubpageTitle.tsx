import React from "react";

export type SubpageTitleProps = {
  titleJa: string;
  titleEn: string;
  /** 見出しに付与する id（任意・アンカー用） */
  id?: string;
  /** ページ主見出し。デフォルトは h2 */
  as?: "h1" | "h2";
};

const SubpageTitle: React.FC<SubpageTitleProps> = ({
  titleJa,
  titleEn,
  id,
  as: HeadingTag = "h2",
}) => {
  return (
    <header className="subpage-title">
      <HeadingTag id={id} className="subpage-title-ja">
        {titleJa}
      </HeadingTag>
      <p className="subpage-title-en">{titleEn}</p>
    </header>
  );
};

export default SubpageTitle;
