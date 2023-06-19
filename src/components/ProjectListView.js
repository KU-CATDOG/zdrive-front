import { map, slice } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "routes/paths";
import { fetchGet } from "utils/functions";

function ProjectListView({ fetchUrl = "/project/list?period=2023-1", cutoutCount = 5 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentList, setCurrentList] = useState([]);
  const [cutouted, setCutouted] = useState(false);

  function getProjectList() {
    fetchGet(fetchUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (data.length) {
          if (data.length > cutoutCount) {
            setCutouted(true);
            slice(data, 0, cutoutCount);
          }
          setCurrentList(data);
        }
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  useEffect(() => {
    getProjectList();
  }, []);

  return (
    <>
      {currentList.length > 0 ? (
        <Table hover>
          <thead>
            <tr>
              <th>이름</th>
              <th>장르</th>
            </tr>
          </thead>
          <tbody>
            {map(currentList, (project) => (
              <tr
                key={project.id}
                onClick={() =>
                  navigate(`${PATHS.project.detail}/${project.id}`, {
                    state: {
                      prevRoute: location.pathname,
                    },
                  })
                }
              >
                <td>{project.name}</td>
                <td>{project.genre ?? <span style={{ color: "lightgray" }}>미작성</span>}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center" style={{ color: "gray" }}>
          열람 가능한 프로젝트가 없습니다
        </p>
      )}
      {cutouted && (
        <Button size="sm" variant="link" className="float-end" onClick={() => navigate(PATHS.project.list)}>
          더보기
        </Button>
      )}
    </>
  );
}

export default ProjectListView;
