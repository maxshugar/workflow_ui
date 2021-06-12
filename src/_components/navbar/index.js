import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, NavItem } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faListAlt,
  faSignInAlt,
  faSignOutAlt,
  faCodeBranch,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";

import { history } from "../../helpers";
import "./index.css";
import store from "../../helpers/store";
import { logout } from "../../features/userSlice";

export const NavBar = (props) => {
  console.log(props);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const handleLogOut = () => {
    // dispatch(userActions.logout());
    dispatch(logout());
    history.push("/");
  };

  const profileIconStyle = {
    width: 25,
    height: 25,
    borderRadius: 50 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "red",
  };

  const accountNavDropdownTitle = user ? (
    <img
      style={profileIconStyle}
      src={user.data.avatar_url}
      alt="Avatar"
    />
  ) : (
    <FontAwesomeIcon
      icon={faUserCircle}
      className="d-inline-block align-middle"
    />
  );

  return (
    <Navbar bg="light" expand="lg" className="sticky_nav">
      <Navbar.Brand href="/">
        Process Engine{" "}
        <FontAwesomeIcon icon={faCodeBranch} className="d-inline-block ml-2" />
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

          <NavDropdown
            alignRight
            title={accountNavDropdownTitle}
            id="collasible-nav-dropdown"
          >
            {user ? (
              <>
                <Link to="/projects" className="dropdown-item">
                  <FontAwesomeIcon
                    icon={faListAlt}
                    className="d-inline-block align-middle mr-2"
                  />
                  Projects
                </Link>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogOut}>
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="d-inline-block align-middle mr-2"
                  />
                  Sign out
                </NavDropdown.Item>
              </>
            ) : (
              <Link to="/login" className="dropdown-item">
                <FontAwesomeIcon
                  icon={faSignInAlt}
                  className="d-inline-block align-middle mr-2"
                />
                Sign in
              </Link>
            )}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
