import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import "../css/header.less";

const AppHeader: React.FC = () => {
  const location = useLocation();
  const selectedKey = location.pathname;

  return (
    <div className="header">
      <Link to="/">
        <div className="logo"></div>
      </Link>

      <Menu
        theme="light"
        mode="horizontal"
        style={{ width: "93vw", display: "flex", justifyContent: "flex-end" }}
        selectedKeys={[selectedKey]}
      >
        <Menu.Item key="/">
          <Link to="/">TOP</Link>
        </Menu.Item>
        <Menu.Item key="/company" title="企業情報">
          <Link to="/company">会社情報</Link>
        </Menu.Item>
        <Menu.Item key="/service">
          <Link to="/service">サービス</Link>
        </Menu.Item>

        <Menu.Item key="/development">
          <Link to="/development">開発事例</Link>
        </Menu.Item>
        <Menu.Item key="/scientific_career">
          <Link to="/scientific_career">研究事業</Link>
        </Menu.Item>
        <Menu.Item key="/faq">
          <Link to="/faq">FAQ</Link>
        </Menu.Item>
        <Menu.Item key="/recruit">
          <Link to="/recruit">採用情報</Link>
        </Menu.Item>

        <Menu.Item key="/news">
          <Link to="/news">NEWS</Link>
        </Menu.Item>
        <Menu.Item key="/column">
          <Link to="/column">コラム</Link>
        </Menu.Item>
        <Menu.Item
          key="/inquiry"

        >
          <Link to="/inquiry">問い合わせ</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default AppHeader;
