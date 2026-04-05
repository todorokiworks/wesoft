import React from "react";
import QueueAnim from "rc-queue-anim";
import { Link } from "react-router-dom";
import { getDataBaseUrl } from "../config";
import "../css/banner.less";

const Banner: React.FC = () => {
  return (
    <div className="banner-wrapper">
      <QueueAnim
        className="banner-text-wrapper-1"
        type="left"
        duration={1000}
        delay={400}
        ease="easeInOutQuart"
      >
        <div key="content" className="banner-wrapper-content">
          業務システムからWebアプリまで対応<br />
          ソフトウェア開発会社 ウィソフト
        </div>
      </QueueAnim>

      <QueueAnim
        className="faq-wrapper"
        type="bottom"
        duration={1000}
        delay={400}
        ease="easeInOutQuart"
      >
        <a href="/faq" className="faq-wrapper-content-link">
          <span className="faq-wrapper-content-title">FAQ</span>
          <span className="faq-wrapper-content-description">詳しくはこちら</span>
          <div>
            <img src={`${getDataBaseUrl()}/image/icon_arrow_white.png`} alt="arrow" />
          </div>
        </a>
      </QueueAnim>
    </div>
  );
};

export default Banner;
