import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

function MainPage() {
  const [logined, setLogined] = useState(false);

  useEffect(() => {
    setLogined(sessionStorage.getItem("studentNumber") !== null);
  });

  return <Container>{logined ? <p>logined</p> : <p>not logined</p>}</Container>;
}

export default MainPage;
