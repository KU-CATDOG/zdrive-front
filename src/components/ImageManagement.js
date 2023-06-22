import { concat, filter, find, isEmpty, map, sortBy } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner, Stack, Table } from "react-bootstrap";
import { fetchDelete, fetchPost, fetchPut } from "utils/functions";
import ImageView from "./ImageView";

function ImageManagement({
  projectId,
  baseImageList = [],
  onSubmit = (images) => {
    images.toString();
  },
}) {
  const [imageForms, setImageForms] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const [fileToUpload, setFileToUpload] = useState([]);

  const [showPreview, setShowPreview] = useState("");

  useEffect(() => {
    setImageForms(
      sortBy(
        map(baseImageList, (image) => {
          return { ...image, isDirty: false, isNew: false };
        }),
        "index",
      ),
    );
  }, []);

  /**
   * 1. /image/upload 로 이미지 업로드 -> 200시 이미지의 고유주소를 받음 (filePath)
   * 2. { imageSrc, projectId, index } 를 채워서
   * 3. 저장 (isNew면 POST, isDirty면 PUT)
   */

  function exchangeIndex(callerIndex, targetIndex) {
    const caller = imageForms[callerIndex];
    const target = imageForms[targetIndex];
    caller.index = targetIndex;
    caller.isDirty = true;
    target.index = callerIndex;
    target.isDirty = true;

    const targetArr = [...imageForms];
    targetArr[callerIndex] = target;
    targetArr[targetIndex] = caller;
    setImageForms(targetArr);
  }

  async function handleSubmitForm(e) {
    e.preventDefault();
    if (isFetching) return;
    setIsFetching(true);

    // send DELETE on removed images
    const delResArr = await Promise.all(
      map(
        filter(removedImages, (image) => !image.isNew && !isEmpty(image.imageSrc)),
        async (image) => {
          await fetchDelete(`/project/image/${image.imageSrc}`).catch((err) => {
            console.error(err);
          });
        },
      ),
    );

    // send PUT on dirty images
    const putResArr = await Promise.all(
      map(
        filter(imageForms, (image) => image.isDirty && !image.isNew && !isEmpty(image.imageSrc)),
        async (image) => {
          await fetchPut(`/project/image/${image.imageSrc}`, image).catch((err) => {
            console.error(err);
          });
        },
      ),
    );

    // send POST on new images
    const newImages = filter(imageForms, (image) => image.isNew);
    let postRes = {
      ok: true,
      json() {
        return [];
      },
    };
    if (newImages.length > 0) {
      postRes = await fetchPost(`/project/image/${projectId}`, newImages).catch((err) => {
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
    onSubmit(imageForms);
    const editedProject = await postRes.json();
    const postedImages = editedProject.images ?? [];
    setImageForms((prev) =>
      map(prev, (member) => {
        const posted = find(postedImages, { index: member.index }) ?? {};
        return { ...member, ...posted, isNew: false, isDirty: false };
      }),
    );
    setRemovedImages([]);

    alert("저장되었습니다");
    setIsFetching(false);
  }

  function addImage(imageSrc) {
    setImageForms((prev) => {
      return prev.concat({
        projectId,
        index: prev.length,
        isNew: true,
        imageSrc,
      });
    });
  }

  function removeImage(idx) {
    removedImages.push(imageForms[idx]);
    const newArr = map(
      filter(imageForms, (image) => image.index !== idx),
      (image, index) => {
        return { ...image, index, isDirty: true };
      },
    );
    setImageForms(newArr);
  }

  return typeof projectId === "number" ? (
    <span className="text-danger">Project Id를 찾을 수 없습니다</span>
  ) : (
    <>
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>파일명</th>
            <th>미리보기</th>
            <th>조작</th>
          </tr>
        </thead>
        <tbody>
          {map(imageForms, (image) => (
            <tr key={image.imageSrc}>
              <td>{image.index}</td>
              <td>{image.imageSrc}</td>
              <td>
                <Button
                  onClick={() => {
                    setShowPreview(image.imageSrc?.slice(1, -1));
                  }}
                >
                  미리보기
                </Button>
              </td>
              <td>
                <Stack direction="horizontal" gap={1}>
                  <Button size="sm" disabled={image.index === 0} onClick={() => exchangeIndex(image.index, image.index - 1)}>
                    ⩚
                  </Button>
                  <Button
                    size="sm"
                    disabled={image.index === imageForms.length - 1}
                    onClick={() => exchangeIndex(image.index, image.index + 1)}
                  >
                    ⩛
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => removeImage(image.index)}>
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
                id="image-upload"
                type="file"
                accept="image/*"
                placeholder="이미지"
                files={fileToUpload}
                onChange={(e) => {
                  setFileToUpload(e.target.files);
                }}
              />
            </td>
            <td>
              <Button
                disabled={!fileToUpload.length || isFetching}
                onClick={() => {
                  if (fileToUpload.length === 0) {
                    alert("파일을 먼저 첨부해주세요");
                    return;
                  }

                  setIsFetching(true);

                  const formData = new FormData();
                  formData.append("file", fileToUpload[0]);

                  fetchPost("/image/upload", formData, {}, true)
                    .then(async (res) => {
                      if (!res.ok) {
                        const errMsg = await res.text();
                        setFileToUpload([]);
                        const imageInner = document.getElementById("image-upload");
                        if (!isEmpty(imageInner)) {
                          imageInner.value = null;
                        }
                        console.error(errMsg);
                        throw new Error(errMsg);
                      }

                      const imagePath = await res.text();
                      addImage(imagePath);
                    })
                    .catch((err) => {
                      alert(err.message);
                    })
                    .finally(() => {
                      setIsFetching(false);
                    });
                }}
              >
                +
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
      {!imageForms.length && <p>이미지가 없습니다</p>}
      <Stack direction="horizontal" gap={3}>
        <div className="ms-auto" />
        <Form.Text>저장하지 않은 정보는 사라집니다</Form.Text>
        <Button disabled={isFetching} onClick={handleSubmitForm}>
          {isFetching ? <Spinner animation="border" size="sm" /> : "이미지 정보 저장"}
        </Button>
      </Stack>

      <Modal
        size="lg"
        centered
        show={showPreview.length > 0}
        onHide={() => {
          setShowPreview("");
        }}
      >
        <Modal.Header closeButton>{showPreview}</Modal.Header>
        <Modal.Body>
          <ImageView url={showPreview} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageManagement;
