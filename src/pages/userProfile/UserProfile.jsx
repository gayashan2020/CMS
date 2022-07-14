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
  $Table,
} from "../../components/antd";
import { Row, Col, Button, Modal, Input, Card, Table } from "antd";
import "./UserProfile.scss";
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

class Enroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      courses: [],
      currentAccess: [],
      registered: [],
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    const currentAccess = JSON.parse(getAccessToken());
    this.setState({ currentAccess: currentAccess });
    this.loadDataCourse();

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
      this.getUserData(Row);
    } catch (err) {
      this.setState({ loading: false });
      console.error(err);
      $Message.error("Error loading courses data");
    }
    this.setState({ loading: false });
  };

  getUserData = (Row) => {
    let courses = Row;
    let currentAccess = this.state.currentAccess;
    let registered = [];
    courses.forEach((element) => {
      if (element.users) {
        element.users.forEach((user) => {
          console.log(element, user);
          if (user.split(",")[0] === currentAccess.uid) {
            registered.push(element);
          }
        });
      }
    });
    console.log(registered, "registered");
    this.setState({
      registered: registered,
    });
  };

  getStatus = (dataIndex) => {
    let users = dataIndex;
    let currentAccess = this.state.currentAccess;
    let status = [];
    users.forEach((element) => {
      if (element.split(",")[0] === currentAccess.uid) {
        status.push(element.split(",")[1]);
      }
    });
    return status;
  };

  columns = [
    {
      title: "Course Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mentor",
      dataIndex: "by",
      key: "by",
    },
    {
      title: "Status",
      dataIndex: "users",
      key: "users",
      render: (dataIndex, record) => this.getStatus(dataIndex),
    },
    // {
    //   title: "Action",
    //   dataIndex: "course",
    //   key: "course",
    //   width: "15%",
    //   align: "center",
    //   render: (dataIndex, record) => this.checkPermission(dataIndex, record),
    // },
  ];

  columnsMentor = [
    {
      title: "Course Name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mentor",
      dataIndex: "by",
      key: "by",
    },
    // {
    //   title: "Action",
    //   dataIndex: "course",
    //   key: "course",
    //   width: "15%",
    //   align: "center",
    //   render: (dataIndex, record) => this.checkPermission(dataIndex, record),
    // },
  ];

  render() {
    const { loading, courses, currentAccess, registered } = this.state;
    return (
      <div>
        {loading && <$Spin />}
        <div id="ChairmanApproval" className="detail-modal-wrapper">
          <div
            className=""
            style={{ textAlign: "center", marginBottom: "2.5em" }}
          >
            <h2 style={{ color: "#3E497A" }}>User Profile</h2>
          </div>

          <Row>
            <Col xl={11}>
              <div className="pdf-commen-feild chairman-pdf">
                <h4>User Name</h4>
                <p>
                  {currentAccess.firstName} {currentAccess.lastName}
                </p>
              </div>
            </Col>
          </Row>

          <Row className="chairman-pdf-row">
            <Col xl={11}>
              <div
                style={{ marginRight: "em" }}
                className="pdf-commen-feild chairman-pdf"
              >
                <h4>NIC</h4>
                <p>{currentAccess.nic}</p>
              </div>
            </Col>
            <Col xl={11}>
              <div className="pdf-commen-feild chairman-pdf">
                <h4>Email</h4>
                <p>{currentAccess.email}</p>
              </div>
            </Col>
          </Row>

          {currentAccess && currentAccess.role === "user" && (
            <div className="tb-container">
              <Row className="center-rows">
                <Col span={24} className="tb-bg">
                  <div className="tb-chart">
                    <p className="tb-chart-text">Courses</p>
                  </div>

                  <$Table
                    rowKey="code"
                    bordered
                    columns={this.columns}
                    dataSource={registered}
                    pagination={false}
                  />
                </Col>
              </Row>
            </div>
          )}

          {currentAccess && currentAccess.role !== "user" && (
            <div className="tb-container">
              <Row className="center-rows">
                <Col span={24} className="tb-bg">
                  <div className="tb-chart">
                    <p className="tb-chart-text">Courses</p>
                  </div>

                  <$Table
                    rowKey="code"
                    bordered
                    columns={this.columnsMentor}
                    dataSource={courses}
                    pagination={false}
                  />
                </Col>
              </Row>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Enroll;
