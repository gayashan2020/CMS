import React, { Component } from "react";
import "./Login.scss";
import Joi from "joi";
import {
  $Form,
  $Spin,
  $Row,
  $Col,
  $Input,
  $Button,
  $Card,
} from "../../components/antd";
import { Link } from "react-router-dom";
import { User } from "../../services";
import {
  setAccessToken,
  setUser,
  getAccessToken,
  getUser,
  removeAccessToken,
  removeUser,
} from "../../config/LocalStorage";
import { RoutesConstant } from "../../assets/constants";

import { Row, Col, Button } from "antd";

const schema = Joi.object({
  //regex fo NIC, name, mobile
  userName: Joi.string()
    .regex(
      /^((?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$)|(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required()
    .label("Email/ User Name")
    .messages({
      "string.pattern.base": "Enter a valid Email or User Name.",
    }),
  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[@$!%*#?&])|(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required()
    .label("Password")
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, at least one letter and one number.",
    }),
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        userName: "",
        password: "",
      },
      errors: {},
      loading: false,
    };
  }

  validate = () => {
    // console.log('clicked');
    const option = {
      abortEarly: false,
    };
    const { errors } = this.state;
    const { error } = schema.validate(this.state.form, option);

    if (!error) return null;
    for (let item of error.details) {
      if (!errors[item.path[0]]) {
        errors[item.path[0]] = item.message;
      }
    }

    this.setState({ errors });

    return errors;
  };
  validateProperty = (name, value) => {
    const option = {
      abortEarly: false,
    };

    const { form, errors } = this.state;
    form[name] = value;
    const { error } = schema.validate(form, option);

    errors[name] = null;
    if (error) {
      for (let item of error.details) {
        if (item.path[0] === name) {
          errors[name] = item.message;
        }
      }
    }
    console.log(errors);
    this.setState({ errors });
  };
  //update value to form in set state
  onHandleChange = (name, value) => {
    this.validateProperty(name, value);
    const form = { ...this.state.form };
    form[name] = value;
    this.setState({ form });
  };

  resetFields = () => {
    const { form } = this.state;

    form.userName = "";
    form.password = "";

    this.setState({ form });
  };

  submit = async () => {
    if (this.validate()) {
      //if schema incorrect print errors
      this.setState(this.state.errors);
      return;
    }
    //start loading
    this.setState({ loading: true });

    const form = { ...this.state.form };

    let dataObj = {
      userName: form.userName,
      password: form.password,
    };

    try {
      //send user ID & password and get tokens
      // let data = await User.login(dataObj);
      // this.resetFields();

      // //execute login function in AuthContext.js
      // //await this.context.logIn(data, this.props);
      // removeAccessToken();
      // removeUser();
      // setAccessToken(data.token);
      // setUser(JSON.stringify(data.details));

      // //stop loading
      // this.setState({ loading: false });
      this.props.history.push(RoutesConstant.dashboard);
      return;

    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };

  render() {
    const { form, errors, loading } = this.state;
    return (
      <>
        {loading && <$Spin />}
        <$Row className="">
          <$Col xl={24}>
            <div className="login-bg">
              <div className="login-form-wrapper">
                <$Row className="center-rows login-row">
                  <div className="">
                    <$Card className="log-card">
                      <$Col span={24}>
                        <div className="login-form">
                          <div>
                            <h3 className="sigin-title">
                              <span className="sub">Learning Management </span>System
                            </h3>
                          </div>
                          <div>
                            <h3 className="sign-in">Log In</h3>
                          </div>
                          <$Form onSubmit={this.submit}>
                            <div className="login-input-un">
                            <$Input
                            name="userName"
                            autoFocus
                            label="Email/ User Name"
                            handleChange={this.onHandleChange}
                            value={form.userName}
                            error={errors.userName}
                          />
                            </div>
                            <div className="login-input-pwd">
                              <$Input
                                name="password"
                                type="password"
                                label="Password"
                                handleChange={this.onHandleChange}
                                value={form.password}
                                error={errors.password}
                              />
                            </div>
                            <div className="log-btn-wrapper">
                              <$Button
                                className="sign-in-btn"
                                type="primary"
                               onClick={this.submit}
                              >
                                Log in
                              </$Button>
                            </div>
                          </$Form>
                        </div>
                      </$Col>
                    </$Card>
                  </div>
                </$Row>
              </div>
            </div>
          </$Col>
        </$Row>
      </>
    );
  }
}

export default Login;
