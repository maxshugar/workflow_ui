import React from 'react';
import NavBar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav';

export const ReactNav = () => (
  <NavBar expand="lg" bg="dark" variant="dark">
    <NavBar.Brand href="/">Code Flow</NavBar.Brand>
    <NavBar.Toggle aria-controls="basic-navbar-nav"/>
    <NavBar.Collapse>
      <Nav className="ml-auto">
        <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="/dashboard">Dashboard</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href="/editor">Editor</Nav.Link></Nav.Item>
      </Nav>
    </NavBar.Collapse>
  </NavBar>
)