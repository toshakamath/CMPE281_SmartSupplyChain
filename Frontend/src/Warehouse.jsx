import React from "react";
import {
  Col,
  Form,
  Table,
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
import CustomTable from "./common/CustomTable.jsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Link } from "react-router-dom";
import warehouseJSON from "./mock_data/warehouse";
import customerJson from "./mock_data/customer.js";

class Warehouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warehouseId: this.props.location.state
        ? this.props.location.state.warehouseId
        : null,
      warehouseName: this.props.location.state
        ? this.props.location.state.name
        : "",
      chart_data: [],
      addSensorModal: false,
      manageSensorModal: false,
      manageOrderModal: false,
      isOpen: false,
      addSensor: {
        sensorType: "temperature",
      },
      manageSensor: {
        sensorType: "temperature",
      },
      individualSensorId: null,
      selectedSensor: false,
      orderHistory: warehouseJSON[0].history,
      deleteToggle: false,
      perPage: 5,
    };
  }

  componentDidMount() {
    // console.log(this.props.location.state.warehouseId);
    console.log(this.state.warehouseId);

    // make call to grab all sensor data from the selected warehouse
    // default detailed warehouse is first on the list
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

  handleManageSensorChange = (e) => {
    console.log(e.target.value);
    this.setState({
      manageSensor: {
        sensorType: e.target.value,
      },
    });
  };

  manageIndividualSensor = () => {
    this.setState({
      selectedSensor: !this.state.selectedSensor,
    });
  };

  deleteSensorToggle = () => {
    this.setState({
      deleteToggle: !this.state.deleteToggle,
    });
  };

  renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  render() {
    const pieData = [
      { name: "Group A", value: 400 },
      { name: "Group B", value: 300 },
      { name: "Group C", value: 300 },
      { name: "Group D", value: 200 },
    ];
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
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
              header = ["Time", "Lux"];
              range = [0, 10];
            } else if (sen.type === "humidity") {
              header = ["Time", "Relative Humidity"];
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
          <Col className="pb-4" md="auto">
            <Card width="100%">
              <CardBody>
                <CardTitle tag="h5">Orders Summary</CardTitle>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart width={400} height={400}>
                    <Pie
                      data={pieData}
                      cx={200}
                      cy={150}
                      labelLine={false}
                      label={this.renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Table>
                  <thead>
                    <tr>
                      <td>Order#</td>
                      <td>Type</td>
                      <td>Origin</td>
                      <td>Destination</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Corn</td>
                      <td>San Francsico</td>
                      <td>Las Vegas</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Fruit</td>
                      <td>San Francsico</td>
                      <td>New York</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Fruit</td>
                      <td>San Francsico</td>
                      <td>Seattle</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Food</td>
                      <td>San Francsico</td>
                      <td>Miami</td>
                    </tr>
                  </tbody>
                </Table>
                <Pagination aria-label="Page navigation example">
                  <PaginationItem>
                    <PaginationLink
                      first
                      onClick={() => {
                        console.log("load first");
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink previous />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink next />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink last />
                  </PaginationItem>
                </Pagination>
              </CardBody>
            </Card>
          </Col>
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
                  <option value="uv">UV</option>
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
            <Button
              color="primary"
              onClick={() => {
                console.log("deleted!");
              }}
            >
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

export default Warehouse;
