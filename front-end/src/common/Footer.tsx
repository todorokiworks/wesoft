import React, { useState } from "react";
import "../css/footer.less";
import { getDataBaseUrl } from "../config";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import PrivacyNotice from "../page/PrivacyNotice";

const AppFooter: React.FC = () => {
  let currentYear = new Date().getFullYear();
  let mailto = "ws.jj@wesoft.co.jp";
  let telephone = "044-280-6828";

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const showPrivacyNotice = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="footer">
      <div className="top">
        <div className="company">
          <div className="company-icon">
            <img
              src={`${getDataBaseUrl()}/image/cropped-wesoft_270x270.png`}
              style={{ width: "50px", height: "50px" }}
              alt="ウィソフト株式会社"
            />
          </div>
          <div className="company-text">
            <span style={{ fontSize: "16px" }}>ウィソフト株式会社</span>
            <span>WeSoft Co.,Ltd. </span>
          </div>
        </div>
        <div className="menu">
          <div className="items">
            <Link to="/">
              <div className="item">ホームページ</div>
            </Link>
            <Link to="/company#t1">
              <div className="item">企業情報</div>
            </Link>
            <Link to="/business">
              <div className="item">事業内容</div>
            </Link>
            <Link to="/development">
              <div className="item">開発実績</div>
            </Link>
            <Link to="/scientific_career">
              <div className="item">研究事業</div>
            </Link>
            <Link to="/recruit">
              <div className="item">採用情報</div>
            </Link>
            <Link to="/news">
              <div className="item">ニュース</div>
            </Link>
            <Link to="/inquiry">
              <div className="item">問い合わせ</div>
            </Link>
          </div>
        </div>
        <div className="contact">
          <span>受付時間: 平日 AM 10:00 〜 PM 7:00</span>
          <span>※緊急時：いつでもご遠慮なく連絡可能</span>
          <span>{telephone}</span>
          <span>
            <a href={"mailto://" + mailto}>Email: {mailto}</a>
          </span>
        </div>
      </div>

      <div className="bottom">
        <span onClick={showPrivacyNotice} className="privacy-notice">
          プライバシーポリシー&nbsp;&nbsp;
        </span>

        <span style={{ color: "#eee" }}>
          © {currentYear}年 ウィソフト株式会社 Co.,Ltd. All Rights Reserved.
        </span>
      </div>

      <Modal
        title="個人情報保護方針"
        open={isModalVisible}
        onOk={handleOk}
        onClose={handleClose}
        onCancel={handleClose}
        className="model-main"
        footer={
          <>
            <div
              style={{
                display: "flex",
                marginBottom: "20px",
                justifyContent: "center",
                width: "100%",
              }}
            ></div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
                key="ok"
                type="primary"
                style={{ marginRight: "10px" }}
                onClick={handleOk}
              >
                OK
              </Button>
            </div>
          </>
        }
      >
        <div style={{ height: "400px", overflowY: "auto" }}>
          <PrivacyNotice />
        </div>
      </Modal>
    </div>
  );
};

export default AppFooter;
