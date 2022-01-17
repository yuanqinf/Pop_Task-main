import React, { Component } from 'react'
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'
import EmployeeService from './EmployeeService'
// import Selector from 'react-awesome-selector'
// import 'react-awesome-selector/dist/style.css'
// import '../../bootstrap.min.css';
import './Team';

class ListEmployeeComponent extends Component {
    constructor(props) {
        super(props)

        this.addEmployee = this.addEmployee.bind(this);
        //this.deleteMember= props.deleteMember;
    }

    // deleteMember(id){
    // EmployeeService.deleteEmployee(id).then( res => {
    //     this.setState({employees: this.state.employees.filter(employee => employee.id !== id)});
    // });

    // }

    componentDidMount() {
        EmployeeService.getEmployees().then((res) => {
            this.setState({ members: res.data });
        });
    }

    addEmployee() {
        this.props.history.push('/add-employee/_add');
    }

    render() {
        return (
            <div>
                <h2 className="text-center">{this.props.group.name}</h2>
                <div className="row">
                    {/* <Selector
                    data={this.props.group.members}
                    selectedTitle="Cart"
                    getSelected={values => alert(JSON.stringify(values))}
                    /> */}
                    <DropdownButton
                        as={ButtonGroup}
                        key={this.props.group.id}
                        id={`dropdown-variants-${this.props.group.id}`}
                        title='Choose an user'
                    >
                        {
                            this.props.group.members.map(
                                user =>
                                    <React.Fragment>
                                        <Dropdown.Item eventKey="1">{user.firstName}</Dropdown.Item>
                                    </React.Fragment>
                            )
                        }
                    </DropdownButton>
                    <button className="btn btn-primary" onClick={this.addEmployee}>Add Member</button>
                </div>
                <br></br>
                <div className="row">
                    <table className="table table-striped table-bordered">

                        <thead>
                            <tr>
                                <th> First Name</th>
                                <th> Last Name</th>
                                <th> Email</th>
                                <th> Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.group.members.map(
                                    member =>
                                        <tr key={member.id}>
                                            <td> {member.firstName} </td>
                                            <td> {member.lastName}</td>
                                            <td> {member.emailId}</td>
                                            <td>
                                                <button style={{ marginLeft: "10px" }}
                                                    onClick={() => this.props.deleteMember(this.props.group, member.id)}
                                                    className="btn btn-danger">Delete</button>
                                            </td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>

                </div>

            </div>
        )
    }
}

export default ListEmployeeComponent
