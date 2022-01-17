import React from 'react'
import Container from 'react-bootstrap/Container';
import {Nav, NavDropdown, Navbar} from 'react-bootstrap';
import TeamMember from './TeamMember';
import '../sideNav.css';


export default function Team(props) {

    const memberList = []
    for (const member of props.members) {
        memberList.push(<TeamMember key={member} member={member}/>)
    }
    return (
        <Navbar bg="light" expand="lg"> 
        <Container>
            
            <Navbar.Collapse id="navbarScroll">        
            <Nav className="ml-auto">
                <NavDropdown title={props.name} className="ml-5 mt-10 text-l text-blue-500">
                    {memberList}
                </NavDropdown>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}
