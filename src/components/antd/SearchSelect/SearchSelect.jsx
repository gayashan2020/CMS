import React from "react";
import "./SearchSelect.scss";
import { Form, Select } from "antd";

const $SearchSelect = ({
  name,
  label,
  value,
  optionLabel,
  optionValue,
  options,
  error,
  handleChange,
}) => {
  const handleSelectChange = (selectedItems) => {
    handleChange(name, selectedItems);
  };
  return (
    <>
      <Form.Item name={name} label={label}>
        <>
          <Select
            showSearch
            value={value}
            style={{ width: "100%" }}
            name={name}
            placeholder="Search to Select"
            optionFilterProp="children"
            onChange={handleSelectChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            filterSort={(optionA, optionB) =>
              optionA.children
                .toLowerCase()
                .localeCompare(optionB.children.toLowerCase())
            }
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

export default $SearchSelect;
