import React from "react";
import "./FormHeader.scss";

const $FormHeader = ({name}) => {
  return (
    <div className="form-title form-header">
      <h3>{name}</h3>
    </div>
  );
};

export default $FormHeader;
