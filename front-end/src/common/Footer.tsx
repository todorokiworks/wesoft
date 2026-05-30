import React, { useState } from "react";
import "../css/footer.less";
import { getAssetUrl } from "../config";
import { Button, Modal } from "antd";
import { Link } from "react-router-dom";
import PrivacyNotice from "../page/PrivacyNotice";

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
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
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__row">
          <div className="footer__logo">
            <img
              src={getAssetUrl("/image/icon_logo-white.png")}
              alt="ウィソフト株式会社"
            />
          </div>

          <div className="footer__contact">
            <p className="footer__postal">〒210-0022</p>
            <p className="footer__address">
              神奈川県川崎市川崎区池田2丁目6番7号
            </p>
            <p className="footer__tel">TEL.044-280-6828</p>
          </div>

          <Link to="/inquiry" className="footer__inquiry">
            お問い合わせ
          </Link>

          <a
            href={getAssetUrl("/pdf/wesoft_document.pdf")}
            className="footer__inquiry footer__sales-dl"
            download="wesoft_document.pdf"
          >
            資料DL
          </a>
        </div>

        <div className="footer__bottom">
          <button
            type="button"
            className="footer__privacy"
            onClick={showPrivacyNotice}
          >
            プライバシーポリシー
          </button>
          <p className="footer__copyright">
            © {currentYear} ウィソフト株式会社 Co.,Ltd.無断転載を禁じます。
          </p>
          <span className="footer__bottom-spacer" aria-hidden />
        </div>
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
    </footer>
  );
};

export default AppFooter;
