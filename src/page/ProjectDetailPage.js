import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "routes/paths";
import { fetchGet } from "utils/functions";

function ProjectDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projectInfo, setProjectInfo] = useState();

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
      <p>ProjectDetailPage</p>
      <p>{id}</p>
      {JSON.stringify(projectInfo)}
      <Button onClick={() => navigate(`${PATHS.project.edit}/${id}`)}>수정하기</Button>
      <Button onClick={() => navigate(PATHS.project.list)}>목록으로 돌아가기</Button>
    </Container>
  );
}

export default ProjectDetailPage;
