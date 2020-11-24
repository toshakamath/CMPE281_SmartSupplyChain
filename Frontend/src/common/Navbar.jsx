import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { withRouter, Link } from "react-router-dom";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileToggle: false,
      role: localStorage.getItem("user") ? localStorage.getItem("user") : "",
    };
  }

  profileToggle = () => {
    this.setState({
      profileToggle: !this.state.profileToggle,
    });
  };

  handleLogout = (e) => {
    localStorage.clear();
    this.props.history.push("/login");
  };

  //prop that checks role

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <Link className="navbar-brand" to="/">
            Welcome {this.state.role}!
          </Link>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <Link className="nav-link" to="/">
                Home
              </Link>
            </NavItem>
          </Nav>
          <Dropdown
            className="pr-2"
            isOpen={this.state.profileToggle}
            toggle={this.profileToggle}
          >
            <DropdownToggle color="info" caret>
              Profile
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Profile</DropdownItem>
              <Link className="dropdown-item" to="/profile">
                Settings
              </Link>
              <DropdownItem divider />
              <DropdownItem onClick={this.handleLogout}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(NavBar);
