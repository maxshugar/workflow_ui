import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap'
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../features/user_slice';

export const NavBar = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();


    const handleLogOut = () => {
        dispatch(logout());
        window.location = "/";
    }

    return (
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
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                    <Link to="/docs" className="nav-link">
                        Docs
                    </Link>
                    { user ? 
                    <>
                        <Link to="/projects" className="nav-link">Projects</Link>
                        <Nav.Link className="nav-link" onClick={handleLogOut}>Logout</Nav.Link> </> :
                        <Link to="/login" className="nav-link">Login</Link>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

