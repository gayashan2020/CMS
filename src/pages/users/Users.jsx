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
import "./Users.scss";
import { db } from "../../config/firebase";
import {
  getFirestore,
  query,
  doc,
  getDocs,
  collection,
  setDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { RoutesConstant } from "../../assets/constants";
import { async } from "@firebase/util";
import { CheckCircleOutlined } from "@ant-design/icons";
const { Meta } = Card;
// const currentAccess = JSON.parse(getAccessToken()).role;
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
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

  editEntry = async (record, status) => {
    this.setState({ loading: true });
    let val = {
      uid: record.uid,
      firstName: record.firstName,
      lastName: record.lastName,
      password: record.password,
      status: status,
      role: record.role,
      nic: record.nic,
      email: record.email,
    };

    try {
      await setDoc(doc(db, "users", record.uid), val);
      if (record.role==='mentor') {
        let valMentor = {
          uid: record.uid,
        };
        await setDoc(doc(db, "mentors", record.uid), valMentor);
      }
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
    if (dataIndex === "pending") {
      return (
        <div>
          <$Space size="middle">
            <p
              className="grn-btn"
              onClick={() => this.editEntry(record, "approved")}
            >
              Approve
            </p>
          </$Space>
          <$Space size="middle">
            <p
              className="grn-btn"
              onClick={() => this.editEntry(record, "rejected")}
            >
              Reject
            </p>
          </$Space>
        </div>
      );
    } else {
      return <$Space size="middle"></$Space>;
    }
  };

  columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "NIC",
      dataIndex: "nic",
      key: "nic",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      dataIndex: "status",
      key: "status",
      width: "15%",
      align: "center",
      render: (dataIndex, record) => this.checkPermission(dataIndex, record),
    },
  ];

  render() {
    const { loading, users } = this.state;
    return (
      <div>
        {loading && <$Spin />}
        <Table dataSource={users} columns={this.columns} />;
      </div>
    );
  }
}

export default Users;
