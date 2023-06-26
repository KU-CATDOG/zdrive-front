import ProjectListView from "components/ProjectListView";
import { filter } from "lodash";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getCurrentPeriod } from "utils/functions";

function LoginedMainPage() {
  const studentNumber = useSelector((state) => state.counter.studentNumber);

  return (
    <Row className="mt-4">
      <Col md={6} className="p-2">
        <div className="p-2" style={{ border: "1px solid lightgray" }}>
          <h4 className="text-center">이번 분기의 프로젝트</h4>
          <hr />
          <ProjectListView fetchUrl={`/project/list?period=${getCurrentPeriod()}`} />
        </div>
      </Col>
      <Col md={6} className="p-2">
        <div className="p-2" style={{ border: "1px solid lightgray" }}>
          <h4 className="text-center">내가 소속된 프로젝트</h4>
          <hr />
          <ProjectListView fetchUrl={`/user/project/${studentNumber}`} />
        </div>
      </Col>
    </Row>
  );
}

function UnauthMainPage() {
  return (
    <>
      <Row className="mt-4">
        <Col>
          <h2 className="text-center">
            <b>캣독의 개발 프로젝트를 한눈에!</b>
          </h2>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={{ offset: 2, span: 8 }} className="p-2">
          <div className="p-2" style={{ border: "1px solid lightgray" }}>
            <h4 className="text-center">이번 분기의 프로젝트</h4>
            <hr />
            <ProjectListView fetchUrl={`/project/list?period=${getCurrentPeriod()}`} useCutout />
          </div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={{ offset: 2, span: 8 }} className="p-2">
          <div className="p-2" style={{ border: "1px solid lightgray" }}>
            <h4 className="text-center">진행중인 전체 프로젝트</h4>
            <hr />
            <ProjectListView
              fetchUrl="/project/list"
              listProcessing={(prjList) => {
                return filter(prjList, (prj) => prj.status === 1);
              }}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

function MainPage() {
  const logined = useSelector((state) => state.counter.logined);

  return <Container>{logined ? <LoginedMainPage /> : <UnauthMainPage />}</Container>;
}

export default MainPage;
