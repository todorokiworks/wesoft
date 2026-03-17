import "../css/subpage.less";
import React, { useEffect, useState } from "react";
import { Descriptions, DescriptionsProps, Space } from "antd";
import { useLocation } from "react-router-dom";
import * as CustomerEntity from "../entities/Customer";
import SkeletonView from "../common/SkeletonView";

const Company: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        const yOffset = -90;
        const y =
          element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [hash]);

  const [customers, setEvents] = useState<CustomerEntity.Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const timestamp = new Date().getTime();

  useEffect(() => {
    fetch(`/data/customer.json?t=${timestamp}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <SkeletonView />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "商号",
      children: "ウィソフト株式会社",
    },
    {
      key: "2",
      label: "所在地",
      children: (
        <>
          〒210-0022
          <br />
          神奈川県川崎市川崎区池田2丁目6番7号
        </>
      ),
    },
    {
      key: "3",
      label: "設立",
      children: "令和２年１月６日",
    },
    {
      key: "5",
      label: "資本金",
      children: "2000万円",
    },
    {
      key: "6",
      label: "代表取締役社長",
      children: "崔　国棟",
    },
    {
      key: "7",
      label: "帝国データバンク企業コード",
      children: "533054707",
    },
    {
      key: "8",
      label: "加盟団体",
      children: (
        <ul>
          <li>横浜商工会</li>
          <li>川崎商工会</li>
        </ul>
      ),
    },
    {
      key: "9",
      label: "資格",

      children: (
        <ul>
          <li>
            労働者派遣事業資格&nbsp;&nbsp;(
            <a
              href={
                "https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB102010.do?screenId=GICB102010&action=detail&detkey_Detail=%E6%B4%BE14-303679%2C1+++++"
              }
            >
              派14-303679
            </a>
            )
          </li>
          <li>
            プライバシーマーク(個人情報保護)&nbsp;&nbsp;(
            <a
              href={
                "https://entity-search.jipdec.or.jp/pmark/details?tdfkRadios=&kanaRadios=&eda_number=&company_address=&industry_type1=%E6%8C%87%E5%AE%9A%E3%81%AA%E3%81%97&industry_type2=%E6%8C%87%E5%AE%9A%E3%81%AA%E3%81%97&examining_authority=%E6%8C%87%E5%AE%9A%E3%81%AA%E3%81%97&login_number=10825404"
              }
            >
              登録番号:10825404
            </a>
            ){" "}
          </li>
        </ul>
      ),
    },
    {
      key: "10",
      label: "取引銀行",
      children: (
        <ul>
          <li>みずほ銀行</li>
          <li>横浜銀行</li>
          <li>横浜信用金庫</li>
          <li>城南信用金庫</li>
        </ul>
      ),
    },
  ];

  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  return (
    <>
      <div className="subpage">
        <Space
          align="center"
          style={{ width: "100vw" }}
          wrap
          direction="vertical"
        >
          <h2 id="t1">社長メッセージ</h2>
          <div className="message-main">
            <div className="message-content">
              <p style={{ marginTop: "0" }}>
                私たちの会社は、一人ひとりの個性や強みを大切にし、それを活かしてチームとしての力を発揮しています。
              </p>
              <p>
                「個人の特徴を尊重し、チームとして存在することで、社会への貢献を果たす」これが私たちの信念であり、日々の活動の原動力です。
              </p>
              <p>
                現在、AIやテクノロジーの進化による激しい社会的な変革が進む中、私たちは柔軟な発想と行動力を武器に、未来を切り拓いていきます。個々の創造力を結集し、新たな価値を生み出すことで、変化の波に乗りながらも本質を見失わない企業であり続けたいと考えています。
              </p>
              <p>
                さらに、私たちはお客様に対し、「安心・安全・安定的なサービス」を提供することを最優先とし、お客様と一体となって未来を創り上げていく姿勢を貫いています。お客様との信頼関係を深めながら、ともに発展していくことを目指します。
              </p>
              <p>
                これからも社員一丸となり、より良い社会の実現に向けて邁進してまいります。皆さまのご支援を心よりお願い申し上げます。
              </p>
              <div
                style={{ width: "100%", textAlign: "right", fontSize: "1em" }}
              >
                ウィソフト株式会社
                <br />
                代表取締役社長
                <br />
                崔　国棟
              </div>
            </div>
            <div className="message-imgdiv">
              <img src="/image/president.jpg" className="message-image" />
            </div>
          </div>
          <h2 id="t2">会社概要</h2>
          <Space
            align="center"
            direction="vertical"
            style={{ marginBottom: "100px" }}
          >
            <Descriptions
              className="descriptions-table"
              column={1}
              size={"middle"}
              bordered
              items={items}
            />

            <iframe
              title="wessoft-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3247.3191721591684!2d139.6912718762257!3d35.52110953875269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601860a6530810bf%3A0xbee07705e831d08a!2z44CSMjEwLTAwMjIg56We5aWI5bed55yM5bed5bSO5biC5bed5bSO5Yy65rGg55Sw77yS5LiB55uu77yW4oiS77yXIOOCpuOCo-OCveODleODiOagquW8j-S8muekvg!5e0!3m2!1sja!2sjp!4v1733962646894!5m2!1sja!2sjp"
              className="google-map"
              loading="lazy"
            ></iframe>
          </Space>
          <h2 id="t3">企業理念</h2>
          <Space
            align="start"
            direction="vertical"
            style={{ marginBottom: "100px" }}
          >
            <div className="company-about">
              <p>
                私たちは先端科学・技術に魅力され、常に最前線情報に注目しており、且つチャレンジ精神を持つ優秀なIT技術者の集まりです。
              </p>
              <p>
                私たちは一人からの力でサービス提供ではなく、全社員間で繋げるネットワークを作っていきます。
              </p>
              <p>いわば「We」です。</p>
              <p>
                私たちはお客様視点でお客様と一体になり、安全・安定・安心的な顧客本位のサービスを提供し、「We」の概念を深め、皆の未来を開拓していきます。
              </p>
              <p>
                さらに、先端技術研究事業で活躍している仲間、各IT分野で活躍しているパートナーとの絆も築き、競争よりも共有、横からも「We」という会社経営理念です。
              </p>
            </div>
          </Space>
          <h2 id="t4">取引先</h2>
          <p style={{ color: "#666", fontSize: "1em" }}>
            取引企業様の一部を、順不同でご紹介しております
          </p>
          <Space
            align="center"
            wrap
            direction="horizontal"
            style={{
              width: "80vw",
              justifyContent: "center",
            }}
          >
            {customers.map((customer) => (
              <>
                <a href={customer.link}>
                  <img
                    src={customer.image}
                    alt={customer.title}
                    title={customer.title}
                    style={{ width: "240px" }}
                  />
                </a>
              </>
            ))}
          </Space>
        </Space>
      </div>
    </>
  );
};

export default Company;
