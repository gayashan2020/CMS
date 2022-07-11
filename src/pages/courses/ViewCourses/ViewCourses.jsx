import React, { Component } from "react";
import { db } from "../../../config/firebase";
import {
  getFirestore,
  query,
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "./ViewCourses.scss";
import { $Input, $TextArea, $Message, $Spin } from "../../../components/antd";
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Input,
  Image,
  Progress,
  Tabs,
} from "antd";
import { RoutesConstant } from "../../../assets/constants";
import {
  getAccessToken,
  removeAccessToken,
} from "../../../config/LocalStorage";
const { Meta } = Card;
const { TabPane } = Tabs;
const { TextArea } = Input;
const style = {
  justifyContent: "center",
  padding: "8px 0",
};
class ViewCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      loading: false,
      stateEnroll: "none",
      courseBuilder: [[]],
    };
  }

  componentDidMount = async () => {
    // try {
    //   const docRef = doc(db, "courses", "courses");
    //   const docSnap = await getDoc(docRef);

    //   if (docSnap.exists()) {
    //     console.log("Document data:", docSnap.data());
    //     this.setState({
    //       courses: docSnap.data(),
    //     });
    //   } else {
    //     // doc.data() will be undefined in this case
    //     console.log("No such document!");
    //   }
    // } catch (error) {}
    let userData = JSON.parse(getAccessToken());
    this.setState({ loading: true });
    let id = new URLSearchParams(this.props.location.search).get("id");
    console.log(id);
    try {
      const docRef = doc(db, "courses", id);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let data = docSnap.data();
        if (data.users) {
          data.users.forEach((element) => {
            if (element.split(",")[0] === userData.uid) {
              this.setState({
                stateEnroll: element.split(",")[1],
              });
            }
          });
        }
        this.setState({
          courses: data,
          courseBuilder: JSON.parse(data.courseBuilder),
        });
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
  };

  enroll = async () => {
    let userData = JSON.parse(getAccessToken());
    this.setState({ loading: true });
    let id = new URLSearchParams(this.props.location.search).get("id");

    try {
      let courses = this.state.courses;

      const docRef = doc(db, "courses", id);
      let users = [];
      if (courses.users) {
        courses.users.forEach((element) => {
          users.push(element);
        });
      }
      users.push(userData.uid + ",pending");
      await updateDoc(docRef, {
        users: users,
      });

      const docRefMentor = doc(db, "mentors", courses.by);
      let usersMentor = [];
      if (courses.users) {
        courses.users.forEach((element) => {
          usersMentor.push(element);
        });
      }
      usersMentor.push(userData.uid + "," + courses.cid);
      await updateDoc(docRefMentor, {
        users: usersMentor,
      });

      this.setState({ loading: false, stateEnroll: "pending" });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };

  render() {
    const { courses, loading, stateEnroll, courseBuilder } = this.state;

    return (
      <div>
        {loading && <$Spin />}
        <Col>
          <Row span={6}>
            <h1 orientation="right">{courses.title}</h1>
          </Row>

          <Row gutter={16}>
            <Col className="gutter-row" span={18}>
              <div style={style}>
                {<Image width={800} src={courses.image} />}
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <Row>
                {stateEnroll === "approved" && (
                  <Col>
                    <div className="tutor-card">
                      <Row style={style}>
                        <h2>Course Progress</h2>
                      </Row>
                      <Row style={style}>
                        <Progress type="circle" percent={75} />
                      </Row>
                      <Row style={style}>
                        <Button type="primary">Continue Learning</Button>
                      </Row>
                      <Row style={style}>
                        <Button>Complete Course</Button>
                      </Row>
                    </div>
                  </Col>
                )}
                {stateEnroll === "pending" && (
                  <Col>
                    <div className="tutor-card">
                      <Row style={style}>
                        <h2>Pending Approval ....</h2>
                      </Row>
                    </div>
                  </Col>
                )}
                {stateEnroll === "none" && (
                  <Col>
                    <div className="tutor-card">
                      <Row style={style}>
                        <Button onClick={() => this.enroll()}>Enroll</Button>
                      </Row>
                    </div>
                  </Col>
                )}
                <Col>
                  <div className="tutor-card">
                    <Row>
                      <h2>Material Includes</h2>
                    </Row>
                    <Row>
                      <li>document of materials</li>
                    </Row>
                    <Row>
                      <h2>Audience</h2>
                    </Row>
                    <Row>
                      <li>Computer science students</li>
                      <li>Software engineering students</li>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col className="gutter-row" span={18}>
              <div style={style}>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Course Info" key="1">
                    <Col>
                      <div>
                        <Row>
                          <h2>About Course</h2>
                        </Row>
                        <Row>
                          <Image width={200} src={courses.aboutImage} />
                        </Row>
                        <Row>
                          <p>{courses.about}</p>
                        </Row>
                        <Row>
                          <h2>Benefits</h2>
                        </Row>
                        <Row>
                          <p>{courses.benefit}</p>
                        </Row>
                        <Row>
                          <h2>Course Content</h2>
                        </Row>
                        <Row>
                          <Col>
                            {courseBuilder.length !== 0 &&
                              courseBuilder.map((element, index) => (
                                <Row
                                  gutter={{
                                    xs: 8,
                                    sm: 16,
                                    md: 24,
                                    lg: 32,
                                  }}
                                  key={index}
                                  style={{ padding: "10px" }}
                                >
                                  {element.length !== 0 &&
                                    element.map((e, i) => (
                                      <div>
                                        {courseBuilder.length !== 1 &&
                                          courseBuilder[index][i].split(
                                            "_"
                                          )[2] === "@@" && (
                                            <div>
                                              <h1>
                                                {
                                                  courseBuilder[index][i].split(
                                                    "_"
                                                  )[0]
                                                }
                                              </h1>
                                              <Image
                                                width={200}
                                                src={
                                                  courseBuilder[index][i].split(
                                                    "_"
                                                  )[3]
                                                }
                                              />
                                              <p>
                                                {
                                                  courseBuilder[index][i].split(
                                                    "_"
                                                  )[1]
                                                }
                                              </p>
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                </Row>
                              ))}
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </TabPane>
                  <TabPane tab="Q&A" key="2">
                    <Row>
                      <h2>Question & Answer</h2>
                    </Row>
                    <Row>
                      <TextArea rows={4} />
                    </Row>
                  </TabPane>
                  <TabPane tab="Announcements" key="3">
                    No Announcements
                  </TabPane>
                </Tabs>
              </div>
            </Col>
            {/* <Col className="gutter-row" span={6}>
              <div style={style}>col-6</div>
            </Col> */}
          </Row>
        </Col>
      </div>
    );
  }
}

export default ViewCourses;
