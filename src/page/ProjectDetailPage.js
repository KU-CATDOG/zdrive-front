import React, { useEffect, useState } from "react";
import { Container, Button, Spinner, Col, Row, Carousel, Stack, Table } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PATHS } from "routes/paths";
import { memberRoleKrEnum, projectStatusKrEnum, visibilityKrEnum } from "utils/enums";
import { fetchGet } from "utils/functions";
import MDEditor from "@uiw/react-md-editor";
import { useSelector } from "react-redux";
import { get, map, sortBy } from "lodash";
import NoValueCheck from "components/NoValueCheck";

function ProjectDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();
  const prevRoute = get(state, "prevRoute", PATHS.project.list);
  const userId = useSelector((state) => state.counter.userId);

  const [projectInfo, setProjectInfo] = useState({});

  const [imageIndex, setImageIndex] = useState(0);

  function getProjectInfo() {
    fetchGet(`/project/${id}`)
      .then((res) => {
        if (!res.ok) {
          switch (res.status) {
            case 401:
              navigate(PATHS.login);
              throw new Error("허용되지 않은 접근입니다. 우선 로그인해주세요");
            case 404:
              navigate(PATHS.project.list);
              throw new Error("프로젝트가 존재하지 않습니다");
            default:
              throw new Error("미확인 오류입니다. 관리자에게 문의해주세요");
          }
        }
        return res.json();
      })
      .then((data) => {
        setProjectInfo(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  useEffect(() => {
    getProjectInfo();
  }, []);

  return (
    <Container>
      {projectInfo.id ? (
        <>
          <Stack direction="horizontal">
            <Button className="me-auto" onClick={() => navigate(prevRoute)}>
              돌아가기
            </Button>
            {userId === projectInfo.userId && <Button onClick={() => navigate(`${PATHS.project.edit}/${id}`)}>수정</Button>}
          </Stack>
          <div className="text-center">
            <h1>{projectInfo.name}</h1>
            <Container>
              <Row className="my-4">
                <Col>
                  <Carousel activeIndex={imageIndex} onSelect={setImageIndex}>
                    <Carousel.Item>
                      <div style={{ height: "400px", backgroundColor: "black" }} />
                      <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <div style={{ height: "400px", backgroundColor: "black" }} />
                      <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <div style={{ height: "400px", backgroundColor: "black" }} />
                      <Carousel.Caption>
                        <h3>Third slide label</h3>
                        <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={8}>
                  <div data-color-mode="light" className="text-start w-100 mb-2 p-2" style={{ border: "1px solid lightgray" }}>
                    <h4>게임 설명</h4>
                    <hr />
                    <MDEditor.Markdown source={projectInfo.description} />
                  </div>
                  <div className="w-100 mb-2 p-2 text-start" style={{ border: "1px solid lightgray" }}>
                    <h4>개발진 소개</h4>
                    <hr />
                    <Table>
                      <tbody>
                        {map(sortBy(projectInfo.members, "index"), (member) => (
                          <tr key={member.id}>
                            <td className="col-3">
                              <h5>{member.studentNum.name}</h5>
                              <h6 style={{ color: "lightslategray" }}>{member.studentNumber}</h6>
                            </td>
                            <td className="col-3">{memberRoleKrEnum[member.role]}</td>
                            <td className="col-6">
                              <NoValueCheck>{member.description}</NoValueCheck>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col md={4}>
                  <Table bordered>
                    <tbody>
                      <tr>
                        <th>장르</th>
                        <td>
                          <NoValueCheck>{projectInfo.genre}</NoValueCheck>
                        </td>
                      </tr>
                      <tr>
                        <th>상태</th>
                        <td>{projectStatusKrEnum[projectInfo.status ?? 0]}</td>
                      </tr>
                      <tr>
                        <th>시작일</th>
                        <td>{projectInfo.startDate?.split("T")[0]}</td>
                      </tr>
                      <tr>
                        <th>종료일</th>
                        <td>{projectInfo.endDate?.split("T")[0]}</td>
                      </tr>
                      <tr>
                        <th>개발엔진</th>
                        <td>
                          <NoValueCheck>{projectInfo.engine}</NoValueCheck>
                        </td>
                      </tr>
                      <tr>
                        <th>Z드라이브 위치</th>
                        <td>
                          <NoValueCheck>{projectInfo.fileSrc}</NoValueCheck>
                        </td>
                      </tr>
                      <tr>
                        <th>외부 공개 설정</th>
                        <td>{visibilityKrEnum[projectInfo.visibility ?? 0]}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          </div>
        </>
      ) : (
        <>
          <Button className="me-auto" onClick={() => navigate(PATHS.project.list)}>
            목록으로 돌아가기
          </Button>
          <div className="text-center">
            <Spinner animation="border" size="lg" />
          </div>
        </>
      )}
    </Container>
  );
}

export default ProjectDetailPage;
