import React, { Component } from "react";
import { db } from "../../../config/firebase";
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
import { UploadOutlined } from "@ant-design/icons";
import "./AddCourses.scss";
import { $Input, $TextArea, $Message, $Spin } from "../../../components/antd";
import { Card, Row, Col, Button, Modal, Input, Upload, Image } from "antd";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Moment from "moment";
import { getAccessToken } from "../../../config/LocalStorage";
const currentAccess = JSON.parse(getAccessToken());
const { Meta } = Card;
class AddCourses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      loading: false,
      aboutImage: "",
      courseImage: "",
      text: "",
      textArea: "",
      textAreaBenefit: "",
      maxStudents: "",
      courseText: "",
      courseTextArea: "",
      courseBuilder: [["##"]],
      selectModel: false,
      index: "",
      i: "",
      courseImageTopic: "",
      newCid: "",
      duration: "",
      price: "",
    };
  }

  componentDidMount = async () => {
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
      $Message.error(err.message);
    }
    this.setState({ loading: false });
    let cidCount = [];
    if (this.state.courses) {
      this.state.courses.forEach((element) => {
        let val = parseInt(element.cid.split("c")[1]);
        cidCount.push(val);
      });
    }

    let maxVal = Math.max(...cidCount) + 1;
    this.setState({
      newCid: "c" + maxVal,
    });
  };
  validateProperty = (name, value) => {
    this.setState({
      [name]: value,
    });
  };

  submitIndex = (index, i) => {
    let row = this.state.courseBuilder;
    let newRow = [];
    row.forEach((element) => {
      newRow.push(element);
    });
    newRow.push(["##"]);
    console.log(this.state.courseImageTopic, "cc");
    newRow[index][i] =
      this.state.courseText +
      "_" +
      this.state.courseTextArea +
      "_@@_" +
      this.state.courseImageTopic;
    console.log(newRow);
    this.setState({
      courseBuilder: newRow,
      selectModel: false,
    });
  };

  addCourseTopic = (index, i) => {
    this.setState({
      i: i,
      index: index,
      selectModel: true,
    });
  };

  beforeUpload(file) {
    const isPNG =
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg" ||
      file.type === "image/gif" ||
      file.type === "image/tiff" ||
      file.type === "image/bmp";

    if (!isPNG) {
      $Message.error(
        `${file.name} is not a .jpg, .jpeg, .png, .gif, .tiff or a .bmp file`
      );
      return Upload.LIST_IGNORE;
    }

    return false;
  }

  onFileChange = async (event) => {
    let name = event.file.name;
    let file = event.file;
    let fileName = this.state.newCid;

    this.setState({ loading: true });
    try {
      const storage = getStorage();

      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          this.setState({ aboutImage: url });
        });
      });

      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  };

  onFileChangeCourse = async (event) => {
    let name = event.file.name;
    let file = event.file;
    let fileName = this.state.newCid + "-c";

    this.setState({ loading: true });
    try {
      const storage = getStorage();

      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          this.setState({ courseImage: url });
        });
      });

      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  };

  onFileChangeCourseTopic = async (event) => {
    let name = event.file.name;
    let file = event.file;
    let fileName =
      this.state.newCid + "-" + this.state.index + "-" + this.state.i;

    this.setState({ loading: true });
    try {
      const storage = getStorage();

      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          this.setState({ courseImageTopic: url });
        });
      });

      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
    this.setState({ loading: false });
  };

  publish = async () => {
    let cid = this.state.newCid;
    let date = new Date();
    let duration = this.state.duration;
    let participants = this.state.maxStudents;
    let price = this.state.price;
    let title = this.state.text;
    let image = this.state.courseImage;
    let about = this.state.textArea;
    let benefit = this.state.textAreaBenefit;
    let courseBuilder = this.state.courseBuilder;
    let aboutImage = this.state.aboutImage;
    let val = {
      cid: cid,
      date: Moment(date).format("DD-MM-YYYY"),
      duration: duration,
      participants: participants,
      price: price,
      title: title,
      image: image,
      about: about,
      benefit: benefit,
      courseBuilder: JSON.stringify(courseBuilder),
      aboutImage: aboutImage,
      by: currentAccess.uid,
    };

    try {
      await setDoc(doc(db, "courses", cid), val);
      $Message.success("Successfully saved");
    } catch (err) {
      console.error(err);
      $Message.error(err.message);
    }
    this.setState({ loading: false });
  };

  render() {
    const { courses, loading, courseBuilder, index, i } = this.state;

    return (
      <div>
        {loading && <$Spin />}
        <Row gutter={16} className="add-course-row">
          <Col span={18}>
            <$Input
              name="text"
              label="Title"
              handleChange={this.validateProperty}
            />
            <Upload
              name="aboutImage"
              label="Upload"
              onChange={this.onFileChange}
              beforeUpload={this.beforeUpload}
            >
              <Button icon={<UploadOutlined />}>
                Upload image for about us
              </Button>
            </Upload>
            <$TextArea
              name="textArea"
              label="About Course"
              handleChange={this.validateProperty}
            />
            <$Input
              name="maxStudents"
              label="Maximum Students"
              handleChange={this.validateProperty}
            />
            <$Input
              name="duration"
              label="Duration"
              handleChange={this.validateProperty}
            />
            <$Input
              name="price"
              label="Price"
              handleChange={this.validateProperty}
            />
            <Upload
              name="courseImage"
              label="Upload"
              onChange={this.onFileChangeCourse}
              beforeUpload={this.beforeUpload}
            >
              <Button icon={<UploadOutlined />}>Upload image for course</Button>
            </Upload>
            <$TextArea
              name="textAreaBenefit"
              label="What Will I Learn?"
              handleChange={this.validateProperty}
            />
            <Row>
              <Col>
                <h3>Course Builder</h3>
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
                            {e === "##" && (
                              <Button
                                onClick={() => {
                                  this.addCourseTopic(index, i);
                                }}
                              >
                                Add new topic
                              </Button>
                            )}
                            {courseBuilder.length !== 1 &&
                              courseBuilder[index][i].split("_")[2] ===
                                "@@" && (
                                <div>
                                  <h1>
                                    {courseBuilder[index][i].split("_")[0]}
                                  </h1>
                                  <Image
                                    width={200}
                                    src={courseBuilder[index][i].split("_")[3]}
                                  />
                                  <p>{courseBuilder[index][i].split("_")[1]}</p>
                                </div>
                              )}
                          </div>
                        ))}
                    </Row>
                  ))}
              </Col>
            </Row>
            <Row>
              <Button
                onClick={() => {
                  this.publish();
                }}
              >
                Publish
              </Button>
            </Row>
          </Col>
          <Col span={6}>
            <h3>Course Upload Tips</h3>
            <ul>
              <li>Set the Course Price option or make it free.</li>
              <li>Course Builder is where you create & organize a course.</li>
              <li>
                Add Topics in the Course Builder section to create lessons,
                quizzes, and assignments.
              </li>
            </ul>
          </Col>
        </Row>

        <Modal
          title={"Add a new topic"}
          style={{ top: 20 }}
          footer={null}
          visible={this.state.selectModel}
          onCancel={() => this.setState({ selectModel: false })}
          // className="po-modal"
        >
          <div className="modal-footer">
            <Row>
              <$Input
                name="courseText"
                label="Topic Title"
                handleChange={this.validateProperty}
              />
            </Row>
            <Row>
              <Upload
                name="Upload"
                label="Upload"
                beforeUpload={this.beforeUpload}
                onChange={this.onFileChangeCourseTopic}
              >
                <Button
                  icon={<UploadOutlined />}
                  // handleChange={this.onFileChangeCourseTopic}
                >
                  Upload image for Topic
                </Button>
              </Upload>
            </Row>
            <Row>
              <$TextArea
                name="courseTextArea"
                label="Topic Description"
                handleChange={this.validateProperty}
              />
            </Row>
            <Row>
              <Button
                key="back"
                className="common-btn cancle-btn"
                onClick={() => this.setState({ selectModel: false })}
                style={{ margin: "10px" }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  this.submitIndex(index, i);
                }}
                style={{ margin: "10px" }}
              >
                Add Header
              </Button>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AddCourses;
