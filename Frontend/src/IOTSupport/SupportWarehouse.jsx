import React from 'react';
import {
    Col, Row, Card, CardBody, CardTitle,
    Container, Pagination, PaginationItem, PaginationLink
  } from 'reactstrap';
import CustomTable from "../common/CustomTable.jsx";
import { ResponsiveContainer,LineChart, Line, 
        XAxis, YAxis, CartesianGrid } from 'recharts';
import { Link } from "react-router-dom";
import customerJson from '../mock_data/customer.js';


class SupportWarehouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            warehouseId: this.props.location.state ?
            this.props.location.state.warehouseId : null,
            warehouseName: this.props.location.state ?
            this.props.location.state.name : null,
            chart_data: [],
            addSensorModal: false,
            manageSensorModal: false,
            manageOrderModal: false,
            isOpen: false,
            addSensor : {
                sensorType: "temperature"
            },
            individualSensorId: null
        }
    }

    componentDidMount() {
        // console.log(this.props.location.state.warehouseId);
        console.log(this.state.warehouseId);
        // make call to grab all sensor data from the selected warehouse
        // default detailed warehouse is first on the list 
    }

    orderTablePagination(index) {
        // organize order table pagination
        const pageCount = Math.ceil(customerJson[0].warehouses[0].sensor[index].history.length / this.state.perPage);
        const pages = [];
        let cnt = 1;
        while (pageCount >= cnt) {
            pages.push(<PaginationItem>
                <PaginationLink >
                        {cnt}
                </PaginationLink>
            </PaginationItem>);
            cnt += 1;
        }
        return pages;
    }

    grabAllSensor() {
        // call individual warehouse for all sensors
    }

    handleRowClick = (e, r) => {
        // handle clicking a row
        console.log(e.target, r);
        // condition check to see if row is for individual warehouse or for everything
        // clicking orders won't do anything
    }

    render() {
        const pages = [1, 2, 3];
        return(
            <Container className="pb-5" fluid={true}>
                <Row className="justify-content-md-center pt-4 pb-4">
                    <Col md="2">
                    <h2>Warehouse {this.state.warehouseName}</h2>
                    </Col>
                    <Col md="2">
                        <Link className="btn btn-info" to="/">Go Back</Link>
                    </Col>
                </Row>
                <Row>
                {
                        customerJson[0].warehouses[0].sensor.map((sen, index) => {
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
                                let tmp = {"name": "", "generic": ""};
                                let x = dt[0].split("-");
                                tmp.name = x[1];
                                tmp.generic = dt[1];
                                chart_data.push(tmp);
                            });
                            
                            return(
                                <Col className="pb-4" xs="auto" md="4">
                                    <Card width="100%">
                            <CardBody>
                                <CardTitle tag="h5">{sen.name}</CardTitle>
                                <ResponsiveContainer width='100%' height={300}>
                                    <LineChart  data={chart_data}>
                                        <Line type="monotone" dataKey="generic" stroke="#8884d8" />
                                        <CartesianGrid stroke="#ccc" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={range}/>
                                    </LineChart>
                                </ResponsiveContainer>
                                <CustomTable 
                                    title="History" 
                                    header={header} 
                                    trows={sen.history} 
                                    handleRowClick={this.handleRowClick}/>
                                <Pagination>
                                    <PaginationItem>
                                        <PaginationLink first/>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink previous />
                                    </PaginationItem>
                                    {
                                        this.orderTablePagination(index)
                                    }
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
                            );
                        })
                    }
                </Row>
            </Container>
        );
    }
}

export default SupportWarehouse;