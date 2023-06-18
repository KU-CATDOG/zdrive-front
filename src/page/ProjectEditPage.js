import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "routes/paths";

function ProjectEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <Container>
      <p>ProjectEditPage</p>
      <p>{id}</p>
      <Button onClick={() => navigate(`${PATHS.project.detail}/${id}`)}>상세보기로 돌아가기</Button>
    </Container>
  );
}

export default ProjectEditPage;
