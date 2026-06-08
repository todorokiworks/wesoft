import "../css/subpage.less";
import React, { useEffect, useState } from "react";
import { getDataUrl, getImageUrl } from "../config";
import SkeletonView from "../common/SkeletonView";
import SubpageTitle from "../common/SubpageTitle";
import * as NewsEntity from "../entities/News";
import { Card, List } from "antd";
import FaqStickyLink from "../common/FaqStickyLink";
import PageMeta from "../common/PageMeta";
import { NEWS_PAGE_META } from "../seo/pageMeta";

const News: React.FC = () => {
  const [news, setEvents] = useState<NewsEntity.News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`${getDataUrl("news.json")}?t=${timestamp}`)
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
    <div className="subpage subpage--news">
      <PageMeta {...NEWS_PAGE_META} />
      <SubpageTitle titleJa="新着情報" titleEn="News" />
      <FaqStickyLink />
      <section
        className="subpage-section subpage-section--news-inner"
        aria-label="ニュース一覧"
      >
        <List
          itemLayout="vertical"
          size="large"
          className="news-list"
          pagination={{
            onChange: () => {
              document.documentElement.scrollTop = 0;
              document.body.scrollTop = 0;
            },
            pageSize: 5,
            showSizeChanger: false,
          }}
          dataSource={news}
          renderItem={(item, index) => (
            <List.Item
              key={`${item.title}-${item.subTitle}-${index}`}
              className="news-list__item"
            >
              <Card
                hoverable
                bordered={false}
                className="news-card news-page-card"
              >
                <div className="news-card__inner">
                  <p className="news-card__date">{item.title}</p>
                  <h2 className="news-card__headline">{item.subTitle}</h2>
                  {item.summary?.trim() ? (
                    <p className="news-card__summary">{item.summary.trim()}</p>
                  ) : null}
                  {item.images?.length ? (
                    <div className="news-card__media">
                      {item.images.map((image) => (
                        <img
                          key={image}
                          src={getImageUrl(image)}
                          alt=""
                          className="news-card__img"
                          loading="lazy"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </Card>
            </List.Item>
          )}
        />
      </section>
    </div>
  );
};

export default News;
