import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";

import './index.css';

import { logout, selectUser } from '../../features/user_slice';

export const NavBar = () => {

    const [expanded, setExpanded] = useState(false);
    const history = useHistory();

    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const handleLogOut = () => {
        dispatch(logout());
        history.push("/");
    }

    const navDropdownTitle = (<FontAwesomeIcon icon={faUserCircle} className="d-inline-block align-middle" />);

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
                    <NavDropdown expanded={expanded} alignRight title={navDropdownTitle} id="collasible-nav-dropdown">
                        { user ? 
                            <>
                                <Link className="dropdown-item" to="/projects">Your projects</Link>
                                <NavDropdown.Divider />
                                <Link className="dropdown-item" onClick={handleLogOut}>Sign out</Link>
                            </> : 
                                <Link to="/login" className="dropdown-item" onClick={() => setExpanded(!expanded)} >Login</Link>
                        }
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

