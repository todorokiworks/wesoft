import "../css/subpage.less";
import React, { useEffect, useState } from "react";
import { Card, Drawer, Space } from "antd";
import SkeletonView from "../common/SkeletonView";
import * as ProjectEntity from "../entities/Projects";

const Development: React.FC = () => {
  const [items, setEvents] = useState<ProjectEntity.Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [projectOpenFlag, setProjectOpenFlag] = useState<boolean>(false);
  const [project, setProject] = useState<ProjectEntity.Project | null>(null);

  useEffect(() => {
    const timestamp = new Date().getTime();
    fetch(`/data/project.json?t=${timestamp}`)
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

  const showProject = (project: ProjectEntity.Project) => {
    setProject(project);
    setProjectOpenFlag(true);
  };

  const closeProject = () => {
    setProjectOpenFlag(false);
    setProject(null);
  };

  if (loading) {
    return <SkeletonView />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="subpage">
      <Space
        direction="vertical"
        align="center"
        style={{ width: "100vw" }}
        wrap
      >
        <Space
          direction="horizontal"
          className="main"
          align="center"
          style={{ justifyContent: "center", marginTop: "10px" }}
          wrap
        >
          {items.map((item) => (
            <>
              <Card
                className="project-card main-card"
                onClick={() => showProject(item)}
                cover={<img src={item.imgUrl} style={{ height: "200px" }} alt={item.title} />}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Card>
            </>
          ))}
        </Space>
      </Space>

      <Drawer
        title={project?.title}
        size="large"
        onClose={closeProject}
        open={projectOpenFlag}
      >
        <p>{project?.description}</p>
        {project?.subItems.map((subItem) => (
          <>
            <h4>{subItem.title}</h4>
            <p>{subItem.description}</p>
          </>
        ))}
      </Drawer>
    </div>
  );
};

export default Development;
