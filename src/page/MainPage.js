import React from "react";
import { Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes/paths";

function LoginedMainPage() {
  const navigate = useNavigate();

  return (
    <>
      <p>logined</p>
      <Button onClick={() => navigate(PATHS.project.add)}>to Project Add</Button>
    </>
  );
}

function MainPage() {
  const logined = useSelector((state) => state.counter.logined);

  return <Container>{logined ? <LoginedMainPage /> : <p>not logined</p>}</Container>;
}

export default MainPage;
