import React, { useEffect, useState } from "react";
import { fetchGet } from "utils/functions";

function ImageView(props) {
  const { url } = props;
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (url === undefined || url === null) {
      setImageUrl("");
      return;
    }
    if (typeof url === "string" && url.length === 0) {
      setImageUrl("");
      return;
    }

    // TODO: 이부분 대충 되게만 해둔거라 어떻게 될질 모름
    fetchGet(`/${url}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.blob();
      })
      .then((imgBlob) => {
        const imageObjectURL = URL.createObjectURL(imgBlob);
        setImageUrl(imageObjectURL);
      })
      .catch((err) => {
        console.error(err.message);
      });

    // eslint-disable-next-line consistent-return
    return () => {
      // use for clean up
      window.URL.revokeObjectURL(imageUrl);
    };
  }, [url]);

  return imageUrl.length === 0 ? <p>이미지 없음</p> : <img width="100%" {...props} src={imageUrl} alt={url} />;
}

export default ImageView;
