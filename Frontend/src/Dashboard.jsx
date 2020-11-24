import React from "react";
import {
  Col,
  Table,
  Form,
  Label,
  FormGroup,
  Input,
  Badge,
  Container,
  Button,
  Row,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
} from "reactstrap";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import { withRouter } from "react-router-dom";
import Geocode from "react-geocode";
import customerJson from "./mock_data/customer";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      isOpen: false,
      table_header: ["Name", "Orders", "Location", "Status"],
      table_data: [],
      showTooltip: {},
      activeMarker: null,
      selectedMarkerInfo: {
        name: "",
        status: "Unknown",
      },
      markerData: customerJson[0].warehouses,
      deleteModal: false,
      selectedLocation: {
        lat: "",
        lng: "",
      },
      searchBarValue: "",
      centerLocation: {},
      role: "",
    };
  }

  componentDidMount() {
    const role = localStorage.getItem("user");
    this.populateWarehouseTable();
  }

  populateWarehouseTable() {
    let tmp = customerJson[0].warehouses.map((ware) => {
      return [ware.name, ware.orders, ware.state, ware.status];
    });
    this.setState({
      table_data: tmp,
    });
  }

  // need list of longitude and latitude to define marker locations
  searchWarehouse = (e) => {
    // search warehouse
    e.preventDefault();
    let loc = {
      lat: -1,
      lng: -1,
    };
    this.state.markerData.forEach((ware) => {
      if (this.state.searchBarValue === ware.state) {
        // zoom in
        loc = ware.location;
      }
    });
    if (loc.lat < 0) {
      console.log("Not found");
    } else {
      this.setState({
        zoom: 14,
        centerLocation: loc,
      });
    }
  };

  modalToggle = (e) => {
    e.preventDefault();
    this.setState({
      modal: !this.state.modal,
    });
  };

  deleteToggle = (e) => {
    e.preventDefault();
    this.setState({
      deleteModal: !this.state.deleteModal,
    });
  };

  collapse = (e) => {
    e.preventDefault();
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  handleRowClick = (e, r) => {
    // handle clicking a row
    console.log(e.target, r);

    // condition check to see if row is for individual warehouse or for everything
    // clicking orders won't do anything
    this.props.history.push({
      pathname: "/warehouse",
      state: {
        name: r[0],
      },
    });
  };

  onMarkerClick = (props, marker) => {
    console.log(props);
    let h = props.name.split("-");
    console.log(h);
    this.setState({
      activeMarker: marker,
      showTooltip: true,
      selectedMarkerInfo: {
        name: h[0],
        status: h[1],
      },
    });
  };

  onToolTipClose = (e) => {
    console.log(e);
    // e.preventDefault();
    this.setState({
      activeMarker: null,
      showTooltip: false,
    });
  };

  addWarehouseSubmit = () => {
    // use react geocode to convert address to lat/lng
    // Geocode.fromAddress("address").then(
    //     (response) => {
    //         const { lat, lng } = response.results[0].geometry.location;
    //         console.log(lat, lng);
    //     },
    //     (error) => {
    //         console.log(error);
    //     }
    // );
  };

  deleteWarehouseSubmit = () => {
    // delete warehouse from the network for the specific customer
  };

  // close tooltip if user clicks off the tooltip
  onMapClick = (e) => {
    console.log(e);
    if (this.state.showTooltip) {
      this.setState({
        activeMarker: null,
        showTooltip: false,
      });
    }
  };

  handleSearchChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    this.setState({
      searchBarValue: e.target.value,
    });
  };

  render() {
    return (
      <Container className="pt-2" fluid={true}>
        <Form onSubmit={this.searchWarehouse}>
          <Row>
            <Col md="7" xs="9">
              <FormGroup>
                <Input
                  name="search"
                  id="search"
                  onChange={this.handleSearchChange}
                  value={this.state.searchBarValue}
                  placeholder="Enter a address, zip code or city...."
                />
              </FormGroup>
            </Col>
            <Col md="1" xs="1">
              <Button color="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col xs="12" md="7">
            <div
              style={{ position: "relative", width: "100%", height: "80vh" }}
            >
              <Map
                google={this.props.google}
                center={this.state.centerLocation}
                onClick={this.onMapClick}
                zoom={14}
              >
                {this.state.markerData.map((obj, index) => {
                  let lat = parseFloat(obj.location.lat, 10);
                  let lng = parseFloat(obj.location.lng, 10);
                  return (
                    <Marker
                      key={index}
                      name={`${obj.name}-${obj.status}`}
                      onClick={this.onMarkerClick}
                      position={{
                        lat: lat,
                        lng: lng,
                      }}
                    />
                  );
                })}
                <InfoWindow
                  visible={this.state.showTooltip}
                  marker={this.state.activeMarker}
                  onClose={this.onToolTipClose}
                >
                  <div>
                    <Row>
                      <Col>
                        <h6>Warehouse {this.state.selectedMarkerInfo.name}</h6>
                      </Col>
                    </Row>
                    <Row className="justify-content-center">
                      <Col>
                        <Badge
                          color={
                            this.state.selectedMarkerInfo.status === "error"
                              ? "danger"
                              : "success"
                          }
                        >
                          {this.state.selectedMarkerInfo.status}
                        </Badge>
                      </Col>
                    </Row>
                  </div>
                </InfoWindow>
              </Map>
            </div>
          </Col>
          <Col xs="12" md="5">
            <Card height="100%" width="100%">
              <CardBody>
                <Row>
                  <Col md="9">
                    <h2>List of Warehouses</h2>
                  </Col>
                  <Col md="1">
                    <ButtonGroup>
                      <Button color="primary" onClick={this.modalToggle}>
                        Add
                      </Button>
                      <Button color="danger" onClick={this.deleteToggle}>
                        Delete
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Table xs="10" hover={true}>
                  <thead>
                    <tr>
                      {this.state.table_header.map((hr) => {
                        return <th>{hr}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.table_data.map((r) => {
                      return (
                        <tr onClick={(e) => this.handleRowClick(e, r)}>
                          <td>{r[0]}</td>
                          <td>{r[1]}</td>
                          <td>{r[2]}</td>
                          <td>{r[3]}</td>
                          <td>{r[4]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={this.state.deleteModal} toggle={this.deleteToggle}>
          <ModalHeader toggle={this.deleteToggle}>Delete Warehouse</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.deleteWarehouseSubmit}>
              <FormGroup>
                <Label for="exampleEmail">Warehouse Name</Label>
                <Input type="select" name="warehouse_delete">
                  {this.state.table_data.map((ware) => {
                    return <option value={ware[0]}>{ware[0]}</option>;
                  })}
                </Input>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.deleteToggle}>
              Delete
            </Button>{" "}
            <Button color="info" onClick={this.deleteToggle}>
              Back
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modal} toggle={this.modalToggle}>
          <ModalHeader toggle={this.modalToggle}>Add Warehouse</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.addWarehouseSubmit}>
              <FormGroup>
                <Label for="exampleEmail">Warehouse Name</Label>
                <Input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="Name here..."
                />
              </FormGroup>
              <FormGroup>
                <Label>Address</Label>
                <Input name="address" />
                <Row>
                  <Col>
                    <Label>City</Label>
                    <Input name="city" />
                  </Col>
                  <Col>
                    <Label>State</Label>
                    <Input name="address" />
                  </Col>
                  <Col>
                    <Label>Zipcode</Label>
                    <Input name="address" />
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">Schedule(grab every second)</Label>
                <Input
                  type="number"
                  name="email"
                  id="exampleEmail"
                  placeholder="0"
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.modalToggle}>
              Add
            </Button>{" "}
            <Button color="danger" onClick={this.modalToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "",
})(withRouter(Dashboard));
