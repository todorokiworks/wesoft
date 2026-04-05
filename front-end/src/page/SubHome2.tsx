import React from "react";
import "../css/home.less";
import { getImageUrl } from "../config";
import QueueAnim from "rc-queue-anim";
import { Button } from "antd";
import RcScrollOverPack from "rc-scroll-anim/lib/ScrollOverPack";
import { Link } from "react-router-dom";

const CASE_ITEMS = [
    {
        key: "1",
        image: "/image/top-case01.png",
        title: "クラウド経費精算システム",
    },
    {
        key: "2",
        image: "/image/top-case02.png",
        title: "大手専門技術商社の各システムデータの集約・統合・連携",
    },
    {
        key: "3",
        image: "/image/top-case03.png",
        title: "洋上風力発電レイアウト最適化プラットフォーム",
    },
    {
        key: "4",
        image: "/image/top-case04.png",
        title: "給与計算パッケージ構築",
    },
] as const;

const SubHome2: React.FC = () => {
    return (
        <RcScrollOverPack id="top-case-studies" className="homepage case-studies">
            <QueueAnim
                duration={450}
                type="bottom"
                className="case-studies__anim"
                key="case-studies-header"
                leaveReverse
            >
                <h2 key="h2" className="home-title-ja case-studies__title-ja">
                    ウィソフトの事例
                </h2>
                <p key="en" className="home-title-en case-studies__title-en">
                    Case studies
                </p>
            </QueueAnim>
            <QueueAnim
                duration={450}
                type="bottom"
                className="case-studies__grid-anim"
                key="case-studies-grid"
                leaveReverse
            >
                <div key="grid" className="case-studies__grid">
                    {CASE_ITEMS.map((item) => (
                        <div key={item.key} className="case-studies__card">
                            <div className="case-studies__card-image-wrap">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.title}
                                    className="case-studies__card-image"
                                />
                            </div>
                            <p className="case-studies__card-title">{item.title}</p>
                            <Link to="/development" className="case-studies__card-link">
                                <Button size="large" className="case-studies__card-button">
                                    詳しくはこちら
                                </Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </QueueAnim>
            <QueueAnim
                duration={450}
                type="bottom"
                className="case-studies__cta-anim"
                key="case-studies-cta"
                leaveReverse
            >
                <div key="cta" className="case-studies__cta-row">
                    <Link to="/development">
                        <Button
                            type="primary"
                            size="large"
                            className="case-studies__cta-main"
                            style={{ backgroundColor: "#a51f27", borderColor: "#a51f27", borderRadius: "0", width: "350px", fontSize: "20px", fontWeight: "bold", padding: "30px 0px" }}

                        >
                            開発事例はこちら
                        </Button>
                    </Link>
                    <Link to="/scientific_career">
                        <Button
                            type="primary"
                            size="large"
                            className="case-studies__cta-main"
                            style={{ backgroundColor: "#a51f27", borderColor: "#a51f27", borderRadius: "0", width: "350px", fontSize: "20px", fontWeight: "bold", padding: "30px 0px" }}

                        >
                            研究事例はこちら
                        </Button>
                    </Link>
                </div>
            </QueueAnim>
        </RcScrollOverPack>
    );
};

export default SubHome2;
