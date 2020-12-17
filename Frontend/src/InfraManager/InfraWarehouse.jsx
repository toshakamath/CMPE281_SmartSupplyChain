import React from "react";
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Row,
  Card,
  CardBody,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import CustomTable from "../common/CustomTable.jsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";
import customerJson from "../mock_data/customer.js";
import axios from 'axios';

const url = "http://127.0.0.1:4000";

class SupportWarehouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensors:[],
      listOfSensors_withHistory: [],
      warehouseId: this.props.location.state
        ? this.props.location.state.warehouseId
        : null,
      warehouseName: this.props.location.state
        ? this.props.location.state.name
        : null,
      chart_data: [],
      addSensorModal: false,
      manageSensorModal: false,
      manageOrderModal: false,
      isOpen: false,
      addSensor: {
        sensorType: "temperature",
      },
      individualSensorId: null,
      manageSensorModal: false,
      deleteToggle: false,
      orderModal: false,
      deletedSensor: '',
      manageSensor: {
        status: "active"
      },
      manageId: ""
    };
  }

  componentDidMount() {
    console.log("PROPSSS:", this.props)
    if(((this.props.location.state||{}).name||"").length !== 0){
      localStorage.setItem("warehouse_name", (this.props.location.state||{}).name||"")
    }
    if(((this.props.location.state||{}).id||"").length !== 0){
      localStorage.setItem("warehouse_id", (this.props.location.state||{}).id||"")
    }
    this.getListOfSensorsInAWarehouse(localStorage.getItem("warehouse_id"))
  }

  getSensorHistoryForSensor = (sensors)=>{
    console.log("Inside getSensorHistoryForSensor!");
    sensors.map((s)=>{
      axios
        .get(`http://localhost:3001/sensor/${s.sensor_id}/history`)
        .then((res) => {
          let sensor_withHistory = s
          sensor_withHistory.history = res.data
          let list = this.state.listOfSensors_withHistory
          list.push(sensor_withHistory)
          this.setState({
            listOfSensors_withHistory:list
          })
        })
        .catch((err) => {
          console.log("error in getting all users from mysql: ",err);
        });
    })
  }

  getListOfSensorsInAWarehouse = (warehouse_id) =>{
    console.log("Inside getListOfSensorsInAWarehouse!");
    axios
        .get(`http://localhost:3001/warehouse/${warehouse_id}/sensors`)
        .then((res) => {
          this.setState({
            sensors: res.data.sensors
          })
          this.getSensorHistoryForSensor(res.data.sensors)
        })
        .catch((err) => {
          console.log("error in getting all users from mysql: ",err);
        });
  }

  addSensorToggle = () => {
    this.setState({
      addSensorModal: !this.state.addSensorModal,
    });
  };

  addSensorSubmit = (e) => {
    // add sensor
    e.preventDefault();
    console.log("Adding sensors..");
    console.log(this.state.addSensor);
    
    let sensor = this.state.addSensor;
    axios.post(url + "/addsensor", {
      warehouseID: localStorage.getItem("warehouse_id"),
      sensortype: sensor.sensorType
    }).then((response) => {
      console.log(response);
      this.addSensorToggle(e);
    }).catch((error) => {
      console.log(error);
      this.addSensorToggle(e);
    });
  };

  manageSensorToggle = (e, sen) => {
    this.setState({
      manageSensorModal: !this.state.manageSensorModal,
    });
    if (sen !== null) {
      this.setState({
        manageId: sen.sensor_id
      })
    }
  };

  manageSensorChange = (e) => {
    let manage = this.state.manageSensor;
    manage.status = e.target.value;
    this.setState({
      manageSensor: manage
    });
  }

  manageOrderToggle = () => {
    this.setState({
      manageOrderModal: !this.state.manageOrderModal,
    });
  };

  manageIndividualSensor = (e) => {
    e.preventDefault();
    console.log("managing sensors..");
    console.log(this.state.manageId, this.state.manageSensor.status);
    
    let sensor = this.state.addSensor;
    axios.post(url + "/updatesensorstatus", {
      sensorID: this.state.manageId,
      status: this.state.manageSensor.status
    }).then((response) => {
      console.log(response);
      this.manageSensorToggle(e, null);
    }).catch((error) => {
      console.log(error);
      this.manageSensorToggle(e, null);
    });
  }

  grabAllSensor() {
    // call individual warehouse for all sensors
  }

  handleRowClick = (e, r) => {
    // handle clicking a row
    console.log(e.target, r);
    // condition check to see if row is for individual warehouse or for everything
    // clicking orders won't do anything
  };

  handleAddSensorChange = (e) => {
    console.log(e.target.value);
    this.setState({
      addSensor: {
        sensorType: e.target.value,
      },
    });
  };

  deleteSensor = (e) => {
    console.log(this.state.deletedSensor);
    axios.post(url + "/delete", {
      sensorId: this.state.deletedSensor
    }).then((response) => {
      console.log(response);
      this.deleteSensorToggle();
    }).catch((error) => {
      console.log(error);
      this.deleteSensorToggle();
    })
  }

  deleteSensorToggle = () => {
    this.setState({
      deleteToggle: !this.state.deleteToggle
    });
  };

  deleteSensorSelected = (sensor) => {
    this.setState({
      deletedSensor: sensor ? sensor.sensor_id : ''
    });
    this.deleteSensorToggle();
  }

  orderTablePagination(index) {
    // organize order table pagination
    const pageCount = Math.ceil(
      customerJson[0].warehouses[0].sensor[index].history.length /
        this.state.perPage
    );
    const pages = [];
    let cnt = 1;
    while (pageCount >= cnt) {
      pages.push(
        <PaginationItem>
          <PaginationLink>{cnt}</PaginationLink>
        </PaginationItem>
      );
      cnt += 1;
    }
    return pages;
  }

  render() {
    const pages = [1, 2, 3];

    return (
      <Container className="pb-5" fluid={true}>
        <Row className="justify-content-md-center pt-4 pb-4">
          <Col md="2">
            <h2>{localStorage.getItem("warehouse_name")}</h2>
          </Col>
          <Col md="2">
            <Button color="primary" onClick={this.addSensorToggle}>
              Add Sensor
            </Button>{" "}
            <Link className="btn btn-info" to="/">
              Go Back
            </Link>
          </Col>
        </Row>
        <Row>
          {this.state.listOfSensors_withHistory.map((sen, index) => {
            let header = [];
            let sensor_id = sen.sensor_id
            let range = [0, 100];
            if (sen.sensor_type === "temperature") {
              header = ["Time", "Temperature"];
            } else if (sen.sensor_type === "uv") {
              header = ["Time", "UV Index"];
              range = [0, 10];
            } else if (sen.sensor_type === "humidity") {
              console.log("here??")
              header = ["Time", "Concentration"];
            }

            const chart_data = [];
            const history_data = [];
            sen.history.sensor_history.forEach((data) => {
            let dateTime = new Date(data.dateTime)
            let dt = [dateTime.toString(), data.value]
              if (history_data.length < 6) {
                history_data.push(dt);
              }
              let tmp = { name: "", generic: "" };
              let x = dt[0].split(" ");
              tmp.name = x[4];      //time
              tmp.generic = dt[1];  //value
              chart_data.push(tmp);
            });

            return (
              <Col className="pb-4" xs="auto" md="4">
                <Card width="100%">
                  <CardBody>
                    <CardTitle tag="h5">{sen.sensor_type} sensor</CardTitle>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chart_data}>
                        <Line
                          type="monotone"
                          dataKey="generic"
                          stroke="#8884d8"
                        />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis domain={range} />
                      </LineChart>
                    </ResponsiveContainer>
                    <CustomTable
                      title={"Sensor History"}
                      header={header}
                      trows={history_data}
                      handleRowClick={this.handleRowClick}
                    />
                    <Pagination>
                      <PaginationItem>
                        <PaginationLink first />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink previous />
                      </PaginationItem>
                      {this.orderTablePagination(index)}
                      <PaginationItem>
                        <PaginationLink next />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink last />
                      </PaginationItem>
                    </Pagination>
                    <Button color="primary" onClick={e => this.manageSensorToggle(e, sen)}>
                      Manage Sensor
                    </Button>{" "}
                    <Button color="danger" onClick={e => this.deleteSensorSelected(sen)}>
                      Delete
                    </Button>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Modal isOpen={this.state.addSensorModal} toggle={this.addSensorToggle}>
          <ModalHeader toggle={this.addSensorToggle}>Add Sensor</ModalHeader>
          <ModalBody>
            <Form
              onSubmit={this.addSensorSubmit}>
              <FormGroup>
                <Label for="exampleEmail">Sensor Name</Label>
                <Input
                  name="email"
                  id="exampleEmail"
                  placeholder="Sensor #1"
                />
              </FormGroup>
              <FormGroup>
                <Label for="examplePassword">Location</Label>
                <Input
                  name="password"
                  id="examplePassword"
                  placeholder="Second Floor"
                />
              </FormGroup>
              <FormGroup onChange={this.handleAddSensorChange} >
                <Label for="exampleSelect">Sensor Type</Label>
                <Input
                  type="select"
                  name="select"
                  id="exampleSelect"
                  value={this.state.addSensor.sensorType}
                >
                  <option value="temperature">Temperature</option>
                  <option value="humidity">Humidity</option>
                  <option value="LIGHT">Light</option>
                </Input>
              </FormGroup>
              {this.state.addSensor.sensorType === "temperature" ? (
                <FormGroup>
                  <Label for="exampleSelectMulti">Unit Type</Label>
                  <Input
                    type="select"
                    name="selectMulti"
                    id="exampleSelectMulti"
                  >
                    <option>Fahrenheit</option>
                    <option>Celsius</option>
                  </Input>
                </FormGroup>
              ) : null}
              <ModalFooter>
                <Button
                  color="primary"
                  type="submit"
                >
                  Submit
                </Button>{" "}
                <Button color="danger" onClick={this.addSensorToggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.manageSensorModal}
          toggle={e => this.manageSensorToggle(e, null)}
        >
          <ModalHeader toggle={e => this.manageSensorToggle(e, null)}>
            Manage Sensor
          </ModalHeader>
          <ModalBody>
            <Form 
              onSubmit={this.manageIndividualSensor}
              onChange={this.manageSensorChange}
              >
              <FormGroup>
                <Label for="exampleSelect">Action</Label>
                <Input type="select" name="select">
                  <option value="active">Turn On</option>
                  <option value="inactive">Turn Off</option>
                  <option value="maintenance">Maintenance</option>
                </Input>
              </FormGroup>
              <ModalFooter>
                <Button color="primary" type="submit">
                  Update
                </Button>{" "}
                <Button color="danger" onClick={e => this.manageSensorToggle(e, null)}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.deleteToggle}
          toggle={this.deleteSensorToggle}
        >
          <ModalHeader toggle={this.deleteSensorToggle}>
            Are you sure?
          </ModalHeader>
          <ModalBody>
            <p>Deleting sensor will remove it from the network.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={e => this.deleteSensor(e)}>
              Continue
            </Button>{" "}
            <Button color="danger" onClick={this.deleteSensorToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default SupportWarehouse;
