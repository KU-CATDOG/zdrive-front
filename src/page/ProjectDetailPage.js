import React, { useEffect, useState } from "react";
import { Container, Button, Spinner, Col, Row, Carousel, Stack, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "routes/paths";
import { projectStatusKrEnum } from "utils/enums";
import { fetchGet } from "utils/functions";

function ProjectDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

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
      <p>ProjectDetailPage / ID: {id}</p>
      {projectInfo.id ? (
        <>
          <Stack direction="horizontal">
            <Button className="me-auto" onClick={() => navigate(PATHS.project.list)}>
              돌아가기
            </Button>
            <Button onClick={() => navigate(`${PATHS.project.edit}/${id}`)}>수정</Button>
          </Stack>
          <div className="text-center">
            <h1>{projectInfo.name}</h1>
            <Container>
              <Row className="mb-2">
                <Col>
                  <Carousel activeIndex={imageIndex} onSelect={setImageIndex}>
                    <Carousel.Item>
                      <div style={{ height: "300px", backgroundColor: "black" }} />
                      <Carousel.Caption>
                        <h3>First slide label</h3>
                        <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <div style={{ height: "300px", backgroundColor: "black" }} />
                      <Carousel.Caption>
                        <h3>Second slide label</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                      <div style={{ height: "300px", backgroundColor: "black" }} />
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
                  <div className="w-100 mb-2 p-2" style={{ border: "1px solid lightgray" }}>
                    {projectInfo.description}
                  </div>
                  <div className="w-100 mb-2 p-2" style={{ border: "1px solid lightgray" }}>
                    {projectInfo.members}
                  </div>
                </Col>
                <Col md={4}>
                  <Table bordered>
                    <tbody>
                      <tr>
                        <th>장르</th>
                        <td>{projectInfo.genre}</td>
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
                        <td>{projectInfo.engine}</td>
                      </tr>
                      <tr>
                        <th>Z드라이브 위치</th>
                        <td>{projectInfo.fileSrc}</td>
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
