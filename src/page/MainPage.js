import ProjectListView from "components/ProjectListView";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

function LoginedMainPage() {
  return (
    <Row className="mt-4">
      <Col md={6} className="p-2">
        <div className="p-2" style={{ border: "1px solid lightgray" }}>
          <h4 className="text-center">이번 분기의 프로젝트</h4>
          <hr />
          <ProjectListView fetchUrl="/project/list?period=2023-1" />
        </div>
      </Col>
      <Col md={6} className="p-2">
        <div className="p-2" style={{ border: "1px solid lightgray" }}>
          <h4 className="text-center">내 프로젝트</h4>
          <hr />
          <ProjectListView fetchUrl="/project/list?period=2022-2" />
        </div>
      </Col>
    </Row>
  );
}

function UnauthMainPage() {
  return <p>not logined</p>;
}

function MainPage() {
  const logined = useSelector((state) => state.counter.logined);

  return <Container>{logined ? <LoginedMainPage /> : <UnauthMainPage />}</Container>;
}

export default MainPage;
