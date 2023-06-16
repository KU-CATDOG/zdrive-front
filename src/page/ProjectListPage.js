import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes/paths";

function ProjectListPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <p>ProjectListPage</p>
      <Button onClick={() => navigate(PATHS.project.add)}>to Project Add</Button>
    </Container>
  );
}

export default ProjectListPage;
