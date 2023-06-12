import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { fetchGet } from "utils/functions";
import { PATHS } from "routes/paths";

function Header() {
  const navigate = useNavigate();
  const [logined, setLogined] = useState(false);

  useEffect(() => {
    setLogined(!!sessionStorage.getItem("studentNumber"));
    console.log("hi");
  });

  function handleLogout() {
    fetchGet("/auth/logout").finally(() => {
      sessionStorage.clear();
      navigate(PATHS.root);
    });
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>CATDOG Z-Drive</Navbar.Brand>
        <Nav className="me-auto" />
        <Nav>
          <Navbar.Text className="me-3">{sessionStorage.getItem("studentNumber")}</Navbar.Text>
          {logined && (
            <Button size="sm" variant="danger" onClick={handleLogout}>
              로그아웃
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
