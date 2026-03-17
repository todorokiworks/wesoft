import React from "react";
import QueueAnim from "rc-queue-anim";
import { Link } from "react-router-dom";
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
          個人個人の特徴
          <br />
          チーム的に存在
          <br />
          社会的な貢献へ
        </div>
      </QueueAnim>
      <QueueAnim
        className="banner-text-wrapper-2"
        type="right"
        duration={1000}
        delay={800}
        ease="easeInOutQuart"
      >
        <div key="content-down" className="banner-wrapper-content">
          Individual characteristics
          <br />
          exist as a team
          <br />
          Towards social contribution
        </div>
      </QueueAnim>
      <QueueAnim
        className="banner-text-wrapper-3"
        type="bottom"
        duration={1000}
        delay={1200}
        ease="easeInOutQuart"
      >
        <div key="button1" className="start-button clearfix">
          <Link to="/company#t1">view more →</Link>
        </div>
      </QueueAnim>
    </div>
  );
};

export default Banner;
