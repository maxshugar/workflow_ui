import React from 'react';
import { Navbar,Nav,NavDropdown,Form,FormControl,Button } from 'react-bootstrap'

export const NavBar = () => 
 (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">WorkFlow Environment</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/docs">Docs</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

