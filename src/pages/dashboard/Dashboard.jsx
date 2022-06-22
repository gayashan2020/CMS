import React, { Component } from "react";
import {
  removeAccessToken,
  removeUser,
  getAccessToken,
  getUser,
} from "../../config/LocalStorage";
import { $Input, $TextArea } from "../../components/antd";
import { Row, Col, Button, Modal, Input } from "antd";
import "./Dashboard.scss";
class Dashboard extends Component {
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

    // let Element = this.state.elementArray;
    // let newElement = [];
    // Element.forEach((element) => {
    //   newElement.push(element);
    // });
    // let newElementC = [];
    // // console.log(row[index]);
    // Element[index].forEach((element) => {
    //   newElementC.push(element);
    // });
    // newElementC.push(1);
    // // console.log(newColumn,newRow[index]);
    // newElement[index] = newElementC;

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

  saveArray=async()=>{
    let row = this.state.rowArray;
    // let jsonRow = JSON.stringify(row)
    const json=JSON.stringify(row);
    
    const blob=new Blob([json],{type:'application/json'})
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = "file.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  render() {
    const style = {
      background: "#0092ff",
      padding: "8px 0",
    };
    const { columnArray, rowArray } = this.state;
    return (
      <div>
        <Row>
          <Button onClick={this.addRow}>Add Row</Button>
          <Button onClick={this.saveArray}>Save</Button>
        </Row>
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
                      {e === 1 && (
                        <Button
                          onClick={() => {
                            this.addColumn(index, i);
                          }}
                        >
                          Column
                        </Button>
                      )}
                      {e === 1 && (
                        <Button
                          onClick={() => {
                            this.addElementText(index, i);
                          }}
                        >
                          Heading
                        </Button>
                      )}
                      {e === 1 && (
                        <Button
                          onClick={() => {
                            this.addElementTextPara(index, i);
                          }}
                        >
                          Paragraph
                        </Button>
                      )}
                      {e === 1 && (
                        <Button
                          onClick={() => {
                            this.addElementTextImg(index, i);
                          }}
                        >
                          Image
                        </Button>
                      )}
                      {e === 1 && (
                        <Button
                          onClick={() => {
                            this.addElementTextHP(index, i);
                          }}
                        >
                          Compound
                        </Button>
                      )}
                      {e !== 1 &&
                        this.state.rowArray[index][i].split("_")[1] === "h" && (
                          <h1>{this.state.rowArray[index][i].split("_")[0]}</h1>
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
        <Modal
          // title={"Add Purchase Order No"}
          style={{ top: 20 }}
          footer={null}
          visible={this.state.model}
          onCancel={() => this.setState({ model: false })}
          className="po-modal"
        >
          <$Input
            name="text"
            label="Add Text"
            // value={this.state.text}
            handleChange={this.validateProperty}
          />
          {console.log(
            this.state.index,
            this.state.i,
            this.state.text,
            process.env.PUBLIC_URL + "1.png"
          )}
          <div className="modal-footer">
            <Button
              key="back"
              className="common-btn cancle-btn"
              onClick={() => this.setState({ model: false })}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              className="common-btn"
              type="primary"
              onClick={() => {
                this.addElement(
                  this.state.index,
                  this.state.i,
                  this.state.text
                );
              }}
            >
              Save
            </Button>
          </div>
        </Modal>

        <Modal
          // title={"Add Purchase Order No"}
          style={{ top: 20 }}
          footer={null}
          visible={this.state.modelPara}
          onCancel={() => this.setState({ modelPara: false })}
          className="po-modal"
        >
          <$TextArea
            name="text"
            label="Add Text"
            // value={this.state.text}
            handleChange={this.validateProperty}
          />
          {console.log(this.state.index, this.state.i, this.state.text)}
          <div className="modal-footer">
            <Button
              key="back"
              className="common-btn cancle-btn"
              onClick={() => this.setState({ modelPara: false })}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              className="common-btn"
              type="primary"
              onClick={() => {
                this.addElementPara(
                  this.state.index,
                  this.state.i,
                  this.state.text
                );
              }}
            >
              Save
            </Button>
          </div>
        </Modal>

        <Modal
          // title={"Add Purchase Order No"}
          style={{ top: 20 }}
          footer={null}
          visible={this.state.modelImg}
          onCancel={() => this.setState({ modelImg: false })}
          className="po-modal"
        >
          <input type="file" onChange={this.onFileChange} />
          {console.log(this.state.index, this.state.i, this.state.text)}
          <div className="modal-footer">
            <Button
              key="back"
              className="common-btn cancle-btn"
              onClick={() => this.setState({ modelImg: false })}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              className="common-btn"
              type="primary"
              onClick={() => {
                this.addElementImg(
                  this.state.index,
                  this.state.i,
                  this.state.text
                );
              }}
            >
              Save
            </Button>
          </div>
        </Modal>

        <Modal
          // title={"Add Purchase Order No"}
          style={{ top: 20 }}
          footer={null}
          visible={this.state.modelHP}
          onCancel={() => this.setState({ modelHP: false })}
          className="po-modal"
        >
          <$Input
            name="text"
            label="Add Text"
            // value={this.state.text}
            handleChange={this.validateProperty}
          />
          <$TextArea
            name="textArea"
            label="Add Text"
            // value={this.state.text}
            handleChange={this.validateProperty}
          />
          {console.log(this.state.index, this.state.i, this.state.text)}
          <div className="modal-footer">
            <Button
              key="back"
              className="common-btn cancle-btn"
              onClick={() => this.setState({ modelHP: false })}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              className="common-btn"
              type="primary"
              onClick={() => {
                this.addElementHP(
                  this.state.index,
                  this.state.i,
                  this.state.text,
                  this.state.textArea
                );
              }}
            >
              Save
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Dashboard;
