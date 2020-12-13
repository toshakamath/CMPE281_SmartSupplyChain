import React from 'react';
import { Table } from 'reactstrap';

  class CustomTable extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
              rows_array: []
          }
      }

      componentDidMount() {
          // loop through props and convert to rows
      }

      render() {
          return(
              <div>
                <h3>{this.props.title}</h3>    
                <Table xs="10" hover={true}>
                    <thead>
                    <tr>
                        {
                            this.props.header.map((hr) => {
                                return(
                                    <th>{hr}</th>
                                );
                            })
                        }
                    </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.trows.map((r) => {
                                return(
                                <tr onClick={(e) => this.props.handleRowClick(e, r)}>
                                    <td>{r[0]}</td>
                                    <td>{r[1]}</td>
                                </tr>);
                            })
                        }
                    </tbody>
                </Table>
            </div>
          );
      }

  }

  export default CustomTable;