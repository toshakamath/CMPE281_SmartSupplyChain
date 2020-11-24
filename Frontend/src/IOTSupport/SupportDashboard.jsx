import React from 'react';
import {
    Col, Table, Form,
    FormGroup, Input, Badge,
    Button, Row, Card, CardBody,
  } from 'reactstrap';
import CustomTable from "../common/CustomTable.jsx";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { withRouter } from "react-router-dom";
import customerJson from '../mock_data/customer';

class SupportDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
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
            searchBarValue: "",
            zoom: 14,
            centerLocation: {}
        }
    }

    componentDidMount() {
        const role = localStorage.getItem('user');

        this.grabCustomer();
        this.grabAllWarehouse();
        // grab all warehouse in user's home region and load on map
        // default detailed warehouse is first on the list 
        // run a condition check on role
        // Manager and IOT Support will get table of customer
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
             console.log("Not found");
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
        // marker

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
            pathname: '/support_warehouse',
            state: {
                name: r[0]
            }
        });
    }

    backToCustomer = () => {
        this.grabAllWarehouse();
        this.setState({
            isCustomerView: !this.state.isCustomerView
        });
    }

    onMarkerClick = (props, marker) => {
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
        // e.preventDefault();
        this.setState({
            activeMarker: null,
            showTooltip: false
        });
    }

    // close tooltip if user clicks off the tooltip
    onMapClick = (e) => {
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
                    <Form onSubmit={this.searchWarehouse}>
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
                            <Col md="1" xs="1">
                                <Button color="primary" type="submit">Submit</Button>
                            </Col>
                            { !this.state.isCustomerView ?
                            <Col md="5">
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
                                zoom={this.state.zoom}>
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
                                            <Col md="8">
                                                <h2>List of Warehouses</h2>
                                            </Col>
                                            <Col md="4">
                                            <Button color="info" onClick={this.backToCustomer}>Go Back</Button>
                                        </Col>
                                        </Row>
                                        <CustomTable 
                                            title=""
                                            header={this.state.table_header}
                                            trows={this.state.table_data}
                                            handleRowClick={this.handleWarehouseRowClick}
                                            />
                                        </>
                                }
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("")
  })(withRouter(SupportDashboard));