import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';

import { history } from '../../_helpers';
import './index.css';
import { userActions } from '../../_actions';

export const NavBar = () => {
    
    const user = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(userActions.getAll());
    // }, []);

    const handleLogOut = () => {
        dispatch(userActions.logout());
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
                    <NavDropdown alignRight title={navDropdownTitle} id="collasible-nav-dropdown">
                        { user ? 
                            <>
                                <Link to="/projects" className="dropdown-item" >Your projects</Link>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogOut}>Sign out</NavDropdown.Item>
                            </> : 
                                <Link to="/login" className="dropdown-item" >Login</Link>
                        }
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

