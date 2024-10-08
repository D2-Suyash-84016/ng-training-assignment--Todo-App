
import React, { useState } from 'react';
import { Button, Card, Modal, Form } from 'react-bootstrap';
import './../Css/Table.css'; // Make sure your CSS has styles for the new layout

const TaskList = () => {
  const [tasks, setTasks] = useState([
    { assignedTo: 'User 1', status: 'Completed', dueDate: '2024-10-12', priority: 'Low', description: 'This task is good' },
    { assignedTo: 'User 2', status: 'In Progress', dueDate: '2024-09-14', priority: 'High', description: 'This task is important' },
    { assignedTo: 'User 3', status: 'Not Started', dueDate: '2024-08-18', priority: 'Low', description: 'This task needs attention' },
    { assignedTo: 'User 4', status: 'In Progress', dueDate: '2024-06-12', priority: 'Normal', description: 'This task is almost done' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    assignedTo: 'User 1',
    status: 'Not Started',
    priority: 'Normal',
    dueDate: '',
    description: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);

  const handleOpenModal = () => {
    setTaskDetails({
      assignedTo: 'User 1',
      status: 'Not Started',
      priority: 'Normal',
      dueDate: '',
      description: '',
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (isEditing && editingTaskIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingTaskIndex] = taskDetails;
      setTasks(updatedTasks);
    } else {
      setTasks([...tasks, taskDetails]);
    }
    handleCloseModal();
  };

  const handleEditTask = (taskIndex) => {
    setTaskDetails(tasks[taskIndex]);
    setIsEditing(true);
    setEditingTaskIndex(taskIndex);
    setShowModal(true);
  };

  const handleDeleteTask = (taskIndex) => {
    const updatedTasks = tasks.filter((_, index) => index !== taskIndex);
    setTasks(updatedTasks);
  };

  return (
    <div>
      <h1>Task List</h1>
      <Button variant="primary" onClick={handleOpenModal} className="mb-4">
        New Task
      </Button>

      <div className="task-list">
        {tasks.map((task, index) => (
          <Card key={index} className={`mb-3 task-card ${task.status.toLowerCase()}`} onClick={() => handleEditTask(index)}>
            <Card.Body>
              <Card.Title>{task.assignedTo}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{task.status}</Card.Subtitle>
              <Card.Text>
                <strong>Due Date:</strong> {task.dueDate}<br />
                <strong>Priority:</strong> {task.priority}<br />
                <strong>Description:</strong> {task.description}
              </Card.Text>
              <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleDeleteTask(index); }}>
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Task' : 'New Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAssignedTo">
              <Form.Label>Assigned To</Form.Label>
              <Form.Control as="select" name="assignedTo" value={taskDetails.assignedTo} onChange={handleChange}>
                <option>User 1</option>
                <option>User 2</option>
                <option>User 3</option>
                <option>User 4</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" name="status" value={taskDetails.status} onChange={handleChange}>
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formDueDate">
              <Form.Label>Due Date</Form.Label>
              <Form.Control type="date" name="dueDate" value={taskDetails.dueDate} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="formPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Control as="select" name="priority" value={taskDetails.priority} onChange={handleChange}>
                <option>Normal</option>
                <option>High</option>
                <option>Low</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {isEditing ? 'Update Task' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskList;
