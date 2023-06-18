import React, { useEffect, useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes/paths";
import { fetchGet } from "utils/functions";
import { map } from "lodash";
import { projectStatusKrEnum } from "utils/enums";

function ProjectListPage() {
  const navigate = useNavigate();
  const [currentList, setCurrentList] = useState([]);

  function getProjectList() {
    fetchGet("/project/list")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCurrentList(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  useEffect(() => {
    getProjectList();
  }, []);

  return (
    <Container>
      <p>ProjectListPage</p>
      <Button onClick={() => navigate(PATHS.project.add)}>to Project Add</Button>
      <Button className="ms-3" onClick={() => getProjectList()}>
        get Project List
      </Button>
      <Container className="my-3" />
      <Table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>이름</th>
            <th>장르</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {map(currentList, (project, idx) => (
            <tr key={idx} onClick={() => navigate(`${PATHS.project.detail}/${project.id}`)}>
              <td>{idx + 1}</td>
              <td>{project.name}</td>
              <td>{project.genre}</td>
              <td>{projectStatusKrEnum[project.status]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ProjectListPage;
