import React, { useEffect, useState } from "react";
import "../css/home.less";
import TweenOne from "rc-tween-one";
import QueueAnim from "rc-queue-anim";
import { Button, Table } from "antd";
import RcScrollOverPack from "rc-scroll-anim/lib/ScrollOverPack";
import SkeletonView from "../common/SkeletonView";
import * as NewsEntity from "../entities/News";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
import { useNavigate } from "react-router-dom";

const SubHome0: React.FC = () => {
  const [news, setEvents] = useState<NewsEntity.News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`/data/news.json?t=${timestamp}`)
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

  const navigate = useNavigate();

  const handleLinkTo = () => {
    navigate("/news");
    window.scrollTo(0, 0);
  };
  if (loading) {
    return <SkeletonView />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  let lastFiveNews = news.filter((item) => item.type === 1).slice(-5);

  return (
    <RcScrollOverPack id="top-news" className="homepage">
      <QueueAnim
        duration={450}
        type="left"
        className="home-title"
        key="title"
        leaveReverse
      >
        <h2 key="h2">ニュース</h2>
      </QueueAnim>
      <TweenOne
        key="content"
        className="home-content"
        animation={{ x: 0, opacity: 1, ease: "easeOutQuad" }}
        style={{
          transform: "translateX(100px)",
          opacity: 0,
        }}
      >
        <Table<NewsEntity.News>
          dataSource={lastFiveNews}
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
      <QueueAnim
        duration={450}
        type="left"
        className="home-button"
        key="title"
        leaveReverse
        style={{ marginBottom: "200px" }}
      >
        <Button
          type="primary"
          style={{ backgroundColor: "#CC3300", borderColor: "#CC3300" }}
          size="large"
          onClick={handleLinkTo}
        >
          詳細はこちら
        </Button>
      </QueueAnim>
    </RcScrollOverPack>
  );
};

export default SubHome0;
