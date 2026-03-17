import "../css/subpage.less";
import React, { useEffect, useState } from "react";
import { Card, Carousel, Space } from "antd";
import SkeletonView from "../common/SkeletonView";

import * as ScientificCareerEntity from "../entities/ScientificCareers";

const ScientificCareer: React.FC = () => {
  const [items, setEvents] = useState<
    ScientificCareerEntity.ScientificCareer[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const timestamp = new Date().getTime();

  useEffect(() => {
    fetch(`/data/scientific_career.json?t=${timestamp}`)
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

  return (
    <div className="subpage">
      <Carousel autoplay arrows>
        {items.map((item) => {
          const dynamicContentStyle = {
            height: "450px",
            width: "100vw",
            justifyContent: "center",
            padding: "4px",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url(${item.coverUrl})`,
          };
          return (
            item.coverUrl && (
              <>
                <Space style={dynamicContentStyle} align="center">
                  <Space
                    direction="vertical"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      minWidth: "100px",
                      padding: "10px",
                      textAlign: "center",
                      borderRadius: "10px",
                    }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.subTitle}</p>
                  </Space>
                </Space>
              </>
            )
          );
        })}
      </Carousel>

      <Space
        direction="horizontal"
        style={{
          width: "100vw",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
        align="center"
        wrap
      >
        {items.map((item) => (
          <div title={item.title} className="scientific-career-main">
            {item.description && <p>{item.description}</p>}

            {item.contents &&
              item.contents.map((content) => (
                <div>
                  {content.title && <h3>{content.title}</h3>}
                  {content.description && <p>{content.description}</p>}
                  {content.list && (
                    <ul>
                      {content.list.map((requirement) => (
                        <li>{requirement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        ))}
      </Space>
    </div>
  );
};

export default ScientificCareer;
