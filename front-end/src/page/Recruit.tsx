import "../css/subpage.less";
import React, { useEffect, useState } from "react";
import { Card, Space } from "antd";
import SkeletonView from "../common/SkeletonView";
import * as JobEntity from "../entities/Jobs";

const Recruit: React.FC = () => {
  const [items, setEvents] = useState<JobEntity.Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`/data/recruit.json?t=${timestamp}`)
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
      <Space
        direction="horizontal"
        style={{ width: "100vw", justifyContent: "center" }}
        align="center"
        wrap
      >
        {items.map((item) => (
          <Card
            hoverable
            title={
              <span
                style={{
                  fontSize: "1.5em",
                  fontFamily: "CustomFont",
                  color: "#333",
                }}
              >
                {item.title}
              </span>
            }
            className="main-card recruit-card"
          >
            {item.description && <p>{item.description}</p>}

            {item.contents &&
              item.contents.map((content) => (
                <div>
                  {content.title && <h3>{content.title}</h3>}
                  {content.description && (
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      {content.description}
                    </p>
                  )}
                  {content.list && (
                    <ul>
                      {content.list.map((requirement) => (
                        <li style={{ whiteSpace: "pre-wrap" }}>
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </Card>
        ))}
      </Space>
    </div>
  );
};

export default Recruit;
