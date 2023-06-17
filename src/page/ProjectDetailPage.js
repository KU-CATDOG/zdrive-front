import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes/paths";

function ProjectDetailPage() {
  const navigate = useNavigate();
  return (
    <Container>
      <p>ProjectDetailPage</p>
      <Button onClick={() => navigate(PATHS.project.list)}>목록으로 돌아가기</Button>
    </Container>
  );
}

export default ProjectDetailPage;
