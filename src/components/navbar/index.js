import React from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import './index.css';

export const NavBar = () => 
 (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">
            WorkFlow{' '}
            <img
            src="/logo.png"
            width="50"
            height="50"
            className="d-inline-block align-middle"
            alt="WorkFlow logo"
        />
            </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/docs">Docs</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

