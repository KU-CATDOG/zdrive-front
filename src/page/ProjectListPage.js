import React, { useEffect, useMemo, useState } from "react";
import { Button, Container, Table, Dropdown, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes/paths";
import { fetchGet, getCurrentPeriod, getPeriodList } from "utils/functions";
import { map } from "lodash";
import { projectStatusKrEnum } from "utils/enums";
import { useSelector } from "react-redux";

function ProjectSearchByPeriod({ onFetched = (data) => data }) {
  const [period, setPeriod] = useState(getCurrentPeriod());
  const periodList = useMemo(() => getPeriodList().reverse(), []);

  function getProjectList() {
    fetchGet(`/project/list?period=${period}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        onFetched(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <>
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
    </>
  );
}

function ProjectSearchByTitle({ onFetched = (data) => data }) {
  const [serachKey, setSearchKey] = useState("");

  function getProjectList(e) {
    e.preventDefault();
    if (!serachKey.length) return;

    fetchGet(`/project/list?search=${serachKey}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        onFetched(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <Form onSubmit={getProjectList}>
      <Container className="px-0">
        <Row>
          <Col>
            <Form.Control placeholder="이름으로 검색..." onChange={(e) => setSearchKey(e.target.value)} />
          </Col>
          <Col md={1}>
            <Button type="submit" disabled={!serachKey.length} style={{ minWidth: "60px" }}>
              조회
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
}

function ProjectListPage() {
  const navigate = useNavigate();
  const logined = useSelector((state) => state.counter.logined);
  const [currentList, setCurrentList] = useState([]);
  const [searchMode, setSearchMode] = useState("");

  const searchModes = ["period", "title"];
  const searchModesKr = { period: "진행기간", title: "타이틀명" };

  useEffect(() => {
    // 페이지 시작시 현재 기간의 프로젝트만 나오도록
    fetchGet(`/project/list?period=${getCurrentPeriod()}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCurrentList(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  return (
    <Container>
      <div className="mt-4 mb-3">
        <h3>프로젝트 목록</h3>
      </div>
      <Container className="px-0" style={{ display: "flex", direction: "row", justifyContent: "space-between" }}>
        <Container className="px-0" style={{ display: "flex", direction: "row", gap: "8px" }}>
          <Dropdown>
            <Dropdown.Toggle>{searchMode.length ? searchModesKr[searchMode] : "검색 선택"}</Dropdown.Toggle>
            <Dropdown.Menu>
              {map(searchModes, (mode, idx) => (
                <Dropdown.Item
                  name={mode}
                  key={idx}
                  onClick={(e) => {
                    setSearchMode(e.target.name);
                  }}
                >
                  {searchModesKr[mode]}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {!!searchMode.length && <div className="mx-2 vr" />}
          {
            {
              period: <ProjectSearchByPeriod onFetched={(data) => setCurrentList(data)} />,
              title: <ProjectSearchByTitle onFetched={(data) => setCurrentList(data)} />,
            }[searchMode]
          }
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
