import MDEditor from "@uiw/react-md-editor";
import { map } from "lodash";
import React, { useEffect, useState } from "react";
import { Container, Button, Form, Dropdown, Spinner, Row, Col, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "routes/paths";
import { projectStatusKrEnum, visibilityKrEnum } from "utils/enums";
import { fetchDelete, fetchGet, fetchPut } from "utils/functions";

function ProjectEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [projectLoaded, setProjectLoaded] = useState(false);
  const [projectInfo, setProjectInfo] = useState({});
  const [editSubmited, setEditSubmited] = useState(false);

  const [showMemberManage, setShowMemberManage] = useState(false);

  function handleFormValueChange(e) {
    setProjectInfo((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

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
        const fetchedProjectInfo = { ...data };

        fetchedProjectInfo.startDate = data.startDate?.split("T")[0];
        fetchedProjectInfo.endDate = data.endDate?.split("T")[0];

        setProjectInfo(fetchedProjectInfo);
        setProjectLoaded(true);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  function handleDeleteButtonClick(e) {
    e.preventDefault();

    if (window.confirm("삭제하시겠습니까?")) {
      fetchDelete(`/project/${id}`)
        .then((res) => {
          // TODO: 오류 처리
          if (!res.ok) {
            throw new Error("err");
          }
          alert("삭제되었습니다");
          navigate(PATHS.project.list);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (editSubmited) return;
    setEditSubmited(true);

    fetchPut(`/project/${id}`, projectInfo)
      .then((res) => {
        // TODO: 오류 처리
        if (!res.ok) {
          throw new Error("err");
        }
        alert("수정이 완료되었습니다");
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setEditSubmited(false);
      });
  }

  useEffect(() => {
    getProjectInfo();
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <Button onClick={() => navigate(`${PATHS.project.detail}/${id}`)}>상세보기로 돌아가기</Button>
          {projectLoaded && (
            <Button className="float-end" variant="danger" onClick={handleDeleteButtonClick}>
              삭제하기
            </Button>
          )}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <h2>프로젝트 정보 수정</h2>
          <hr />
        </Col>
      </Row>

      {projectLoaded ? (
        <Form onSubmit={handleFormSubmit}>
          <h4>기본정보</h4>
          <Form.Group className="mb-3">
            <Form.Label>
              게임명 (프로젝트명) <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control required name="name" value={projectInfo.name} onChange={handleFormValueChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>이미지</Form.Label>
            <br />
            <Form.Text>개발중</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" data-color-mode="light">
            <Form.Label>개발 개요</Form.Label>
            <MDEditor
              height={400}
              value={projectInfo.description ?? ""}
              onChange={(e) => {
                setProjectInfo((prev) => {
                  return { ...prev, description: e };
                });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>팀원</Form.Label>
            <br />
            <Button onClick={() => setShowMemberManage(true)}>팀원 관리창 열기</Button>
            <Modal show={showMemberManage} onHide={() => setShowMemberManage(false)}>
              <Modal.Header closeButton>팀원 관리</Modal.Header>
              <Modal.Body>hello world</Modal.Body>
            </Modal>
          </Form.Group>

          <hr />
          <h4>세부정보</h4>
          <Form.Group className="mb-3">
            <Form.Label>장르</Form.Label>
            <Form.Control name="genre" value={projectInfo.genre ?? ""} onChange={handleFormValueChange} />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>프로젝트 상태</Form.Label>
                <Dropdown>
                  <Dropdown.Toggle>{projectStatusKrEnum[projectInfo.status ?? 0]}</Dropdown.Toggle>

                  <Dropdown.Menu>
                    {map(projectStatusKrEnum, (enumString, idx) => (
                      <Dropdown.Item
                        name="status"
                        key={idx}
                        onClick={(e) => {
                          setProjectInfo((prev) => {
                            return { ...prev, [e.target.name]: idx };
                          });
                        }}
                      >
                        {enumString}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>외부 공개 설정</Form.Label>
                <Form.Check
                  type="switch"
                  name="visibility"
                  label={visibilityKrEnum[projectInfo.visibility ?? 0]}
                  onChange={(e) => {
                    setProjectInfo((prev) => {
                      return { ...prev, [e.target.name]: e.target.checked ? 0 : 1 };
                    });
                  }}
                  defaultChecked={projectInfo.visibility === 0}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>시작일</Form.Label>
                <Form.Control
                  required
                  name="startDate"
                  type="date"
                  value={projectInfo.startDate ?? new Date().toISOString().split("T")[0]}
                  onChange={handleFormValueChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>종료일</Form.Label>
                <Form.Control
                  required
                  name="endDate"
                  type="date"
                  value={projectInfo.endDate ?? new Date().toISOString().split("T")[0]}
                  onChange={handleFormValueChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>엔진</Form.Label>
            <Form.Control name="engine" value={projectInfo.engine ?? ""} onChange={handleFormValueChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>동아리 Z드라이브 경로</Form.Label>
            <Form.Control name="fileSrc" value={projectInfo.fileSrc ?? ""} onChange={handleFormValueChange} />
          </Form.Group>

          <div className="float-end mb-4">
            <Button type="submit" disabled={editSubmited}>
              {editSubmited ? <Spinner animation="border" size="sm" /> : "저장"}
            </Button>
          </div>
        </Form>
      ) : (
        <p>로딩중</p>
      )}
    </Container>
  );
}

export default ProjectEditPage;
