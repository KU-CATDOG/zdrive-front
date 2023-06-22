/* eslint-disable no-bitwise */
import { concat, filter, find, findIndex, isEmpty, map, sortBy } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Form, Spinner, Stack, Table } from "react-bootstrap";
import { getMemberRoleString, memberRoleKrFlag } from "utils/enums";
import { fetchDelete, fetchGet, fetchPost, fetchPut } from "utils/functions";

function MemberManagement({
  projectId,
  baseMemberList = [],
  onSubmit = (members) => {
    members.toString();
  },
}) {
  const [memberForms, setMemberForms] = useState([]);
  const [removedMembers, setRemovedMembers] = useState([]);

  const [studentSearchKey, setStudentSearchKey] = useState("");
  const [searchedStudent, setSearchedStudent] = useState({});

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setMemberForms(
      sortBy(
        map(baseMemberList, (member) => {
          return { ...member, name: member.studentNum?.name, isDirty: false, isNew: false };
        }),
        "index",
      ),
    );
  }, []);

  function handleFormValueChange(index, key, value) {
    const toChange = { ...memberForms[index], [key]: value, isDirty: true };
    const targetArr = [...memberForms];
    targetArr[index] = toChange;
    setMemberForms(targetArr);
  }

  function exchangeIndex(callerIndex, targetIndex) {
    const caller = memberForms[callerIndex];
    const target = memberForms[targetIndex];
    caller.index = targetIndex;
    caller.isDirty = true;
    target.index = callerIndex;
    target.isDirty = true;

    const targetArr = [...memberForms];
    targetArr[callerIndex] = target;
    targetArr[targetIndex] = caller;
    setMemberForms(targetArr);
  }

  async function handleSubmitForm(e) {
    e.preventDefault();
    if (isFetching) return;
    setIsFetching(true);

    // send DELETE on removed members
    const delResArr = await Promise.all(
      map(
        filter(removedMembers, (member) => !member.isNew && typeof member.id === "number"),
        async (member) => {
          await fetchDelete(`/project/member/${member.id}`).catch((err) => {
            console.error(err);
          });
        },
      ),
    );

    // send PUT on dirty members
    const putResArr = await Promise.all(
      map(
        filter(memberForms, (member) => member.isDirty && !member.isNew && typeof member.id === "number"),
        async (member) => {
          await fetchPut(`/project/member/${member.id}`, member).catch((err) => {
            console.error(err);
          });
        },
      ),
    );

    // send POST on new members
    const newMembers = filter(memberForms, (member) => member.isNew);
    let postRes = {
      ok: true,
      json() {
        return [];
      },
    };
    if (newMembers.length > 0) {
      postRes = await fetchPost(`/project/member/${projectId}`, newMembers).catch((err) => {
        console.error(err);
      });
    }

    // check submitted
    const resArr = concat(delResArr, putResArr, postRes);
    const filteredResArr = filter(resArr, (res) => !isEmpty(res) && !res?.ok);
    if (filteredResArr.length > 0) {
      console.log(filteredResArr);
      alert("한가지 이상의 작업에 오류가 발생했습니다");
      // TODO: 일단 적당히 넣음
      document.location.reload();
      return;
    }

    // after submit
    onSubmit(memberForms);
    const postedMembers = await postRes.json();
    setMemberForms((prev) =>
      map(prev, (member) => {
        const posted = find(postedMembers, { index: member.index }) ?? {};
        return { ...member, ...posted, isNew: false, isDirty: false };
      }),
    );
    setRemovedMembers([]);

    alert("저장되었습니다");
    setIsFetching(false);
  }

  function handleSearchStudent() {
    if (!studentSearchKey.length) return;

    fetchGet(`/num/${studentSearchKey}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) {
            setSearchedStudent({ isNew: true, name: "", studentNumber: studentSearchKey });
            return;
          }
          // TODO: 기타 예외처리
          throw new Error(res.statusText);
        }
        setSearchedStudent(await res.json());
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  async function addMember() {
    if (searchedStudent.isNew) {
      const res = await fetchPost("/num", searchedStudent);
      if (!res.ok) {
        return;
      }
    }

    if (findIndex(memberForms, (member) => member.studentNumber === searchedStudent.studentNumber) !== -1) {
      alert("이미 존재하는 멤버입니다");
      return;
    }

    const removedMemberIndex = findIndex(
      removedMembers,
      (member) => member.studentNumber === searchedStudent.studentNumber && typeof member.Id === "number",
    );
    if (removedMemberIndex !== -1) {
      // 이미 있던 유저를 삭제 후 다시 추가하려 하는 경우
      const memberData = removedMembers[removedMemberIndex];
      setMemberForms((prev) => {
        return prev.concat({
          projectId,
          id: memberData.id,
          index: prev.length,
          isDirty: true,
          name: searchedStudent.name,
          studentNumber: searchedStudent.studentNumber,
          role: 0,
          description: "",
        });
      });
      removedMembers.splice(removedMemberIndex, 1);
    } else {
      setMemberForms((prev) => {
        return prev.concat({
          projectId,
          index: prev.length,
          isNew: true,
          name: searchedStudent.name,
          studentNumber: searchedStudent.studentNumber,
          role: 0,
          description: "",
        });
      });
    }
    setSearchedStudent({});
    setStudentSearchKey("");
  }

  function removeMember(idx) {
    removedMembers.push(memberForms[idx]);
    console.log(removedMembers);
    const newArr = map(
      filter(memberForms, (member) => member.index !== idx),
      (member, index) => {
        return { ...member, index, isDirty: true };
      },
    );
    setMemberForms(newArr);
  }

  return typeof projectId === "number" ? (
    <span className="text-danger">Project Id를 찾을 수 없습니다</span>
  ) : (
    <>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>이름</th>
            <th>직군</th>
            <th>한마디</th>
            <th>조작</th>
          </tr>
        </thead>
        <tbody>
          {map(memberForms, (member) => (
            <tr key={member.studentNumber}>
              <td>{member.index}</td>
              <td>{member.name}</td>
              <td>
                <Dropdown autoClose="outside">
                  <Dropdown.Toggle size="sm" variant="success" id="dropdown-basic">
                    {getMemberRoleString(member.role)}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {map(memberRoleKrFlag, (role, index) => {
                      const roleFlag = 1 << index;
                      return (
                        <Dropdown.Item
                          key={role}
                          onClick={() => {
                            const roleContains = roleFlag & member.role;
                            const newRoleValue = roleContains ? member.role & ~roleFlag : member.role | roleFlag;
                            handleFormValueChange(member.index, "role", newRoleValue);
                            console.log(roleFlag);
                          }}
                        >
                          {roleFlag & member.role ? "O" : "X"} {role}
                        </Dropdown.Item>
                      );
                    })}
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>
                <Form.Control
                  size="sm"
                  name="description"
                  value={member.description}
                  onChange={(e) => handleFormValueChange(member.index, e.target.name, e.target.value)}
                />
              </td>
              <td>
                <Stack direction="horizontal" gap={1}>
                  <Button size="sm" disabled={member.index === 0} onClick={() => exchangeIndex(member.index, member.index - 1)}>
                    ⩚
                  </Button>
                  <Button
                    size="sm"
                    disabled={member.index === memberForms.length - 1}
                    onClick={() => exchangeIndex(member.index, member.index + 1)}
                  >
                    ⩛
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => removeMember(member.index)}>
                    X
                  </Button>
                </Stack>
              </td>
            </tr>
          ))}
          <tr>
            <td />
            <td colSpan={2}>
              <Form.Control
                placeholder="학번"
                value={studentSearchKey}
                onChange={(e) => {
                  setStudentSearchKey(e.target.value);
                  setSearchedStudent({});
                }}
              />
            </td>
            <td>
              <Form.Control
                disabled={!searchedStudent.isNew}
                placeholder={searchedStudent.isNew ? "이름 - 직접작성" : "이름"}
                value={searchedStudent.name ?? ""}
                onChange={(e) => {
                  setSearchedStudent((prev) => {
                    return { ...prev, name: e.target.value };
                  });
                }}
              />
            </td>
            <td>
              <Stack direction="horizontal" gap={1}>
                <Button disabled={!studentSearchKey.length} onClick={handleSearchStudent}>
                  검색
                </Button>
                <Button disabled={!searchedStudent.name?.length} onClick={addMember}>
                  +
                </Button>
              </Stack>
            </td>
          </tr>
        </tbody>
      </Table>
      {!memberForms.length && <p>멤버가 없습니다</p>}
      <Stack direction="horizontal" gap={3}>
        <div className="ms-auto" />
        <Form.Text>저장하지 않은 정보는 사라집니다</Form.Text>
        <Button disabled={isFetching} onClick={handleSubmitForm}>
          {isFetching ? <Spinner animation="border" size="sm" /> : "팀원 정보 저장"}
        </Button>
      </Stack>
    </>
  );
}

export default MemberManagement;
