import "../css/subpage.less";
import React, { useEffect, useState } from "react";
import SkeletonView from "../common/SkeletonView";
import * as NewsEntity from "../entities/News";
import { Card, List } from "antd";
import Meta from "antd/es/card/Meta";

const News: React.FC = () => {
  const [news, setEvents] = useState<NewsEntity.News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const timestamp = new Date().getTime();

  useEffect(() => {
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

  if (loading) {
    return <SkeletonView />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="subpage"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <List
        itemLayout="vertical"
        size="large"
        className="news-list"
        pagination={{
          onChange: (page) => {
            // window.scrollTo({ top: 0, behavior: "smooth" });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
          },
          pageSize: 5,
        }}
        dataSource={news}
        renderItem={(item) => (
          <List.Item key={item.title}>
            <>
              <Card
                hoverable
                className="main-card news-card"
                cover={
                  <>
                    <Meta
                      style={{
                        width: "100%",
                        textAlign: "center",
                        fontSize: "1.0em",
                      }}
                      title={
                        <div className="news-text-main">
                          <div className="news-date">
                            <h2>{item.title}</h2>
                          </div>
                          <div className="news-title">
                            <div className="news-content">
                              <h2
                                style={{
                                  whiteSpace: "normal",
                                  wordWrap: "break-word",
                                }}
                              >
                                {item.subTitle}
                              </h2>
                            </div>
                          </div>
                        </div>
                      }
                      description={
                        <div className="news-summary">{item.summary}</div>
                      }
                    />
                    {item.images
                      ? item.images.map((image) => (
                          <div
                            style={{
                              width: "100%",
                              marginTop: "20px",
                              textAlign: "center",
                            }}
                          >
                            <img style={{ width: "80%" }} src={image} />
                          </div>
                        ))
                      : null}
                  </>
                }
              ></Card>
            </>
          </List.Item>
        )}
      />
    </div>
  );
};

export default News;
