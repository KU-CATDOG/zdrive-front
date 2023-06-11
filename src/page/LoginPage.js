import { Button, Form, Container } from "react-bootstrap";
import React, { useState } from "react";
import { fetchPost } from "utils/functions";
import { useNavigate } from "react-router-dom";

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

    if (process.env.REACT_APP_MODE === "D") {
      sessionStorage.setItem("studentNumber", loginData.StudentNumber);
      // document.location.href = "/zdrive/main";
      navigate('/zdrive/main');
      return;
    }

    fetchPost("/auth/login", loginData)
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        // success login action
        sessionStorage.setItem("studentNumber", loginData.StudentNumber);
        // TODO: navigate to main page
        // document.location.href = "/zdrive/main";
        navigate('/zdrive/main');
      })
      .catch((err) => {
        switch (err) {
          case 403:
            alert("인증되지 않았습니다. 회장단에게 문의해주세요");
            break;
          case 404:
            alert("로그인에 실패했습니다");
            break;
          default:
            alert("미확인 오류입니다. 관리자에게 문의해주세요");
        }
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
