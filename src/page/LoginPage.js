import { Button, Form, Container, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { fetchPost, fetchTest } from "utils/functions";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes/paths";

function LoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({});

  // register modal
  const [showRegister, setRegister] = useState(false);
  const [registerForm, setRegisterData] = useState({});

  function handleFormValueChange(e) {
    setLoginData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleRegisterFormValue(e) {
    setRegisterData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    fetchPost("/auth/login", loginData)
      .then((res) => {
        if (!res.ok) {
          switch (res.status) {
            case 400:
              throw new Error("학번과 비밀번호를 모두 입력해주세요");
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
        navigate(-1);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  function handleRegisterFormSubmit(e) {
    e.preventDefault();

    if (registerForm.Password !== registerForm.PasswordCheck) {
      alert("비밀번호와 비밀번호 확인이 다릅니다");
      return;
    }

    fetchPost("/auth/register", registerForm)
      .then((res) => {
        if (!res.ok) {
          switch (res.status) {
            case 409:
              throw new Error("이미 학번이 존재합니다");
            default:
              throw new Error("미확인 오류입니다. 관리자에게 문의해주세요");
          }
        }
        return res.json();
      })
      .then((registerData) => {
        console.log(registerData);
        alert("회원가입이 완료되었습니다");
        setRegister(false);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <>
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

          <Button onClick={() => setRegister(true)}>회원가입</Button>
          <Button type="submit" onClick={handleFormSubmit}>
            로그인
          </Button>
        </Form>
      </Container>

      {
        // #region register modal
      }
      <Modal show={showRegister} onHide={() => setRegister(false)}>
        <Modal.Header closeButton>회원가입</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>학번</Form.Label>
              <Form.Control placeholder="ex) 2023320XXX" name="StudentNumber" onChange={handleRegisterFormValue} />
            </Form.Group>

            <Form.Group>
              <Form.Label>비밀번호</Form.Label>
              <Form.Control type="password" name="Password" onChange={handleRegisterFormValue} />
            </Form.Group>

            <Form.Group>
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control type="password" name="PasswordCheck" onChange={handleRegisterFormValue} />
            </Form.Group>

            <Form.Group>
              <Form.Label>이름</Form.Label>
              <Form.Control name="Name" onChange={handleRegisterFormValue} />
            </Form.Group>

            <hr />
            <Button type="submit" onClick={handleRegisterFormSubmit}>
              회원가입
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {
        // #endregion
      }
    </>
  );
}

export default LoginPage;
