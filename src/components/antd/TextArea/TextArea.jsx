import React from "react";
import { Form } from "antd";
import "./TextArea.scss";
import TextArea from "antd/lib/input/TextArea";

const $T = ({ name, label, value, error, handleChange }) => {
  const handleInputChange = (e) => {
    handleChange(e.currentTarget.name, e.currentTarget.value);
  };
  const loadInput = () => {
    return (
      <>
        <TextArea name={name} value={value} onChange={handleInputChange} />
        <p>{error}</p>
      </>
    );
  };

  return (
    <Form.Item label={label} name={name} colon={false}>
      {loadInput()}
    </Form.Item>
  );
};

export const $TextArea = $T;
