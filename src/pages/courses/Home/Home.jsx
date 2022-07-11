import React, { Component } from "react";
import { db } from "../../../config/firebase";
import {
  getFirestore,
  query,
  doc,
  getDoc,
  getDocs,
  collection,
  where,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "./Home.scss";
import { $Input, $TextArea, $Message, $Spin } from "../../../components/antd";
import { Card, Row, Col, Button, Modal, Input } from "antd";
import { RoutesConstant } from "../../../assets/constants";
import { getAccessToken } from "../../../config/LocalStorage";
const { Meta } = Card;
// const userRole = JSON.parse(getAccessToken()).role;
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      loading: false,
      users: [],
      userRole: "",
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    try {
      const userRole = JSON.parse(getAccessToken()).role;
      const q = query(collection(db, "courses"));

      const querySnapshot = await getDocs(q);
      const Row = [];
      querySnapshot.forEach((doc) => {
        Row.push(doc.data());
      });
      this.setState({
        courses: Row,
      });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      $Message.error(err.message);
    }
    this.loadData();
    this.setState({ loading: false });
  };

  loadData = async () => {
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
      $Message.error("Error loading user data");
    }
    this.setState({ loading: false });
  };

  navigateNew = (id) => {
    console.log(RoutesConstant.viewCourses + "?id=" + id, "id");
    this.props.history.push(RoutesConstant.viewCourses + "?id=" + id);
  };

  navigateAdd = () => {
    this.props.history.push(RoutesConstant.addCourses);
  };

  getUserName = (id) => {
    try {
      let name = this.state.users.find(function (val) {
        return val.uid === id;
      }).username;
      return name;
    } catch (error) {
      return "";
    }
  };

  render() {
    const { courses, loading, userRole } = this.state;

    return (
      <div className="element">
        {loading && <$Spin />}
        {courses !== {} &&
          courses.map((element, index) => (
            <Row
              key={index}
              style={{ margin: "20px" }}
              gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
              }}
            >
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={element.image} />}
                onClick={() => this.navigateNew(element.cid)}
              >
                <Meta title={element.title} description={element.date} />
                <Row>
                  <p style={{ margin: "5px" }}>{element.duration}</p>
                  <p style={{ margin: "5px" }}>
                    participants : {element.participants}
                  </p>
                </Row>
                <Row>{this.getUserName(element.by)}</Row>
              </Card>
            </Row>
          ))}
        {(userRole === "admin" || userRole === "mentor") && (
          <Row>
            <Button
              style={{ margin: "20px" }}
              onClick={() => this.navigateAdd()}
            >
              Add new course
            </Button>
          </Row>
        )}
      </div>
    );
  }
}

export default Home;
