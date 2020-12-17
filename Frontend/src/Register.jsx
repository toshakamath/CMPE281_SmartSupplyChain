import React from "react";
import { withRouter, Link } from "react-router-dom";
import {
  Container,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
} from "reactstrap";
import axios from 'axios'
import {tosha_backend_url, derek_backend_url} from "./Constants/Constants.js";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      role: "supplier",
    };
  }

  handleChange = (e) => {
    console.log("handle change", e);
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  registerSubmit = (e) => {
    // save user to the backend
    e.preventDefault();
    let data = {
      name:this.state.name,
      email:this.state.email,
      password:this.state.password,
      role:this.state.role
    }
    console.log(data);
    axios
    .post(`${tosha_backend_url}/register`, data)
    .then((res) => {
      console.log("redirect...");
      this.props.history.push("/login");
    })
    .catch((err) => {
      console.log("error while tryign to register the user. Try again!: ",err);
    });
  };
  render() {
    return (
      <div className="App">
        <Container>
          <Row className="pt-5 justify-content-center">
            <h2>SupplyChain Register</h2>
          </Row>
          <Form
            className="pl-5 pr-5 border login-form"
            onSubmit={this.registerSubmit}
          >
            {/* <Container className="login-border"> */}
            <Col className="pb-4 font-weight-bold">
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={this.state.name}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="role">Role</Label>
                <Input
                  type="select"
                  name="role"
                  value={this.state.role}
                  onChange={this.handleChange}
                >
                  <option value="supplier">Supplier</option>
                  <option value="manager">Infrastructure Manager</option>
                  <option value="support">IOT Support</option>
                </Input>
              </FormGroup>
              <Button color="primary" type="submit">
                Register
              </Button>{" "}
              <Link className="btn btn-danger" to="/">
                Cancel
              </Link>
            </Col>
            {/* </Container> */}
          </Form>
        </Container>
      </div>
    );
  }
}

export default withRouter(Register);
