import React, { useEffect, useState } from "react";
import "../css/home.less";
import { getDataBaseUrl } from "../config";
import TweenOne from "rc-tween-one";
import QueueAnim from "rc-queue-anim";
import { Table } from "antd";
import RcScrollOverPack from "rc-scroll-anim/lib/ScrollOverPack";
import SkeletonView from "../common/SkeletonView";
import * as NewsEntity from "../entities/News";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
const SubHome1: React.FC = () => {
  const [news, setEvents] = useState<NewsEntity.News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${getDataBaseUrl()}/data/news.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data.reverse());
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

  let lastNews = news.filter((item) => item.type === 2).slice(-10);

  return (
    <RcScrollOverPack id="top-news" className="homepage">
      <QueueAnim
        duration={450}
        type="left"
        className="home-title"
        key="title"
        leaveReverse
      >
        <h2 key="h2">沿革(設立から)</h2>
      </QueueAnim>
      <TweenOne
        key="content"
        className="home-content"
        animation={{ x: 0, opacity: 1, ease: "easeOutQuad" }}
        style={{
          transform: "translateX(100px)",
          opacity: 0,
          marginBottom: "200px",
        }}
      >
        <Table<NewsEntity.News>
          dataSource={lastNews}
          showHeader={false}
          pagination={false}
          size="large"
          className="home-table"
        >
          <ColumnGroup title="Name">
            <Column dataIndex="title" key="title" />
          </ColumnGroup>

          <ColumnGroup title="subTitle">
            <Column
              render={(_: any, record: NewsEntity.News) => (
                <div>
                  <span className="subTitle">{record.subTitle}</span>
                  <br />
                  <span className="summary">{record.summary}</span>
                </div>
              )}
            />
          </ColumnGroup>
        </Table>
      </TweenOne>
    </RcScrollOverPack>
  );
};

export default SubHome1;
