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
  $Select,
} from "../../components/antd";
import { Link } from "react-router-dom";
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
  getFirestore,
  query,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  where,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { Row, Col, Button, Select } from "antd";
import { db } from "../../config/firebase";
import selectConstants from "../../assets/constants/selectConstants";
const { Option } = Select;
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
  firstName: Joi.string().required().label("First Name").messages({
    "string.pattern.base": "Enter a valid User Name.",
  }),
  lastName: Joi.string().required().label("Last Name").messages({
    "string.pattern.base": "Enter a valid User Name.",
  }),
  role: Joi.string().required().label("Role").messages({
    "string.pattern.base": "Select a role.",
  }),
  nic: Joi.string().required().label("NIC").messages({
    "string.pattern.base": "Enter a valid NIC number.",
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
        firstName: "",
        lastName: "",
        password: "",
        rePassword: "",
        role: "",
        nic: "",
      },
      users: [],
      newCid: "",
      errors: {},
      loading: false,
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    try {
      const q = query(collection(db, "users"));

      const querySnapshot = await getDocs(q);
      const Row = [];
      querySnapshot.forEach((doc) => {
        Row.push(doc.data());
      });
      this.setState({
        users: Row,
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      $Message.error(err.message);
    }
    this.setState({ loading: false });
    let cidCount = [];
    if (this.state.users) {
      this.state.users.forEach((element) => {
        let val = parseInt(element.uid.split("u")[1]);
        cidCount.push(val);
      });
    }

    let maxVal = Math.max(...cidCount) + 1;
    this.setState({
      newCid: "u" + maxVal,
    });
  };

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
    let uid = this.state.newCid;
    let val = {
      uid: uid,
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password,
      status: "pending",
      role: form.role,
      nic: form.nic,
      email: form.email,
    };

    try {
      await setDoc(doc(db, "users", uid), val);
      $Message.success("Successfully Registered");
      this.setState({ loading: false });
      this.props.history.push(RoutesConstant.login);
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      $Message.error("Error in registration");
    }
    this.setState({ loading: false });
  };

  render() {
    const { form, errors, loading } = this.state;
    return (
      <>
        {loading && <$Spin />}
        <$Row className="">
          <$Col xl={24}>
            <div>
              <div className="login-form-wrapper">
                <$Row className="center-rows login-row">
                  <$Col span={12} className="login-bg"></$Col>
                  <$Col span={12}>
                    <div className="card-margin">
                      <$Card className="log-card">
                        <$Col span={24}>
                          <div className="login-form">
                            <div>
                              <h3 className="sigin-title">
                                <span className="sub">
                                  Learning Management{" "}
                                </span>
                                System
                              </h3>
                            </div>
                            <div>
                              <h3 className="sign-in">Sign Up</h3>
                            </div>
                            <$Form onSubmit={this.submit}>
                              <div className="login-input-un">
                                <$Input
                                  name="firstName"
                                  autoFocus
                                  label="First Name"
                                  handleChange={this.onHandleChange}
                                  value={form.firstName}
                                  error={errors.firstName}
                                />
                              </div>
                              <div className="login-input-un">
                                <$Input
                                  name="lastName"
                                  autoFocus
                                  label="Last Name"
                                  handleChange={this.onHandleChange}
                                  value={form.lastName}
                                  error={errors.lastName}
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
                              <div className="login-input-un">
                                <$Select
                                  name="role"
                                  label="Role"
                                  colon={false}
                                  value={form.role}
                                  optionLabel="label"
                                  optionValue="value"
                                  options={selectConstants.Register_role}
                                  handleChange={this.onHandleChange}
                                />
                              </div>
                              <div className="login-input-un">
                                <$Input
                                  name="nic"
                                  autoFocus
                                  label="NIC"
                                  handleChange={this.onHandleChange}
                                  value={form.nic}
                                  error={errors.nic}
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
                                <Link className="forget-pwd" to="/login">
                                  Log In
                                </Link>
                              </div>
                            </$Form>
                          </div>
                        </$Col>
                      </$Card>
                    </div>
                  </$Col>
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
