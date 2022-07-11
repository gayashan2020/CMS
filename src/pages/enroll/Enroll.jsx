import React, { Component } from "react";
import {
  removeAccessToken,
  removeUser,
  getAccessToken,
  getUser,
} from "../../config/LocalStorage";
import {
  $Input,
  $TextArea,
  $Message,
  $Spin,
  $Space,
} from "../../components/antd";
import { Row, Col, Button, Modal, Input, Card, Table } from "antd";
import "./Enroll.scss";
import { db } from "../../config/firebase";
import {
  getFirestore,
  query,
  doc,
  getDocs,
  collection,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { RoutesConstant } from "../../assets/constants";
import { async } from "@firebase/util";
import { CheckCircleOutlined } from "@ant-design/icons";
const { Meta } = Card;
const currentAccess = JSON.parse(getAccessToken());
class Enroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userApprove: [],
      mentor: [],
      users: [],
      courses: [],
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    this.loadData();
    this.loadDataCourse();

    try {
      const docRef = doc(db, "mentors", currentAccess.uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let data = docSnap.data();

        let userApprove = [];
        if (data.users) {
          data.users.forEach((element) => {
            let val = {
              user: element.split(",")[0],
              course: element.split(",")[1],
            };

            userApprove.push(val);
          });
        }
        this.setState({
          mentor: data,
          userApprove: userApprove,
        });
        // const docRefUser = doc(db, "courses", data.users.split(",")[0]);
        // const docRefCourse = doc(db, "courses", data.users.split(",")[1]);
        // const docSnapUser = await getDoc(docRefUser);
        // const docSnapCourse = await getDoc(docRefCourse);
        // if (docSnapUser.exists() && docSnapCourse.exists()) {
        //   this.setState({
        //     users: docSnapUser.data(),
        //     course: docSnapCourse.data(),
        //   });
        // }
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
        console.log("No such document!");
      }
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
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

  loadDataCourse = async () => {
    this.setState({ loading: true });
    try {
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
      $Message.error("Error loading courses data");
    }
    this.setState({ loading: false });
  };

  editEntry = async (record) => {
    this.setState({ loading: true });
    try {
      let courses = this.mapCourseData(record.course);
      const docRef = doc(db, "courses", courses.cid);
      let users = [];
      if (courses.users) {
        courses.users.forEach((element) => {
          if (element && element.split(",")[0] !== record.user) {
            users.push(element);
          }
        });
      }
      users.push(record.user + ",approved");
      await updateDoc(docRef, {
        users: users,
      });
      $Message.success("Successfully Approved");
      this.setState({ loading: false });
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      $Message.error("Error in Approval");
    }
    this.loadData();
    this.setState({ loading: false });
  };

  checkPermission = (dataIndex, record) => {
    if (this.mapCourseDataStatus(record) === "pending") {
      return (
        <div>
          <$Space size="middle">
            <p className="grn-btn" onClick={() => this.editEntry(record)}>
              Approve enrollment
            </p>
          </$Space>
        </div>
      );
    } else {
      return (
        <$Space size="middle">
          {" "}
          <p className="grn-btn">Approved</p>
        </$Space>
      );
    }
  };

  mapUserData = (record) => {
    console.log(record, "user");
    try {
      let user = this.state.users;
      let name = user.find(function (val) {
        return val.uid === record;
      }).username;
      return name;
    } catch (error) {
      return "";
    }
  };

  mapCourseData = (record) => {
    try {
      let user = this.state.courses;
      let name = user.find(function (val) {
        return val.cid === record;
      });
      return name;
    } catch (error) {
      return "";
    }
  };

  mapCourseDataStatus = (record) => {
    try {
      let user = this.state.courses;
      let name = user
        .find(function (val) {
          return val.cid === record.course;
        })
        .users.find(function (value) {
          return value.split(",")[0] === record.user;
        })
        .split(",")[1];
      return name;
    } catch (error) {
      return "";
    }
  };

  columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (dataIndex, record) => this.mapUserData(dataIndex),
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (dataIndex, record) => this.mapCourseData(dataIndex).title,
    },
    {
      title: "Action",
      dataIndex: "course",
      key: "course",
      width: "15%",
      align: "center",
      render: (dataIndex, record) => this.checkPermission(dataIndex, record),
    },
  ];

  render() {
    const { loading, users, userApprove } = this.state;
    return (
      <div>
        {loading && <$Spin />}
        {console.log(userApprove)}
        <Table dataSource={userApprove} columns={this.columns} />;
      </div>
    );
  }
}

export default Enroll;
