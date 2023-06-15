import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { fetchGet } from "utils/functions";
import { PATHS } from "routes/paths";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "features/loginSlice";

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

  return (
    <Navbar className="mb-2" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#" onClick={() => navigate(PATHS.root)}>
          CATDOG Z-Drive
        </Navbar.Brand>
        <Nav className="me-auto" />
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
