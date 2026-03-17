import { Card, TimelineItemProps } from "antd";
import Meta from "antd/es/card/Meta";

export interface News {
  title: string;
  subTitle: string;
  summary: string;
  type: number;
  images: string[];
  contents: Content[];
}

export interface Content {
  title: string;
  detail: string;
  images: string[];
}

export function convertToMiniTimeLine(news: News): TimelineItemProps {
  return {
    label: news.title,
    children: (
      <>
        <h4>{news.subTitle}</h4>
        <p>{news.summary}</p>
      </>
    ),
    style: {
      textAlign: "left",
      fontSize: "1.5em",
      whiteSpace: "nowrap",
    },
  };
}

export function convertToTimeLine(news: News): TimelineItemProps {
  return {
    label: news.title,
    children: (
      <>
        {news.contents ? (
          <>
            {news.contents.map((content) => (
              <Card
                style={{ width: "40vw" }}
                cover={
                  <>
                    {content.images
                      ? content.images.map((image) => (
                          <img src={image} style={{ marginBottom: "2px" }} />
                        ))
                      : null}
                  </>
                }
              >
                <Meta title={content.title} description={content.detail} />
              </Card>
            ))}
          </>
        ) : (
          <>
            <h4>{news.subTitle}</h4>
            <p>{news.summary}</p>
          </>
        )}
      </>
    ),
  };
}
