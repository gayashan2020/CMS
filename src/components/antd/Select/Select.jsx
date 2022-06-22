import React from "react";
import "./Select.scss";
import { Form, Select } from "antd";

const $Select = ({
  name,
  label,
  value,
  optionLabel,
  optionValue,
  options,
  error,
  handleChange,
  disabled,
  listHeight,
}) => {
  const handleSelectChange = (selectedItems) => {
    handleChange(name, selectedItems);
  };
  return (
    <>
      <Form.Item name={name} label={label}>
        <>
          <Select
            value={value}
            style={{ width: "100%" }}
            name={name}
            onChange={handleSelectChange}
            disabled={disabled}
            listHeight={listHeight}
           
          >
            {/* <Select.Option key="a" value="">
              ""
            </Select.Option> */}
            {options.map((prop, index) => (
              <Select.Option key={index} value={prop[optionValue]}>
                {prop[optionLabel]}
              </Select.Option>
            ))}
          </Select>
          <p>{error}</p>
        </>
      </Form.Item>
    </>
  );
};

export default $Select;
