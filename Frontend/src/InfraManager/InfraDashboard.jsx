import React from 'react';
import {
    Col, Table, Form, Label,
    FormGroup, Input, Badge, Button,
    ButtonGroup, Row, Card, CardBody,
    Modal, ModalHeader, ModalBody, ModalFooter
  } from 'reactstrap';
import CustomTable from "../common/CustomTable.jsx";
import { Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { withRouter } from "react-router-dom";
import customerJson from '../mock_data/customer';
import axios from 'axios';

const url = "http://127.0.0.1:4000";

class InfraDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            table_header: ["Name", "Orders", "Location", "Status", "ID"],
            table_data: [],
            showTooltip: {},
            activeMarker: null,
            selectedMarkerInfo: {
                name: "",
                status: "Unknown"
            },
            markerData: [],
            customerTable: [],
            customerHeader: ["Name", "# of Warehouses"],
            isCustomerView: true,
            selectedCustomer: "",
            selectedCustEmail: "",
            deleteModal: false,
            searchBarValue: "",
            zoom: 14,
            centerLocation: {},
            addWarehouseForm: {
                name: "",
                city: "",
                schedule: 1000,
                lng: 0,
                lat: 0
              },
            deleteWarehouse: ""
        }
    }

    componentDidMount() {
        const role = localStorage.getItem('user');
        this.getAllUsers();
        // this.grabAllWarehouse();
        this.getAllWarehouses();
    }

    getAllUsers = () =>{
        console.log("Inside getAllUsers!");
        axios
        .get(`http://localhost:3001/users`)
        .then((res) => {
          console.log("response: ", res.data);
          let cust = []
          res.data.users.forEach((customer) => {
              let size = JSON.parse(customer.warehouse_id)
              console.log(size.length+">>>"+customer);
            let tmp = [customer.name, (JSON.parse(customer.warehouse_id||[]).length)||0, customer.email];
            cust.push(tmp);
            });
            this.setState({
                customerTable: cust
            });
        })
        .catch((err) => {
          console.log("error in getting all users from mysql: ",err);
        });
    }

    addWarehouseSubmit = (e) => {
        // e.preventDefault();
        let form = this.state.addWarehouseForm;
        console.log(this.state.addWarehouseForm);
        axios
          .post(url + "/addwarehouse", {
            name: form.name,
            owner: this.state.selectedCustomer,
            city: form.city,
            longitude: form.lng,
            latitude: form.lat,
            cargoamount: 30,
            schedule: form.schedule * 1000,
            email: this.state.selectedCustEmail
          })
          .then((response) => {
            console.log(response);
            this.getAllWarehouses();
            this.modalToggle(e);
          })
          .catch((error) => {
            console.log(error);
            this.modalToggle(e);
          });
      };

  getAllWarehouses = () => {
    console.log("Inside getAllWarehouses!");
    axios
    .get(`http://localhost:3001/warehouses`)
      .then((res) => {
        console.log("response: ", res.data);
        this.setState({
          markerData: res.data.warehouses,
        });
      })
      .catch((err) => {
        console.log("error in getting all users from mysql: ", err);
      });
  };

    // need list of longitude and latitude to define marker locations
    searchWarehouse = (e) => {
        // search warehouse
        e.preventDefault();
        let loc = {
            lat: -1, 
            lng: -1
        };
        this.state.markerData.forEach((ware) => {
            if ( ware.address.toLowerCase().includes(this.state.searchBarValue.toLowerCase())) {
                // zoom in
                loc = ware.location;
            }
        });
        if (loc.lat < 0) {
             console.log("NOt found");
        } else {
            this.setState({
                zoom: 14,
                centerLocation: loc
            });
        }
    }

    modalToggle = (e) => {
        e.preventDefault();
        this.setState({
            modal: !this.state.modal
        });
    }

    deleteToggle = (e) => {
        e.preventDefault();
        this.setState({
            deleteModal: !this.state.deleteModal
        });
    }

  handleCustomerRowClick = (e, r) => {
    e.preventDefault();
    console.log("Inside handleCustomerRowClick!", r);
    axios
      .get(`http://localhost:3001/warehouse/user/${r[2]}`)
      .then((res) => {
        console.log("warehouses for a user:: ", res.data);
        let customer_data = [];
            customer_data = res.data.warehouses.map((ware) => {
              return [ware.name, ware.cargoamount, ware.city, ware.warehouse_status, ware.warehouse_id];
            });
        this.setState({
          markerData: res.data.warehouses,
          isCustomerView: !this.state.isCustomerView,
            selectedCustomer: r[0],
            selectedCustEmail: r[2],
            table_data: customer_data,
        });
      })
      .catch((err) => {
        console.log("error in getting all users from mysql: ", err);
        this.setState({
            isCustomerView: !this.state.isCustomerView,
            selectedCustomer: r[0],
            selectedCustEmail: r[2]
        });
      });
  }

    handleWarehouseRowClick = (e, r) =>{
        // handle the warehouse row click
        this.props.history.push({
            pathname: '/manager_warehouse',
            state: {
                name: r[0],
                id: r[4]
            }
        });
    }

    backToCustomer = () => {
        this.setState({
            isCustomerView: !this.state.isCustomerView
        });
    }

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
                customer: h[2] ? h[2] : null
            }
        });
    }

    onToolTipClose = (e) => {
        console.log(e);
        // e.preventDefault();
        this.setState({
            activeMarker: null,
            showTooltip: false
        });
    }

    // close tooltip if user clicks off the tooltip
    onMapClick = (e) => {
        console.log(e);
        if (this.state.showTooltip) {
            this.setState({
                activeMarker: null,
                showTooltip: false
            });
        }
    }

    handleSearchChange = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        this.setState({
            searchBarValue: e.target.value
        });
    }

    handleAddWareChange = (e) => {
        let form = this.state.addWarehouseForm;
        form[e.target.name] = e.target.value;
        this.setState({
            addWarehouseForm: form,
        });
    };

    handleDeleteWareChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        });
      };

    deleteWarehouseSubmit = (e) => {
        // e.preventDefault();
        // delete warehouse from the network for the specific customer
        axios
          .post(url + "/removewarehouse", {
            warehouseID: this.state.deleteWarehouse
          })
          .then((response) => {
            console.log(response);
            this.getAllWarehouses();
            this.deleteToggle(e);
          })
          .catch((error) => {
            console.log(error);
            this.deleteToggle(e);
          });
      };

    render () {
        return(
                <div className="pt-2 container-fluid">
                    <Form>
                        <Row>
                            <Col xs="9" md="7">
                                <FormGroup>
                                    <Input name="search" 
                                    id="search"
                                    onChange={this.handleSearchChange}
                                    value={this.state.searchBarValue}
                                    placeholder="Enter a address, zip code or city...." />
                                </FormGroup>
                            </Col>
                            <Col xs="1" md="1">
                                <Button color="primary" onClick={this.searchWarehouse}>Submit</Button>
                            </Col>
                            { !this.state.isCustomerView ?
                            <Col xs="12" md="5">
                                <h2 >Currently Viewing: {this.state.selectedCustomer}</h2>
                            </Col>
                            : null}
                        </Row>
                    </Form>
                    <Row>
                        <Col xs="12" md="7">
                        <div style={{ position: 'relative', width: '100%', height: '80vh' }}>
                            <Map 
                                google={this.props.google} 
                                center={this.state.centerLocation}
                                onClick={this.onMapClick}
                                zoom={14}>
                                {
                                    this.state.markerData.map(
                                        (obj, index) => {
                                            let lat = parseFloat(obj.latitude||"", 10);
                                            let lng = parseFloat(obj.longitude||"", 10);
                                            return(
                                                <Marker
                                                    key={index}
                                                    name={`${obj.name}-${obj.warehouse_status}-${obj.owner}`}
                                                    onClick={this.onMarkerClick}
                                                    position={{
                                                        lat: lat,
                                                        lng: lng
                                                    }}
                                                    />
                                    );})
                                }
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
                                                            {
                                                                this.state.selectedMarkerInfo.customer ?
                                                                <Col>
                                                                    <p>{this.state.selectedMarkerInfo.customer}</p>
                                                                </Col> : null
                                                            }
                                                            <Col>
                                                                <Badge 
                                                                    color={this.state.selectedMarkerInfo.status.toLowerCase() === "active" ? 
                                                                    "success" : "danger"}>
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
                            <Card height='100%' width="100%">
                                <CardBody>
                                { this.state.isCustomerView ? 
                                    <>
                                        <Row>
                                            <Col md="8">
                                                <h2>List of Customers</h2>
                                            </Col>
                                            
                                        </Row> 
                                        <CustomTable 
                                            title=""
                                            header={this.state.customerHeader}
                                            trows={this.state.customerTable}
                                            handleRowClick={this.handleCustomerRowClick}
                                            />
                                    </> :
                                    <>
                                        <Row>
                                            <Col md="7">
                                                <h2>List of Warehouses</h2>
                                            </Col>
                                            <Col md="5">
                                            
                                            <ButtonGroup>
                                                <Button color="primary" onClick={this.modalToggle}>Add</Button>
                                                <Button color="danger" onClick={this.deleteToggle}>Delete</Button>
                                                <Button color="info" onClick={this.backToCustomer}>Back</Button>
                                            </ButtonGroup>
                                        </Col>
                                        </Row>
                                        <Table xs="10" hover={true}>
                                        <thead>
                                        <tr>
                                            {
                                                this.state.table_header.map((hr) => {
                                                    return(
                                                        <th>{hr}</th>
                                                    );
                                                })
                                            }
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.table_data.map((r) => {
                                                    return(
                                                    <tr onClick={(e) => this.handleWarehouseRowClick(e, r)}>
                                                        <td>{r[0]}</td>
                                                        <td>{r[1]}</td>
                                                        <td>{r[2]}</td>
                                                        <td>{r[3]}</td>
                                                        <td>{r[4]}</td>
                                                    </tr>);
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                        </>
                                }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Modal isOpen={this.state.deleteModal} toggle={this.deleteToggle}>
                        <ModalHeader toggle={this.deleteToggle}>Delete Warehouse</ModalHeader>
                        <ModalBody>
                            <Form
                                onChange={this.handleDeleteWareChange}
                                onSubmit={this.deleteWarehouseSubmit}>
                                <FormGroup>
                                    <Label for="exampleEmail">Warehouse Name</Label>
                                    <Input type="select" name="deleteWarehouse">
                                        {
                                            this.state.table_data.map((ware) => {
                                                return(<option value={ware[4]}>{ware[0]}</option>);
                                            })
                                        }
                                    </Input>
                                </FormGroup>
                                <ModalFooter>
                                    <Button color="danger" type="submit">Delete</Button>{' '}
                                    <Button color="primary" onClick={this.deleteToggle}>Cancel</Button>
                                </ModalFooter>
                            </Form>
                        </ModalBody>
                    </Modal>

                    <Modal isOpen={this.state.modal} toggle={this.modalToggle}>
                        <ModalHeader toggle={this.modalToggle}>Add Warehouse</ModalHeader>
                        <ModalBody>
                            <Form
                                onChange={this.handleAddWareChange} 
                                onSubmit={this.addWarehouseSubmit}>
                                <FormGroup>
                                    <Label for="exampleEmail">Warehouse Name</Label>
                                    <Input name="name" id="exampleEmail" placeholder="Name here..." />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Address</Label>
                                    <Input name="address"/>
                                    <Row>
                                        <Col>
                                            <Label>City</Label>
                                            <Input name="city"/>
                                        </Col>
                                        <Col>
                                            <Label>State</Label>
                                            <Input name="address"/>
                                        </Col>
                                        <Col>
                                            <Label>Zipcode</Label>
                                            <Input name="zip_code"/>
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Row>
                                    <Col>
                                        <Label>Longitude</Label>
                                        <Input name="lng" />
                                    </Col>
                                    <Col>
                                        <Label>Latitude</Label>
                                        <Input name="lat" />
                                    </Col>
                                    </Row>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleEmail">Schedule(grab every second)</Label>
                                    <Input
                                    type="number"
                                    name="schedule"
                                    id="exampleEmail"
                                    placeholder="0"
                                    />
                                </FormGroup>
                                <ModalFooter>
                                    <Button color="primary" type="submit">Add</Button>{' '}
                                    <Button color="danger" onClick={this.modalToggle}>Cancel</Button>
                                </ModalFooter>
                            </Form>
                        </ModalBody>
                    </Modal>
                </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("")
  })(withRouter(InfraDashboard));