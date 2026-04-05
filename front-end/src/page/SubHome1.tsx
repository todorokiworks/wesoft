import React from "react";
import "../css/home.less";
import { getDataBaseUrl } from "../config";
import TweenOne from "rc-tween-one";
import QueueAnim from "rc-queue-anim";
import RcScrollOverPack from "rc-scroll-anim/lib/ScrollOverPack";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
const SubHome1: React.FC = () => {
  const navigate = useNavigate();

  const handleLinkTo = () => {
    navigate("/news");
    window.scrollTo(0, 0);
  };

  return (
    <RcScrollOverPack id="top-strength" className="homepage">
      <QueueAnim
        duration={450}
        type="left"
        className="home-title"
        key="title"
        leaveReverse
      >
        <h2 key="h2" className="home-title-ja-lg">ウィソフトの強み</h2>
        <p className="home-title-en-lg" key="home-title-en-lg">Strength</p>

        <p className="strength-content__description">ウィソフトの開発スタイル 個の力を、チームの技術へ
        </p>
      </QueueAnim>
      <TweenOne
        key="content"
        className="strength-content"
        animation={{ x: 0, opacity: 1, ease: "easeOutQuad" }}
        style={{
          transform: "translateX(100px)",
          opacity: 0,

        }}
      >
        <div className="strength-content__wrapper">
          <div className="strength-content__main">
            <div className="home-content-item-image">
              <img src={`${getDataBaseUrl()}/image/top-strength01.png`} alt="strength_1" />
            </div>
            <div className="strength-content__list">
              <div className="strength-content__list__item">
                <div className="strength-content__list__item__num"><img src={`${getDataBaseUrl()}/image/top-strength-num01.png`} alt="strength_1" /></div>
                <div className="strength-content__list__item__title">
                  要件定義から運用まで<br />
                  一貫対応する受託・請負開発
                </div>
                <div className="strength-content__list__item__img">
                  <img src={`${getDataBaseUrl()}/image/top-strength-img01.png`} alt="arrow_1" />
                </div>
              </div>

              <div className="strength-content__list__item">
                <div className="strength-content__list__item__num"><img src={`${getDataBaseUrl()}/image/top-strength-num02.png`} alt="strength_1" /></div>
                <div className="strength-content__list__item__title">
                  多様な開発手法を用いた<br />
                  中小〜大規模システム開発
                </div>
                <div className="strength-content__list__item__img">
                  <img src={`${getDataBaseUrl()}/image/top-strength-img02.png`} alt="arrow_1" />
                </div>
              </div>

              <div className="strength-content__list__item">
                <div className="strength-content__list__item__num"><img src={`${getDataBaseUrl()}/image/top-strength-num03.png`} alt="strength_1" /></div>
                <div className="strength-content__list__item__title">
                  SIer・パートナー案件で培った<br />
                  開発品質
                </div>
                <div className="strength-content__list__item__img">
                  <img src={`${getDataBaseUrl()}/image/top-strength-img03.png`} alt="arrow_1" />
                </div>
              </div>
            </div>
          </div>


          <p className="strength-content__bottom-description">得意分野に依存せず、要件検討から運用までをチームで支える開発体制</p>

          <Button
            type="primary"
            style={{ backgroundColor: "#a51f27", borderColor: "#a51f27", borderRadius: "0", width: "350px", fontSize: "20px", fontWeight: "bold", padding: "30px 0px" }}
            size="large"
            onClick={handleLinkTo}
          >
            詳細はこちら
          </Button>
        </div>
      </TweenOne>
    </RcScrollOverPack >
  );
};

export default SubHome1;
