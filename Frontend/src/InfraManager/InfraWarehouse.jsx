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

class SupportWarehouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

  componentDidMount() {
    // console.log(this.props.location.state.warehouseId);
    console.log(this.state.warehouseId);
    // make call to grab all sensor data from the selected warehouse
    // default detailed warehouse is first on the list
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
  };

  manageSensorToggle = () => {
    this.setState({
      manageSensorModal: !this.state.manageSensorModal,
    });
  };
  manageOrderToggle = () => {
    this.setState({
      manageOrderModal: !this.state.manageOrderModal,
    });
  };

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

  deleteSensorToggle = () => {
    this.setState({
      deleteToggle: !this.state.deleteToggle,
    });
  };

  handleDelete = (e) => {
    e.preventDefault();
    // handle delete action
    this.deleteSensorToggle();
  };

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
            <h2>Warehouse {this.state.warehouseName}</h2>
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
          {customerJson[0].warehouses[0].sensor.map((sen, index) => {
            let header = [];
            let range = [0, 100];
            if (sen.type === "temperature") {
              header = ["Time", "Temperature"];
            } else if (sen.type === "uv") {
              header = ["Time", "UV Index"];
              range = [0, 10];
            } else if (sen.type === "humidity") {
              header = ["Time", "Concentration"];
            }

            const chart_data = [];
            sen.history.forEach((dt) => {
              let tmp = { name: "", generic: "" };
              let x = dt[0].split("-");
              tmp.name = x[1];
              tmp.generic = dt[1];
              chart_data.push(tmp);
            });

            return (
              <Col className="pb-4" xs="auto" md="4">
                <Card width="100%">
                  <CardBody>
                    <CardTitle tag="h5">{sen.name}</CardTitle>
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
                      title="History"
                      header={header}
                      trows={sen.history}
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
                    <Button color="primary" onClick={this.manageSensorToggle}>
                      Manage Sensor
                    </Button>{" "}
                    <Button color="danger" onClick={this.deleteSensorToggle}>
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
            <Form onSubmit={this.addSensorSubmit}>
              <FormGroup>
                <Label for="exampleEmail">Sensor Name</Label>
                <Input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="Sensor #1"
                />
              </FormGroup>
              <FormGroup>
                <Label for="examplePassword">Location</Label>
                <Input
                  type="password"
                  name="password"
                  id="examplePassword"
                  placeholder="Second Floor"
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleSelect">Sensor Type</Label>
                <Input
                  type="select"
                  name="select"
                  id="exampleSelect"
                  value={this.state.addSensor.sensorType}
                  onChange={this.handleAddSensorChange}
                >
                  <option value="temperature">Temperature</option>
                  <option value="humidity">Humidity</option>
                  <option value="uv">UV</option>
                  <option value="wind">Wind</option>
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
              <FormGroup>
                <Label for="examplePassword">Threshold</Label>
                <Input
                  type="password"
                  name="password"
                  id="examplePassword"
                  placeholder=""
                />
              </FormGroup>
              <ModalFooter>
                <Button
                  color="primary"
                  type="submit"
                  onClick={this.addSensorToggle}
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
          toggle={this.manageSensorToggle}
        >
          <ModalHeader toggle={this.manageSensorToggle}>
            Manage Sensor
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={this.manageIndividualSensor}>
              <FormGroup>
                <Label for="exampleEmail">Sensor Name</Label>
                <Input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="Sensor #1"
                />
              </FormGroup>
              <FormGroup>
                <Label for="examplePassword">Location</Label>
                <Input
                  type="password"
                  name="password"
                  id="examplePassword"
                  placeholder="Second Floor"
                />
              </FormGroup>
              <FormGroup>
                <Label for="exampleSelect">Sensor Type</Label>
                <Input type="select" name="select">
                  <option value="temperature">Temperature</option>
                  <option value="humidity">Humidity</option>
                  <option value="uv">Light</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="exampleSelect">Action</Label>
                <Input type="select" name="select">
                  <option value="on">Turn On</option>
                  <option value="off">Turn Off</option>
                  <option value="maintain">Maintenance</option>
                </Input>
              </FormGroup>
              <ModalFooter>
                <Button color="primary" type="submit">
                  Update
                </Button>{" "}
                <Button color="danger" onClick={this.manageSensorToggle}>
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
            <Button color="primary" onClick={this.handleDelete}>
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
