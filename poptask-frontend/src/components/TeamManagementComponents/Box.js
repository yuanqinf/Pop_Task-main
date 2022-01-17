import React from 'react'
import { Navbar } from 'react-bootstrap';
import ListEmployeeComponent from './ListEmployeeComponent';

export default function Box(props) {

    return (
        <ListEmployeeComponent key={props.key} group={props.group} deleteMember={(group, member) => props.deleteMember(group, member)} />
    )
}
