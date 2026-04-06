import React, { useEffect, useState } from "react";
import "../css/home.less";
import { getDataBaseUrl } from "../config";
import TweenOne from "rc-tween-one";
import QueueAnim from "rc-queue-anim";
import { Button, Table } from "antd";
import RcScrollOverPack from "rc-scroll-anim/lib/ScrollOverPack";
import SkeletonView from "../common/SkeletonView";
import useNarrowViewport from "../common/useNarrowViewport";
import * as NewsEntity from "../entities/News";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";
import { useNavigate } from "react-router-dom";

const SubHome0: React.FC = () => {
  const narrow = useNarrowViewport();
  const [news, setEvents] = useState<NewsEntity.News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`${getDataBaseUrl()}/data/news.json?t=${timestamp}`)
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

  // news は JSON 反転済みのため先頭が新しい。type 1 の直近 5 件は先頭から 5 件
  const lastFiveNews = news.filter((item) => item.type === 1).slice(0, 5);

  return (
    <RcScrollOverPack id="top-news" >
      <QueueAnim
        duration={450}
        type="left"
        className="home-title"
        key="title"
        leaveReverse
      >
        <h2 key="h2" className="home-title-ja">新着情報</h2>
        <p className="home-title-en" key="home-title-en">NEWS</p>
      </QueueAnim>
      <TweenOne
        key="content"
        className="home-content"
        animation={{ x: 0, opacity: 1, ease: "easeOutQuad" }}
        style={{
          transform: `translateX(${narrow ? 0 : 100}px)`,
          opacity: 0,
        }}
      >
        <Table<NewsEntity.News>
          dataSource={lastFiveNews}
          showHeader={false}
          pagination={false}
          size="large"
          className="home-table"
          tableLayout="fixed"
        >
          <ColumnGroup title="Name">
            <Column
              dataIndex="title"
              key="title"
              className="home-table-title"
              width={200}
              render={(title: string, _record: NewsEntity.News, rowIndex: number) => (
                <span className="home-table-date">
                  {title}
                  {rowIndex === 0 ? (
                    <span className="home-table-new-badge" aria-label="新着">
                      NEW
                    </span>
                  ) : null}
                </span>
              )}
            />
          </ColumnGroup>

          <ColumnGroup title="subTitle">
            <Column
              className="home-table-content"
              render={(_: any, record: NewsEntity.News) => (
                <div className="home-table-content-inner">
                  <span className="subTitle">{record.subTitle}</span>

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

      >
        <Button
          type="primary"
          className="c-btn slide"
          style={{ width: "160px" }}
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
