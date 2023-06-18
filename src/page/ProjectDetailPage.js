import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "routes/paths";

function ProjectDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Container>
      <p>ProjectDetailPage</p>
      <p>{id}</p>
      <Button onClick={() => navigate(`${PATHS.project.edit}/${id}`)}>수정하기</Button>
      <Button onClick={() => navigate(PATHS.project.list)}>목록으로 돌아가기</Button>
    </Container>
  );
}

export default ProjectDetailPage;
