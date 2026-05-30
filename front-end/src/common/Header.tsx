import React, { useCallback, useEffect, useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import "../css/header.less";
import { getImageUrl } from "../config";

const HEADER_NAV = [
  { key: "/", to: "/", label: "TOP" },
  { key: "/company", to: "/company", label: "会社情報", title: "企業情報" },
  { key: "/service", to: "/service", label: "サービス" },
  { key: "/development", to: "/development", label: "開発事例" },
  { key: "/scientific_career", to: "/scientific_career", label: "研究事業" },
  { key: "/faq", to: "/faq", label: "FAQ" },
  { key: "/recruit", to: "/recruit", label: "採用情報" },
  { key: "/news", to: "/news", label: "NEWS" },
  { key: "/column", to: "/column", label: "コラム" },
] as const;

const HEADER_TEL_HREF = "tel:0442806828";
const HEADER_TEL_TEXT = "044-280-6828";

const AppHeader: React.FC = () => {
  const location = useLocation();
  const selectedKey = location.pathname;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerTitleId = useId();

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);

  useEffect(() => {
    closeDrawer();
  }, [location.pathname, closeDrawer]);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  return (
    <>
      <div className="header">
        <Link to="/" className="header__brand" onClick={closeDrawer}>
          <img
            className="logo"
            src={getImageUrl("/image/wesoft-home.png")}
            alt="ウィソフト株式会社"
            width={250}
            height={78}
            decoding="async"
          />
        </Link>

        <nav className="header__nav-desktop" aria-label="メインメニュー">
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
            selectedKeys={[selectedKey]}
          >
            {HEADER_NAV.map((item) => (
              <Menu.Item
                key={item.key}
                {...("title" in item && item.title ? { title: item.title } : {})}
              >
                <Link to={item.to}>{item.label}</Link>
              </Menu.Item>
            ))}
            <Menu.Item key="/inquiry">
              <Link to="/inquiry">問い合わせ</Link>
            </Menu.Item>
          </Menu>
        </nav>

        <div className="header__mobile-bar">

          <button
            type="button"
            className="header__menu-trigger"
            aria-expanded={drawerOpen}
            aria-controls="header-drawer"
            onClick={openDrawer}
          >
            <span className="header__menu-trigger-bar" aria-hidden />
            <span className="header__menu-trigger-bar" aria-hidden />
            <span className="header__menu-trigger-bar" aria-hidden />
            <span className="visually-hidden">メニューを開く</span>
          </button>
        </div>
      </div>

      <div
        id="header-drawer"
        className={
          drawerOpen ? "header-drawer header-drawer--open" : "header-drawer"
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby={drawerTitleId}
        aria-hidden={!drawerOpen}
      >
        <div className="header-drawer__inner">
          <h2 id={drawerTitleId} className="visually-hidden">
            メインメニュー
          </h2>
          <div className="header-drawer__top">
            <Link
              to="/"
              className="header-drawer__brand"
              onClick={closeDrawer}
            >
              <span className="visually-hidden">トップページへ</span>
              <img
                src={getImageUrl("/image/wesoft-home.png")}
                alt=""
                className="header-drawer__logo"
                width={220}
                height={48}
                decoding="async"
              />
            </Link>
            <button
              type="button"
              className="header-drawer__close"
              onClick={closeDrawer}
              aria-label="メニューを閉じる"
            >
              ×
            </button>
          </div>

          <ul className="header-drawer__links">
            {HEADER_NAV.map((item) => (
              <li key={item.key} className="header-drawer__links-item">
                <Link
                  to={item.to}
                  className={
                    selectedKey === item.key
                      ? "header-drawer__link header-drawer__link--current"
                      : "header-drawer__link"
                  }
                  onClick={closeDrawer}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="header-drawer__footer">
            <p className="header-drawer__tel">
              <a href={HEADER_TEL_HREF} className="header-drawer__tel-link">
                TEL.{HEADER_TEL_TEXT}
              </a>
            </p>
            <Link
              to="/inquiry"
              className="header-drawer__cta"
              onClick={closeDrawer}
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppHeader;
