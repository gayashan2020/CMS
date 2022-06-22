import React from "react";
import "./Tag.scss";
import { Tag } from "antd";

const $Tag = ({ tag, isPO = false }) => {
  let colorSplit = tag.split(" ");
  const color = (s, v) => {
    if (v === "Revoked") {
      return "volcano";
    } else if (v === "PO Issued" && isPO == true) {
      return "blue";
    } else {
      switch (s) {
        case "Rejected":
          return "volcano";

        case "Pending":
          return "blue";

        case "Use":
          return "blue";

        default:
          return "green";
      }
    }
  };
  // let color =
  //   colorSplit[colorSplit.length - 1] === "Rejected" ? "volcano" : "green";
  return (
    <>
      <Tag color={color(colorSplit[colorSplit.length - 1], tag)} key={tag}>
        {tag}
      </Tag>
    </>
  );
};

export default $Tag;
