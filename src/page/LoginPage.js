import { Button, Form, Container, Modal, Col, Row } from "react-bootstrap";
import React, { useState } from "react";
import { fetchPost } from "utils/functions";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "features/loginSlice";
import { get } from "lodash";
import { PATHS } from "routes/paths";

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const prevRoute = get(state, "prevRoute", PATHS.root);

  const [loginProgress, setLoginProgress] = useState(false);
  const [loginData, setLoginData] = useState({});

  // register modal
  const [registerProgress, setRegisterProgress] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
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
    if (loginProgress) return;
    setLoginProgress(true);

    fetchPost("/auth/login", loginData)
      .then(async (res) => {
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
        const userData = await res.json();
        dispatch(
          login({
            name: userData.name,
            studentNumber: userData.studentNumber,
            userId: userData.id,
          }),
        );
        // TODO: navigate to main page
        if (prevRoute === PATHS.login) navigate(PATHS.main);
        else navigate(prevRoute);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setLoginProgress(false);
      });
  }

  function handleRegisterFormSubmit(e) {
    e.preventDefault();
    if (registerProgress) return;
    setRegisterProgress(true);

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
        alert("회원가입이 완료되었습니다. 회원 승인은 회장단에게 문의해주세요");
        setShowRegister(false);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setRegisterProgress(false);
      });
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <h4 className="mt-4 text-center">
              <b>Welcome to CATDOG</b>
            </h4>
          </Col>
        </Row>
        <Row>
          <Col md={{ offset: 3, span: 6 }} className="mt-3" style={{ border: "1px solid lightgray" }}>
            <Form>
              <Form.Group className="mt-3">
                <Form.Label>학번</Form.Label>
                <Form.Control placeholder="ex) 2023320XXX" name="StudentNumber" onChange={handleFormValueChange} />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>PW</Form.Label>
                <Form.Control type="password" name="Password" onChange={handleFormValueChange} />
              </Form.Group>

              <div className="my-3 float-end">
                <Button className="ms-auto me-2" disabled={loginProgress} onClick={() => setShowRegister(true)}>
                  회원가입
                </Button>
                <Button type="submit" disabled={loginProgress} onClick={handleFormSubmit}>
                  로그인
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>

      {
        // #region register modal
      }
      <Modal
        show={showRegister}
        onHide={() => {
          if (registerProgress) return;
          setShowRegister(false);
        }}
      >
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

            <br />
            <Form.Text>회장단의 승인 후 사용(로그인 등)이 가능합니다.</Form.Text>
            <br />
            <Form.Text>회원가입 이후 문의해주세요.</Form.Text>
            <hr />
            <Button className="float-end" type="submit" disabled={registerProgress} onClick={handleRegisterFormSubmit}>
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
