import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PATHS } from "routes/paths";
import { fetchPost } from "utils/functions";

function ProjectAddPage() {
  const navigate = useNavigate();
  const [postingProcess, setPostingProcess] = useState(false);
  const [formData, setFormData] = useState({});

  function handleFormValueChange(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (postingProcess) return;
    setPostingProcess(true);

    // verification
    if (!formData.Name?.length) {
      setPostingProcess(false);
      return;
    }

    console.log(formData);

    fetchPost("/project", formData)
      .then((res) => {
        if (!res.ok) {
          switch (res.status) {
            case 401:
              navigate(PATHS.login);
              throw new Error("허용되지 않은 접근입니다. 우선 로그인해주세요");
            case 409:
              throw new Error("같은 이름의 게임(프로젝트)이 이미 존재합니다");
            default:
              throw new Error("미확인 오류입니다. 관리자에게 문의해주세요");
          }
        }
        alert("생성이 완료되었습니다");
        navigate(PATHS.project.list);
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setPostingProcess(false);
      });
  }

  return (
    <Container>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            게임명 (프로젝트명) <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control required name="Name" disabled={postingProcess} onChange={handleFormValueChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>시작일</Form.Label>
          <Form.Control name="StartDate" disabled={postingProcess} type="date" onChange={handleFormValueChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>장르</Form.Label>
          <Form.Control name="Genre" disabled={postingProcess} onChange={handleFormValueChange} />
        </Form.Group>
        <Form.Text>기타 정보는 저장 후 수정해 주시기 바랍니다</Form.Text>

        <div className="float-end">
          <Button type="submit" disabled={postingProcess}>
            저장
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default ProjectAddPage;
