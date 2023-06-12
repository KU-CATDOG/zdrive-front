import { Button, Form, Container } from "react-bootstrap";
import React, { useState } from "react";
import { fetchPost, fetchTest } from "utils/functions";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes/paths";

function LoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({});

  function handleFormValueChange(e) {
    setLoginData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    fetchPost("/auth/login", loginData)
      .then((res) => {
        if (!res.ok) {
          switch (res.status) {
            case 403:
              throw new Error("인증되지 않았습니다. 회장단에게 문의해주세요");
            case 404:
              throw new Error("로그인에 실패했습니다");
            default:
              throw new Error("미확인 오류입니다. 관리자에게 문의해주세요");
          }
        }
        // success login action
        sessionStorage.setItem("studentNumber", loginData.StudentNumber);
        // TODO: navigate to main page
        navigate(PATHS.main);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <Container>
      <Form>
        <Form.Group>
          <Form.Label>학번</Form.Label>
          <Form.Control placeholder="ex) 2023320XXX" name="StudentNumber" onChange={handleFormValueChange} />
        </Form.Group>

        <Form.Group>
          <Form.Label>PW</Form.Label>
          <Form.Control type="password" name="Password" onChange={handleFormValueChange} />
        </Form.Group>

        <Button onClick={handleFormSubmit}>로그인</Button>
      </Form>
    </Container>
  );
}

export default LoginPage;
