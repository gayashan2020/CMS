import React from "react";
import "./Spin.scss";
import { Spin } from "antd";

const $Spin = () => {
  return (
    <div className="cls-loader-background">
      <div className="class-loading-item">
        <Spin size="large" />
      </div>
    </div>
  );
};

export default $Spin;
