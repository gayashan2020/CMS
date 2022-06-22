import React from "react";
import "./DatePicker.scss";
import { Form, DatePicker, Space } from "antd";
import moment from "moment";

const $DatePicker = ({
  name,
  label,
  value,
  date,
  dateString,
  error,
  handleChange,
  disabled,
  format,
}) => {
  const handleSelectChange = (selectedItems) => {
    handleChange(name, selectedItems);
  };
  return (
    <>
      <Form.Item name={name} label={label}>
        <>
          <DatePicker
            value={value}
            defaultValue={moment("03/16/2022")}
            style={{ width: "100%" }}
            name={name}
            onChange={handleSelectChange}
            disabled={disabled}
            format={format}
          />
          <p>{error}</p>
        </>
      </Form.Item>
    </>
  );
};

export default $DatePicker;
