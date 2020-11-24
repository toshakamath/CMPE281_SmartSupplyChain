import React from 'react';
import {Table,Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import CustomTable from "./common/CustomTable.jsx";

class IndividualSensor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: 1,
            selected_sensor: null
        }
    }
    componentDidMount() {
        // load sensor data
        // calculate number of pages 
        // and separate out history based on pages
    }

    handleRowClick = () => {
        // handle row click
    }

    render() {
        const test = [
            ["11/12/2020-16:15", "71"],
            ["11/12/2020-16:10", "71"],
            ["11/12/2020-16:05", "71"],
            ["11/12/2020-16:00", "69"]
        ];
        const temperature_header = ["Time", "Temperature"];
        return(
            <>
                <h5>Sensor {this.state.selected_sensor}</h5>
                <Table>
                    <tbody>
                        <tr>
                            <th scope="row">Type:</th>
                            <td scope="row">Temperature</td>
                        </tr>
                        <tr>
                            <th scope="row">Status:</th>
                            <td scope="row">Operational</td>
                        </tr>
                    </tbody>
                </Table>
                <h5>History</h5>
                <CustomTable 
                    title="History" 
                    header={temperature_header} 
                    trows={test} 
                    handleRowClick={this.handleRowClick}/>
                <Pagination aria-label="Page navigation example">
                <PaginationItem>
                    <PaginationLink first onClick={()=> {console.log("load first")}}/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink previous />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink >
                    1
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink >
                    2
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink >
                    3
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink next />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink last />
                </PaginationItem>
                </Pagination>
            </>
        );
    }
}

export default IndividualSensor;