import { Input, Form } from "antd";
// import { useField } from "formik";
// import * as Utility from "../utility";
import "./Input.scss";

const $I = ({ type, name, label, value, error, handleChange, placeholder }) => {
  // console.log(props);
  // const { name, required, label, handleChange } = props;
  // const [field, meta, helpers] = useField(name);
  // const error = meta?.error;
  // const isTouched = meta?.touched;

  const handleInputChange = (e) => {
    handleChange(e.currentTarget.name, e.currentTarget.value);
  };
  const loadInput = () => {
    switch (type) {
      case "password":
        return (
          <>
            <Input.Password
              name={name}
              value={value}
              onChange={handleInputChange}
            />
            <p>{error}</p>
          </>
        );

      default:
        return (
          <>
            <Input name={name} value={value} onChange={handleInputChange} placeholder={placeholder}/>
            <p>{error}</p>
          </>
        );
    }
  };

  return (
    <Form.Item
      label={label}
      name={name}
      // help={isTouched && error}
      // validateStatus={Utility.validateStatus(error, isTouched)}
      // required={typeof required == "undefined" ? false : true}
      colon={false}
    >
      {loadInput()}
    </Form.Item>
  );
};

export const $Input = $I;
