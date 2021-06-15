import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../../../helpers";
import { create, clearProject } from "../../../features/projectSlice";

export const NewProject = (props) => {
  const dispatch = useDispatch();

  const [projectName, setProjectName] = useState();

  const user = useSelector((state) => state.user.user);
  const project = useSelector((state) => state.project.project);

  const handleCreate = (e) => {
    e.preventDefault();
    dispatch(
      create({
        accessToken: user.data.accessToken,
        name: projectName,
        ownerId: user.data.login,
      })
    );
  };

  const handleInputChanged = (event) => {
    setProjectName(event.target.value);
  };

  useEffect(() => {
    if (project.data) {
      dispatch(clearProject());
      history.push(`/projects/${project.data._id}`);
    }
  }, [project]);

  return (
    <>
      <div style={{ marginTop: "60px" }}>
        <Container style={{ padding: "0px 300px" }}>
          <h1>New Project</h1>
          <Form>
            <Form.Group>
              <Form.Label>Project name</Form.Label>
              <Form.Control
                onChange={handleInputChanged.bind(this)}
                type="text"
                placeholder="Enter project name"
              />
            </Form.Group>
            <Button
              onClick={handleCreate.bind(this)}
              variant="primary"
              type="Create project"
            >
              Submit
            </Button>
          </Form>
        </Container>
      </div>
    </>
  );
};
