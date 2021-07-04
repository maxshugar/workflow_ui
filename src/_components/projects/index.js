import React, { useEffect, useState } from "react";
import {
  Container,
  Accordion,
  Card,
  Button,
  ListGroup,
  Modal,
  Form,
} from "react-bootstrap";
import {
  faBoxOpen,
  faEdit,
  faFolderOpen,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { FloatingActionButton } from "../floating_action_button";
import style from "./index.module.css";
import { history } from "../../helpers";
import { useSelector, useDispatch } from "react-redux";
import {
  clearProject,
  deleteProject,
  getAll,
} from "../../features/projectSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);

  const [project, setProject] = useState(null);

  useEffect(() => {
    dispatch(getAll());
  }, []);

  useEffect(() => {
    dispatch(clearProject());
  }, []);

  const handleDelete = () => {
    dispatch(deleteProject(project._id));
    setShowDeleteModal(false);
  };

  const handleEdit = (id) => {
    console.log(id);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [projectName, setProjectName] = useState();

  const handleInputChanged = (event) => {
    setProjectName(event.target.value);
  };

  return (
    <>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this project?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDelete()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rename Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Project name</Form.Label>
              <input
                onChange={(evt) => setProjectName(evt.target.value)}
                type="text"
                class="form-control"
                placeholder="Project name"
                value={projectName}
              />

              {/* <Form.Control
                  onChange={handleInputChanged.bind(this)}
                  type="text"
                  placeholder="Enter project name"
                  value={project && project._id}
                /> */}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="info" onClick={() => handleEdit()}>
            Rename
          </Button>
        </Modal.Footer>
      </Modal>

      <FloatingActionButton
        label="New Project"
        icon={faPlusCircle}
        action={() => {
          history.push("/projects/new");
        }}
      />
      <Container style={{ marginTop: "50px" }}>
        <h1>Projects</h1>

        <ListGroup>
          {projects.data &&
            projects.data.map((project) => (
              <ListGroup.Item
                className={style.project_list_item}
                id={project._id}
                key={project._id}
              >
                <p
                  style={{
                    fontFamily: "myriad_pro_bold",
                    fontSize: "20px",
                    display: "inline-block",
                  }}
                >
                  {project._id}
                </p>
                <Button
                  variant="danger"
                  style={{ float: "right", marginLeft: "10px" }}
                  onClick={() => {
                    setProject(project);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                  <FontAwesomeIcon
                    style={{ marginLeft: "10px" }}
                    icon={faTrash}
                  />
                </Button>
                <Button
                  variant="info"
                  style={{ float: "right", marginLeft: "10px" }}
                  onClick={() => {
                    setProject(project);
                    setProjectName(project._id);
                    setShowEditModal(true);
                  }}
                >
                  Edit Name
                  <FontAwesomeIcon
                    style={{ marginLeft: "10px" }}
                    icon={faEdit}
                  />
                </Button>
                <Button
                  variant="info"
                  style={{ float: "right", marginLeft: "10px" }}
                  onClick={() => history.push(`/projects/${project._id}`)}
                >
                  Open
                  <FontAwesomeIcon
                    style={{ marginLeft: "10px" }}
                    icon={faFolderOpen}
                  />
                </Button>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Container>
    </>
  );
};
