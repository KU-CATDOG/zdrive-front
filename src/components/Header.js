import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { fetchGet } from "utils/functions";
import { PATHS } from "routes/paths";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "features/loginSlice";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logined = useSelector((state) => state.counter.logined);
  const studentNumber = useSelector((state) => state.counter.studentNumber);

  function handleLogin() {
    navigate(PATHS.login, {
      state: {
        prevRoute: location.pathname,
      },
    });
  }

  function handleLogout() {
    fetchGet("/auth/logout").finally(() => {
      dispatch(logout());
      navigate(PATHS.root);
    });
  }

  function checkUserLogined() {
    fetchGet("/auth/check").then(async (res) => {
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (!(contentType && contentType.indexOf("application/json") !== -1)) return;
        const userData = await res.json();
        dispatch(
          login({
            name: userData.name,
            studentNumber: userData.studentNumber,
            userId: userData.id,
          }),
        );
      } else if (res.status === 404) {
        fetchGet("/auth/logout");
      }
    });
  }

  useEffect(() => {
    checkUserLogined();
  }, []);

  return (
    <Navbar className="mb-2" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#m" onClick={() => navigate(PATHS.root)}>
          CATDOG Z-Drive
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#m" onClick={() => navigate(PATHS.root)}>
            메인
          </Nav.Link>
          <Nav.Link href="#p" onClick={() => navigate(PATHS.project.list)}>
            탐색
          </Nav.Link>
          <Nav.Link href="#a" onClick={() => navigate(PATHS.about)}>
            About Us
          </Nav.Link>
        </Nav>
        <Nav>
          <Navbar.Text className="me-3">{studentNumber}</Navbar.Text>
          {logined ? (
            <Button size="sm" variant="danger" onClick={handleLogout}>
              로그아웃
            </Button>
          ) : (
            <Button size="sm" variant="primary" onClick={handleLogin}>
              로그인
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
