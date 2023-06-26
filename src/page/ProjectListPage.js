import React, { useEffect, useMemo, useState } from "react";
import { Button, Container, Table, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes/paths";
import { fetchGet, getCurrentPeriod, getPeriodList } from "utils/functions";
import { map } from "lodash";
import { projectStatusKrEnum } from "utils/enums";
import { useSelector } from "react-redux";

function ProjectListPage() {
  const navigate = useNavigate();
  const logined = useSelector((state) => state.counter.logined);
  const [currentList, setCurrentList] = useState([]);
  const [period, setPeriod] = useState(getCurrentPeriod());
  const periodList = useMemo(() => getPeriodList().reverse(), []);

  function getProjectList() {
    fetchGet(`/project/list?period=${period}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCurrentList(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  useEffect(() => {
    getProjectList();
  }, []);

  return (
    <Container>
      <div className="mt-4 mb-3">
        <h3>프로젝트 목록</h3>
      </div>
      <Container className="px-0" style={{ display: "flex", direction: "row", justifyContent: "space-between" }}>
        <Container className="px-0" style={{ display: "flex", direction: "row", gap: "8px" }}>
          <Dropdown>
            <Dropdown.Toggle className="btn-light" style={{ border: "1px solid lightgray" }}>
              {period ?? periodList[0]}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {map(periodList, (period, idx) => (
                <Dropdown.Item
                  name={period}
                  key={idx}
                  onClick={(e) => {
                    setPeriod(e.target.name);
                  }}
                >
                  {period}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button style={{ minWidth: "60px" }} onClick={() => getProjectList()}>
            조회
          </Button>
        </Container>
        {logined && (
          <Button style={{ minWidth: "60px" }} onClick={() => navigate(PATHS.project.add)}>
            추가
          </Button>
        )}
      </Container>
      <Container className="my-3" />
      <Table bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>이름</th>
            <th>장르</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {map(currentList, (project, idx) => (
            <tr key={idx} onClick={() => navigate(`${PATHS.project.detail}/${project.id}`)} style={{ cursor: "pointer" }}>
              <td>{idx + 1}</td>
              <td>{project.name}</td>
              <td>{project.genre}</td>
              <td>{projectStatusKrEnum[project.status]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ProjectListPage;
