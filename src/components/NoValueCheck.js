import { isEmpty } from "lodash";
import React from "react";

function NoValueCheck({ children, altText = "미작성" }) {
  return isEmpty(children) ? <span style={{ color: "lightgray" }}>{altText}</span> : children;
}

export default NoValueCheck;
