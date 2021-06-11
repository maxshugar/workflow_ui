import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, NavItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faListAlt, faSignInAlt, faSignOutAlt, faProcedures, faLaptopCode, faCodeBranch } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux';
import { AuthContext } from "../../_components/app";

import { history } from '../../_helpers';
import './index.css';
import { userActions } from '../../_actions';

export const NavBar = (props) => {
    console.log(props);
    
    const { state, dispatch } = useContext(AuthContext);

    const handleLogOut = () => {
        // dispatch(userActions.logout());
        dispatch({
            type: "LOGOUT"
          });
        history.push("/");
    }

    if(state.user){
        console.log(state.user)
    }

    const profileIconStyle = {
        width: 25,
        height: 25,
        borderRadius: 50 / 2,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "red"
    }

    const accountNavDropdownTitle = state.user ? (<img style={profileIconStyle} src={state.user.avatar_url} alt="Avatar"/>) : (<FontAwesomeIcon icon={faUserCircle} className="d-inline-block align-middle" />);

    return (
        <Navbar bg="light" expand="lg" className="sticky_nav">
            <Navbar.Brand href="/">
                Process Engine{' '}
                <FontAwesomeIcon icon={faCodeBranch} className="d-inline-block ml-2" /> 
                {/* <img
                    src="/logo.png"
                    width="50"
                    height="50"
                    className="d-inline-block align-middle"
                    alt="WorkFlow logo"
                /> */}
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

                    <NavDropdown alignRight title={accountNavDropdownTitle} id="collasible-nav-dropdown">
                        { state.user ? 
                            <>
                                <Link to="/projects" className="dropdown-item">
                                    <FontAwesomeIcon icon={faListAlt} className="d-inline-block align-middle mr-2" /> 
                                    Projects
                                </Link>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogOut}>
                                    <FontAwesomeIcon icon={faSignOutAlt} className="d-inline-block align-middle mr-2" /> 
                                    Sign out
                                </NavDropdown.Item>
                            </> : 
                                <Link to="/login" className="dropdown-item">
                                    <FontAwesomeIcon icon={faSignInAlt} className="d-inline-block align-middle mr-2" /> 
                                    Sign in
                                </Link>
                        }
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

