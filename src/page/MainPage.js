import React from "react";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";

function MainPage() {
  const logined = useSelector((state) => state.counter.logined);

  return <Container>{logined ? <p>logined</p> : <p>not logined</p>}</Container>;
}

export default MainPage;
