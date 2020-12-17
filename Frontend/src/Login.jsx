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
import axios from 'axios';
import {tosha_backend_url, derek_backend_url} from "./Constants/Constants.js";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      pass: "",
    };
  }

  handleChange = (e) => {
    console.log("handle change", e);
    if (e.target.name === "username") {
      this.setState({
        username: e.target.value,
      });
    } else {
      this.setState({
        pass: e.target.value,
      });
    }
  };
  submitLogin = (e) => {
    e.preventDefault();
    console.log("Inside submitLogin!");
    let data ={
      "email":this.state.username,
      "password":this.state.pass
    }
    axios
      .post(`${tosha_backend_url}/login`, data)
      .then((res) => {
        console.log("response: ", res.data);
        if (res.data.status === "success") {
            localStorage.setItem("user", res.data.details.role);
            localStorage.setItem("email", res.data.details.email);
            console.log("redirect...");
            this.props.history.push("/");
        }
        else{
          console.log("wrong user.. redirect...");
          localStorage.clear();
        }
      })
      .catch((err) => {
        console.log("error authorizing user from mysql: ", err);
      });
  };

  render() {
    return (
      <div className="App">
        <Container>
          <Row className="pt-5 justify-content-center">
            <h2>SupplyChain Login</h2>
          </Row>
          <Row className="justify-content-center">
            <Form
              className="pt-4 pb-4 pr-5 pl-5 border"
              onSubmit={this.submitLogin}
            >
              <Col>
                <FormGroup>
                  <Label>Username/Email</Label>
                  <Input
                    type="username"
                    name="username"
                    placeholder="email@email.com"
                    value={this.state.username || ""}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="exPassword">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="exPassword"
                    placeholder="*******"
                    value={this.state.pass || ""}
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
              <Button color="primary" type="submit">
                Submit
              </Button>
              <p className="pt-2">
                Don't have a account yet?<Link to="/register">Sign up!</Link>
              </p>
            </Form>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(Login);
