import "../css/subpage.less";
import React, { useEffect, useState } from "react";
import { getDataBaseUrl, getImageUrl } from "../config";
import { useLocation } from "react-router-dom";
import * as CustomerEntity from "../entities/Customer";
import SkeletonView from "../common/SkeletonView";
import SubpageTitle from "../common/SubpageTitle";

const COMPANY_HISTORY: { date: string; text: string }[] = [
  { date: "2025年4月", text: "派遣資格を取得しました。" },
  { date: "2025年4月", text: "横浜商工会に入会しました。" },
  { date: "2025年2月", text: "川崎商工会に入会しました。" },
  { date: "2024年12月", text: "自社オフィス竣工" },
  { date: "2024年5月15日", text: "自社オフィス建築用の土地購入" },
  { date: "2023年1月30日", text: "資本金を2,000万円に増資" },
  { date: "2020年3月", text: "2020年3月に開発事務所を川崎区に移転" },
  { date: "2020年1月6日", text: "ウィソフト株式会社設立" },
];

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

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`${getDataBaseUrl()}/data/customer.json?t=${timestamp}`)
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

  const companyOverviewRows: { key: string; label: string; content: React.ReactNode }[] =
    [
      { key: "1", label: "商号", content: "ウィソフト株式会社" },
      {
        key: "2",
        label: "所在地",
        content: (
          <>
            【本社】
            <br />
            〒210-0022 神奈川県川崎市川崎区池田2丁目6番7号
            <br />
            【徳島事業所】
            <br />
            〒770-0808 徳島市南前川町4-4-3ビラ・フェニックス城之内207
          </>
        ),
      },
      { key: "3", label: "設立", content: "令和2年1月6日" },
      { key: "5", label: "資本金", content: "2,000万円" },
      { key: "6", label: "代表取締役社長", content: "崔国棟" },
      { key: "7", label: "帝国データバンク企業コード", content: "533054707" },
      {
        key: "8",
        label: "参加団体",
        content: (
          <>
            横浜商工会
            <br />
            川崎商工会
          </>
        ),
      },
      {
        key: "9",
        label: "資格",
        content: (
          <>
            労働者派遣事業資格(
            <a
              href={
                "https://jinzai.hellowork.mhlw.go.jp/JinzaiWeb/GICB102010.do?screenId=GICB102010&action=detail&detkey_Detail=%E6%B4%BE14-303679%2C1+++++"
              }
            >
              派14-303679
            </a>
            )
            <br />
            プライバシーマーク(個人情報保護)(
            <a
              href={
                "https://entity-search.jipdec.or.jp/pmark/details?tdfkRadios=&kanaRadios=&eda_number=&company_address=&industry_type1=%E6%8C%87%E5%AE%9A%E3%81%AA%E3%81%97&industry_type2=%E6%8C%87%E5%AE%9A%E3%81%AA%E3%81%97&examining_authority=%E6%8C%87%E5%AE%9A%E3%81%AA%E3%81%97&login_number=10825404"
              }
            >
              登録番号:10825404
            </a>
            )
          </>
        ),
      },
      {
        key: "10",
        label: "取引銀行",
        content: (
          <>
            みずほ銀行
            <br />
            横浜銀行
            <br />
            横浜信用金庫
            <br />
            城南信用金庫
          </>
        ),
      },
    ];

  return (
    <>
      <div className="subpage subpage--company">
        <SubpageTitle titleJa="会社情報" titleEn="Company" />
        <section className="company-section company-section--message" aria-labelledby="t1">
          <div className="message-main">
            <div className="message-content">
              <h3 id="t1" className="message-title">
                社長メッセージ
              </h3>
              <p
                className="message-content-text"
                style={{ marginTop: "0", fontSize: "13px" }}
              >
                私たちの会社は、各個人の個性や強みを大切にし、それを活かしてチームとして力を発揮しています。
                <br />
                <br />
                「個人の特徴を尊重し、チームとして結束することで、社会への貢献がある」これが私たちの信念であり、日々の活動の原動力です。
                <br />
                <br />
                現在、AIやテクノロジーの進化による激しい社会的な変革が進む中、私たちは柔軟な発想と行動力を武器に、未来を切り拓いていきます。
                <br />
                <br />
                さらに、私たちはお客様に対して、「安心・安全・安定的なサービス」を提供することを最優先とし、お客様と一体となって未来を創り上げていく姿勢を貫いています。
                <br />
                <br />
                これからも社員一丸となり、より良い社会の実現に向けて邁進してまいります。皆様のご支援を心よりお願い申し上げます。
              </p>
              <div style={{ width: "100%", textAlign: "right" }}>
                <p style={{ fontSize: "12px", marginBottom: "10px" }}>
                  {" "}
                  ウィソフト株式会社
                  <br />
                  代表取締役社長
                </p>
                <p style={{ fontSize: "20px", margin: "0px" }}> 崔　国棟</p>
              </div>
            </div>
            <div className="message-imgdiv">
              <img
                src={`${getDataBaseUrl()}/image/president.jpg`}
                className="message-image"
                alt="代表取締役社長"
              />
            </div>
          </div>
        </section>

        <section className="company-section" aria-labelledby="t3">
          <h2 id="t3" className="company-title">
            企業理念
          </h2>
          <div className="company-about">
            <p>
              私たちは先端科学・技術に魅力され、常に最前線情報に注目しており、
              <br />
              且つチャレンジ精神を持つ優秀なIT技術者の集まりです。
            </p>
            <p>
              私たちは一人からの力でサービス提供ではなく、全社員間で繋げるネットワークを作っていきます。
            </p>
            <p>いわば「私たち」です。</p>
            <p>
              私たちはお客様視点でお客様と一体になり、安全・安定・安心的な顧客本位のサービスを提供し、
              <br />
              「We」の概念を深め、皆の未来を開拓していきます。
            </p>
            <p>
              さらに、先端技術研究事業で活躍している仲間、各IT分野で活躍しているパートナーとの絆も超え、
              <br />
              競争よりも共有し、横からも「我々」という会社経営理念です。
            </p>
          </div>
        </section>

        <section className="company-section" aria-labelledby="t2">
          <h2 id="t2" className="company-title">
            会社概要
          </h2>
          <dl className="company-overview">
            {companyOverviewRows.map((row) => (
              <div key={row.key} className="company-overview__row">
                <dt className="company-overview__label">{row.label}</dt>
                <dd className="company-overview__value">{row.content}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          className="company-section company-partners"
          aria-labelledby="t4"
        >
          <h2 id="t4" className="company-title">
            取引先
          </h2>
          <div className="company-partners__logos">
            {customers.map((customer) => (
              <a
                key={customer.title}
                className="company-partners__link"
                href={customer.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={getImageUrl(customer.image)}
                  alt={customer.title}
                  title={customer.title}
                  className="company-partners__logo"
                />
              </a>
            ))}
          </div>
          <p className="company-partners__note">
            取引企業様の一部を、順不同でご紹介しております
          </p>
        </section>

        <section className="company-section company-section--map" aria-labelledby="t5">
          <h2 id="t5" className="company-title">
            アクセスマップ
          </h2>
          <div className="company-map-wrap">
            <iframe
              title="wessoft-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3247.3191721591684!2d139.6912718762257!3d35.52110953875269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601860a6530810bf%3A0xbee07705e831d08a!2z44CSMjEwLTAwMjIg56We5aWI5bed55yM5bed5bSO5biC5bed5bSO5Yy65rGg55Sw77yS5LiB55uu77yW4oiS77yXIOOCpuOCo-OCveODleODiOagquW8j-S8muekvg!5e0!3m2!1sja!2sjp!4v1733962646894!5m2!1sja!2sjp"
              className="google-map"
              loading="lazy"
            />
          </div>
        </section>

        <section className="company-section company-history" aria-labelledby="t6">
          <h2 id="t6" className="company-title">
            沿革
          </h2>
          <ul className="company-history__list">
            {COMPANY_HISTORY.map((row) => (
              <li
                key={`${row.date}-${row.text}`}
                className="company-history__item"
              >
                <div className="company-history__item-content">
                  <span className="company-history__date">{row.date}</span>
                  <span className="company-history__text">{row.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
};

export default Company;
