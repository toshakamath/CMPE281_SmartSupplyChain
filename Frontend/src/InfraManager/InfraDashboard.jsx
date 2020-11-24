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

class InfraDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            table_header: ["Name", "Orders", "Location", "Status"],
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
            deleteModal: false,
            searchBarValue: "",
            zoom: 14,
            centerLocation: {}
        }
    }

    componentDidMount() {
        const role = localStorage.getItem('user');
        this.grabCustomer();
        this.grabAllWarehouse();
    }

    grabAllWarehouse = () => {
        let warehouses = []
        customerJson.forEach((customer) => {
            let tmp = customer.warehouses.map((ware) => {
                ware.customer = customer.name;
                return ware;
            });
            console.log(tmp);
            warehouses = warehouses.concat(tmp);
        });
        this.setState({
            markerData: warehouses
        });
    }

    // need list of longitude and latitude to define marker locations
    searchWarehouse = (e) => {
        // search warehouse
        e.preventDefault();
        let loc = {
            lat: -1, 
            lng: -1
        };
        this.state.markerData.forEach((ware) => {
            if (this.state.searchBarValue === ware.state ) {
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

    grabCustomer = () =>  {
        let cust = []
        customerJson.forEach((customer) => {
            let tmp = [customer.name, customer.warehouses.length];
            cust.push(tmp);
        });
        this.setState({
            customerTable: cust
        });
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
        // handle clicking a row
        // condition check to see if row is for individual warehouse or for everything
        // clicking orders won't do anything

        // setup table
        let customer_data = [];
        customerJson.forEach((customer) => {
            if (customer.name === r[0]) {
                customer_data = customer.warehouses.map((ware) => {
                    return [ware.name, ware.orders, ware.state, ware.status];
                });
            }
        });

        //setup customer markers
        let customer_marker = [];
        customerJson.forEach((customer) => {
            if (customer.name === r[0]) {
                customer_marker = customer.warehouses.map((ware) => {
                    return ware;
                });
            }
        });

        this.setState({
            isCustomerView: !this.state.isCustomerView,
            selectedCustomer: r[0],
            table_data: customer_data,
            markerData: customer_marker
        });
    }

    handleWarehouseRowClick = (e, r) =>{
        // handle the warehouse row click
        this.props.history.push({
            pathname: '/manager_warehouse',
            state: {
                name: r[0]
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
                                            let lat = parseFloat(obj.location.lat, 10);
                                            let lng = parseFloat(obj.location.lng, 10);
                                            return(
                                                <Marker
                                                    key={index}
                                                    name={`${obj.name}-${obj.status}-${obj.customer}`}
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
                                                                    color={this.state.selectedMarkerInfo.status === "error" ? 
                                                                    "danger" : "success"}>
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
                                                <Button color="info" onClick={this.backToCustomer}>Go Back</Button>
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
                            <Form onSubmit={this.deleteWarehouseSubmit}>
                                <FormGroup>
                                    <Label for="exampleEmail">Warehouse Name</Label>
                                    <Input type="select" name="warehouse_delete">
                                        {
                                            this.state.table_data.map((ware) => {
                                                return(<option value={ware[0]}>{ware[0]}</option>);
                                            })
                                        }
                                    </Input>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={this.deleteToggle}>Delete</Button>{' '}
                            <Button color="primary" onClick={this.deleteToggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={this.state.modal} toggle={this.modalToggle}>
                        <ModalHeader toggle={this.modalToggle}>Add Warehouse</ModalHeader>
                        <ModalBody>
                            <Form onSubmit={this.addWarehouseSubmit}>
                                <FormGroup>
                                    <Label for="exampleEmail">Warehouse Name</Label>
                                    <Input type="email" name="email" id="exampleEmail" placeholder="Name here..." />
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
                                            <Input name="address"/>
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.modalToggle}>Add</Button>{' '}
                            <Button color="danger" onClick={this.modalToggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("")
  })(withRouter(InfraDashboard));