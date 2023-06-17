import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";

function LoginedMainPage() {
  return <p>logined</p>;
}

function MainPage() {
  const logined = useSelector((state) => state.counter.logined);

  return <Container>{logined ? <LoginedMainPage /> : <p>not logined</p>}</Container>;
}

export default MainPage;
