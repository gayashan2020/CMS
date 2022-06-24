import React, { Component } from "react";
import "./Register.scss";
import Joi from "joi";
import {
  $Form,
  $Spin,
  $Row,
  $Col,
  $Input,
  $Button,
  $Card,
  $Message,
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
import {
  auth,
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../config/firebase";
import { Row, Col, Button } from "antd";

const schema = Joi.object({
  //regex fo NIC, name, mobile
  email: Joi.string()
    .regex(
      /^((?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$)|(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .required()
    .label("Email")
    .messages({
      "string.pattern.base": "Enter a valid Email.",
    }),
  userName: Joi.string().required().label("User Name").messages({
    "string.pattern.base": "Enter a valid User Name.",
  }),
  password: Joi.string()
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[@$!%*#?&])|(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    )
    .required()
    .label("Password")
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, at least one letter and one number.",
    }),
  rePassword: Joi.string()
    .equal(Joi.ref("password"))
    .label("Confirm Password")
    .messages({ "any.only": "Passwords does not match." })
    .required(),
});

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        email: "",
        userName: "",
        password: "",
        rePassword: "",
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

    try {
      //send user ID & password and get tokens
      await registerWithEmailAndPassword(
        form.userName,
        form.email,
        form.password
      );
      // console.log(data);
      // this.resetFields();

      // //execute login function in AuthContext.js
      // //await this.context.logIn(data, this.props);
      // removeAccessToken();
      // removeUser();
      // setAccessToken(data.token);
      // setUser(JSON.stringify(data.details));

      // //stop loading
      this.setState({ loading: false });
      this.props.history.push(RoutesConstant.login);
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
                              <span className="sub">Learning Management </span>
                              System
                            </h3>
                          </div>
                          <div>
                            <h3 className="sign-in">Sign Up</h3>
                          </div>
                          <$Form onSubmit={this.submit}>
                            <div className="login-input-un">
                              <$Input
                                name="userName"
                                autoFocus
                                label="User Name"
                                handleChange={this.onHandleChange}
                                value={form.userName}
                                error={errors.userName}
                              />
                            </div>
                            <div className="login-input-un">
                              <$Input
                                name="email"
                                autoFocus
                                label="Email"
                                handleChange={this.onHandleChange}
                                value={form.email}
                                error={errors.email}
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
                            <div className="login-input-pwd">
                              <$Input
                                name="rePassword"
                                type="password"
                                label="Re Type Password"
                                handleChange={this.onHandleChange}
                                value={form.rePassword}
                                error={errors.rePassword}
                              />
                            </div>
                            <div className="log-btn-wrapper">
                              <$Button
                                className="sign-in-btn"
                                type="primary"
                                onClick={this.submit}
                              >
                                Sign Up
                              </$Button>
                            </div>
                            <div>
                              <Link className="forget-pwd" to="/login">
                                Log In
                              </Link>
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

export default Register;
