import React from "react";
import "./FormTitle.scss";

const $FormTitle = ({name}) => {
  return (
    <div className="form-title">
   <h3>{name}</h3>
  </div>
  );
};

export default $FormTitle;
