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
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import CustomTable from "./common/CustomTable.jsx";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { withRouter, Link } from "react-router-dom";
import axios from 'axios'
import {tosha_backend_url, derek_backend_url} from "./Constants/Constants.js";

/*
TODO: Work on modal forms for edit profile, edit billing and view charts
*/
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile:{},
      chart_data: [],
      role: localStorage.getItem("user") ? localStorage.getItem("user") : "",
      expenseModal: false,
      expense_table: [],
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: ""
    };
  }

  componentDidMount() {
    // test data
    this.getProfile()
    this.setState({
      chart_data: [
        { name: "15:05", expense: 68 },
        { name: "15:10", expense: 69 },
        { name: "15:15", expense: 66 },
        { name: "15:20", expense: 66 },
        { name: "15:25", expense: 68 },
        { name: "15:30", expense: 70 },
        { name: "15:35", expense: 71 },
        { name: "15:40", expense: 71 },
        { name: "15:45", expense: 71 },
        { name: "15:50", expense: 75 },
        { name: "15:55", expense: 75 },
        { name: "16:00", expense: 76 },
      ],
      expense_table: [
        ["15:05", "map", 68],
        ["15:10", "map", 69],
        ["15:15", "map", 66],
        ["15:20", "sensor", 66],
        ["15:25", "map", 68],
        ["15:30", "sensor", 70],
        ["15:35", "sensor", 71],
        ["15:40", "map", 71],
        ["15:45", "map", 71],
        ["15:50", "map", 75],
        ["15:55", "map", 75],
        ["16:00", "sensor", 76],
      ],
    });
  }

  getProfile =()=>{
    console.log("Inside getProfile!");
    const email = localStorage.getItem("email");
    axios
    .get(`${tosha_backend_url}/user?email=${email}`)
    .then((res) => {
      console.log("response: ", res.data);
        this.setState({
            profile: (res.data||{}).user_details||{}
        });
    })
    .catch((err) => {
      console.log("error in getting user details from mysql: ",err);
    });
  }

  handleChange = (e) => {
    console.log(e.target);
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  expenseToggle = () => {
    this.setState({
      expenseModal: !this.state.expenseModal,
    });
  };

  profileToggle = () => {
    this.setState({
      profileModal: !this.state.profileModal,
    });
  };
  render() {
    return (
      <Container className="pt-4 pb-4">
        <Row className="justify-content-md-center">
          <Col xs={12} md={5}>
            <h2>Profile</h2>
            <Row>
              <img
                src="./logo512.png"
                style={{ height: "200px", width: "200px" }}
                class="rounded float-left"
              />
            </Row>
            <Row>
              <Table borderless={true}>
                <thead>
                  <tr>
                    <th>{(this.state.profile||{}).name||""}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Role:</th>
                    <th scope="row">{(this.state.profile||{}).role||""}</th>
                  </tr>
                  <tr>
                    <th scope="row">Address</th>
                    <th scope="row">{(this.state.profile||{}).address||""}</th>
                  </tr>
                  <tr>
                    <th scope="row">Email:</th>
                    <th scope="row">{this.state.profile.email}</th>
                  </tr>
                  <tr>
                    <th scope="row">Phone Number:</th>
                    <th scope="row">{this.state.profile.phone}</th>
                  </tr>
                </tbody>
              </Table>
              <Button onClick={this.profileToggle} color="primary">
                Edit Profile
              </Button>
            </Row>
          </Col>
          <Col className="pt-2" md={7}>
            <h2>Billing Information</h2>
            <Row>
              <Table borderless={true}>
                <tbody>
                  <tr>
                    <th scope="row">Credit Card Number:</th>
                    <th scope="row">*******1889</th>
                  </tr>
                  <tr>
                    <th scope="row">Billing Address:</th>
                    <th scope="row">{(this.state.profile||{}).address||""}</th>
                  </tr>
                </tbody>
              </Table>
              {/* <Button>Edit Billing</Button> */}
            </Row>
            <Row className="pl-2 pt-4">
              <h2>Track Expenses</h2>
            </Row>
            <Row>
              <ResponsiveContainer className="pt-2" width="100%" height={500}>
                <LineChart data={this.state.chart_data}>
                  <Line type="monotone" dataKey="expense" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                </LineChart>
              </ResponsiveContainer>
            </Row>
            <Button color="primary" onClick={this.expenseToggle}>
              See Details
            </Button>
          </Col>
        </Row>

        <Modal isOpen={this.state.expenseModal} toggle={this.expenseToggle}>
          <ModalHeader toggle={this.expenseToggle}>
            Detailed Expense
          </ModalHeader>
          <ModalBody>
            {/* <CustomTable
              title=""
              header={["Time", "Category", "Expense"]}
              trows={this.state.expense_table}
              handleRowClick={() => {}}
            /> */}
            <Table xs="10" hover={true}>
                    <thead>
                    <tr>
                        {
                            ["Time", "Category", "Expense"].map((hr) => {
                                return(
                                    <th>{hr}</th>
                                );
                            })
                        }
                    </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.expense_table.map((r) => {
                                return(
                                <tr>
                                    <td>{r[0]}</td>
                                    <td>{r[1]}</td>
                                    <td>{r[2]}</td>
                                </tr>);
                            })
                        }
                    </tbody>
                </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.expenseToggle}>
              Done
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.profileModal} toggle={this.profileToggle}>
          <ModalHeader toggle={this.profileToggle}>
            Edit Profile
          </ModalHeader>
          <ModalBody>
            <Form onChange={this.handleChange}>
              <FormGroup>
                <Label for="exampleEmail">Name</Label>
                <Input type="text" name="name" />
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">Email:</Label>
                <Input type="text" name="email" />
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">Phone Number:</Label>
                <Input type="text" name="phone" />
              </FormGroup>
              <FormGroup>
                <Label>Address</Label>
                <Input value={this.state.address} name="address" />
                <Row>
                  <Col>
                    <Label>City</Label>
                    <Input value={this.state.city} name="city" />
                  </Col>
                  <Col>
                    <Label>State</Label>
                    <Input value={this.state.state} name="state" />
                  </Col>
                  <Col>
                    <Label>Zipcode</Label>
                    <Input name="zip_code" value={this.state.zip_code} />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="exampleSelect">Role:</Label>
                <Input type="select" name="role">
                  <option value="supplier">Supplier</option>
                  <option value="manager">Infrastructure Manager</option>
                  <option value="support">IOT Support</option>
                </Input>
              </FormGroup>
            </Form>
            <ModalFooter>
              <Button color="primary" onClick={this.profileToggle}>
                Update
              </Button>
              <Button color="danger" onClick={this.profileToggle}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </Container>
    );
  }
}

export default Profile;
