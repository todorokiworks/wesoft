import React from "react";
import { Link } from "react-router-dom";
import { getDataBaseUrl } from "../config";

export type FaqStickyLinkProps = {
  className?: string;
};

/** 右固定 FAQ 導線（`.faq-wrapper` は subpage.less / banner.less） */
const FaqStickyLink: React.FC<FaqStickyLinkProps> = ({ className }) => {
  const rootClass = ["faq-wrapper", className].filter(Boolean).join(" ");

  return (
    <div className={rootClass}>
      <Link
        to="/faq"
        className="faq-wrapper-content-link"
        aria-label="FAQページへ"
      >
        <span className="faq-wrapper-content-title">FAQ</span>
        <span className="faq-wrapper-content-description">詳しくはこちら</span>
        <div>
          <img
            src={`${getDataBaseUrl()}/image/icon_arrow_white.png`}
            alt=""
          />
        </div>
      </Link>
    </div>
  );
};

export default FaqStickyLink;
