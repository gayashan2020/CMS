import React, { Component } from "react";
import {
  removeAccessToken,
  removeUser,
  getAccessToken,
  getUser,
} from "../../config/LocalStorage";
import { $Input, $TextArea, $Message } from "../../components/antd";
import { Row, Col, Button, Modal, Input } from "antd";
import "./Home.scss";
import { db } from "../../config/firebase";
import {
  getFirestore,
  query,
  doc,
  getDocs,
  collection,
  where,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowArray: [[1]],
      elementArray: [[1]],
      text: "",
      textArea: "",
      index: 0,
      i: 0,
      model: false,
      modelPara: false,
      modelImg: false,
      modelHP: false,
    };
  }

  componentDidMount = async () => {
    try {
      // let dataRow = await getDoc(doc(db, '3GssDbdr8NKjcCKcV4NZ',"home"))
      const q = query(collection(db, "home"));
      const data = onSnapshot(q, (querySnapshot) => {
        const Row = [];
        querySnapshot.forEach((doc) => {
          Row.push(doc.data().file);
        });
        this.setState({
          rowArray: JSON.parse(Row[0]),
          //   elementArray: newElement,
        });
      });
      // let data = JSON.parse(dataRow.file);
      // console.log(data, dataRow);
      // this.setState({
      //   rowArray: data,
      //   //   elementArray: newElement,
      // });
    } catch (err) {
      console.error(err);
      $Message.error(err.message);
    }

    // let data = await fetch("file.json", {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //   },
    // }).then(function (response) {
    //   console.log(response);
    //   return response.json();
    // });
    // console.log(data);
    // // let colArray = JSON.parse(data);
    // this.setState({
    //   rowArray: data,
    //   //   elementArray: newElement,
    // });
  };

  addColumn = (index) => {
    let row = this.state.rowArray;
    let newRow = [];
    row.forEach((element) => {
      newRow.push(element);
    });
    let newColumn = [];
    // console.log(row[index]);
    row[index].forEach((element) => {
      newColumn.push(element);
    });
    newColumn.push(1);
    // console.log(newColumn,newRow[index]);
    newRow[index] = newColumn;
    console.log(newRow);

    this.setState({
      rowArray: newRow,
      //   elementArray: newElement,
    });
  };
  addElement = (index, i, text) => {
    console.log(index, i, text);
    let row = this.state.rowArray;
    row[index][i] = text + "_h";
    this.setState({
      rowArray: row,
      model: false,
    });
  };
  addElementPara = (index, i, text) => {
    console.log(index, i, text);
    let row = this.state.rowArray;
    row[index][i] = text + "_p";
    this.setState({
      rowArray: row,
      modelPara: false,
    });
  };

  addElementHP = (index, i, text, textArea) => {
    console.log(index, i, text);
    let row = this.state.rowArray;
    row[index][i] = text + "_HP_" + textArea;
    this.setState({
      rowArray: row,
      modelHP: false,
    });
  };

  addElementImg = (index, i, text) => {
    let row = this.state.rowArray;
    row[index][i] = text + "_I";
    this.setState({
      rowArray: row,
      modelImg: false,
    });
  };

  addRow = () => {
    let row = this.state.rowArray;
    let newRow = [];
    row.forEach((element) => {
      newRow.push(element);
    });
    newRow.push([1]);
    console.log(newRow);
    this.setState({
      rowArray: newRow,
    });
  };

  addElementText = (index, i) => {
    console.log(index, i);
    this.setState({
      i: i,
      index: index,
      model: true,
    });
  };

  addElementTextPara = (index, i) => {
    console.log(index, i);
    this.setState({
      i: i,
      index: index,
      modelPara: true,
    });
  };

  addElementTextImg = (index, i) => {
    console.log(index, i);
    this.setState({
      i: i,
      index: index,
      modelImg: true,
    });
  };

  addElementTextHP = (index, i) => {
    console.log(index, i);
    this.setState({
      i: i,
      index: index,
      modelHP: true,
    });
  };

  validateProperty = (name, value) => {
    console.log(name, value);
    this.setState({
      [name]: value,
    });
  };

  onFileChange = (event) => {
    console.log(event.target.files[0].name);
    this.setState({
      text: event.target.files[0].name,
    });
  };

  saveArray = async () => {
    let row = this.state.rowArray;
    let jsonRow = JSON.stringify(row);
    console.log(row, jsonRow);
    const json = JSON.stringify(jsonRow);
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = "file.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  render() {
    const style = {
      background: "#0092ff",
      padding: "8px 0",
    };
    const { columnArray, rowArray } = this.state;
    return (
      <div>
        {rowArray.length !== 0 &&
          rowArray.map((element, index) => (
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
                  <Col
                    className="gutter-row"
                    span={24 / element.length}
                    key={i}
                  >
                    <div className="element">
                      {e !== 1 &&
                        this.state.rowArray[index][i].split("_")[1] === "h" && (
                          <h1>{this.state.rowArray[index][i].split("_")[0]}</h1>
                        )}
                      {e !== 1 &&
                        this.state.rowArray[index][i].split("_")[1] ===
                          "mh" && (
                          <h1 style={{ fontSize: "3em" }}>
                            {this.state.rowArray[index][i].split("_")[0]}
                          </h1>
                        )}
                      {e !== 1 &&
                        this.state.rowArray[index][i].split("_")[1] === "p" && (
                          <p>{this.state.rowArray[index][i].split("_")[0]}</p>
                        )}
                      {e !== 1 &&
                        this.state.rowArray[index][i].split("_")[1] === "I" && (
                          <img
                            className="img"
                            src={this.state.rowArray[index][i].split("_")[0]}
                          />
                        )}
                      {e !== 1 &&
                        this.state.rowArray[index][i].split("_")[1] ===
                          "HP" && (
                          <div>
                            <h1>
                              {this.state.rowArray[index][i].split("_")[0]}
                            </h1>
                            <br />
                            <p>{this.state.rowArray[index][i].split("_")[2]}</p>
                          </div>
                        )}
                    </div>
                  </Col>
                ))}
            </Row>
          ))}
      </div>
    );
  }
}

export default Home;
