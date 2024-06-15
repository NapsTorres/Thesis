import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import { BsPlus, BsTrash, BsPencil } from 'react-icons/bs';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomNavbar from './Navbar';
import './eventStyle.css';

const Event = ({ handleLogout }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [user, setUser] = useState(null); // New state to hold user data
  const token = JSON.parse(localStorage.getItem('token')).data.token;

  const headers = {
    'accept': 'application/json',
    'Authorization': token
  };

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    resetEventDetails();
  };
  const handleShow = () => setShow(true);

  const [EventName, setEventName] = useState('');
  const [EventDate, setEventDate] = useState('');
  const [Location, setLocation] = useState('');
  const [MaxStudentsPerDept, setMaxStudentsPerDept] = useState('');
  const [CategoryID, setCategoryID] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchUserData(); // Fetch user data when the component mounts
  }, []);

  const resetEventDetails = () => {
    setEventName('');
    setEventDate('');
    setLocation('');
    setMaxStudentsPerDept('');
    setCategoryID('');
    setSelectedEvent(null);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users', { headers });
      setUser(response.data); // Set the user state with the fetched user data
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/events', { headers });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/categories', { headers });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCloseCreateCategoryModal = () => setShowCreateCategoryModal(false);
  const handleShowCreateCategoryModal = () => setShowCreateCategoryModal(true);

  const createCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName) {
      Swal.fire({
        text: 'Please enter the category name.',
        icon: 'warning',
      });
      return;
    }
    
    // Log the user state to check if it contains the expected data
    console.log("User state:", user);
  
    try {
      const response = await axios.post(
        'http://localhost:3001/api/category_reg',
        { CategoryName: newCategoryName, UserID: user.UserID },
        { headers }
      );
      fetchCategories();
      setNewCategoryName('');
      setShowCreateCategoryModal(false);
      Swal.fire({
        icon: 'success',
        text: 'Category created successfully!',
      });
    } catch (error) {
      console.error('Error creating category:', error);
      Swal.fire({
        text: 'Error creating category',
        icon: 'error',
      });
    }
  };
  

  const createEvent = async (e) => {
    e.preventDefault();
    if (!EventName || !EventDate || !Location || !MaxStudentsPerDept || !CategoryID) {
      Swal.fire({
        text: 'Please fill in all the fields.',
        icon: 'warning',
      });
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/event_reg', { EventName, EventDate, Location, MaxStudentsPerDept, CategoryID }, { headers });
      Swal.fire({
        icon: 'success',
        text: response.data.message,
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      Swal.fire({
        text: error.response.data.message,
        icon: 'error',
      });
    }
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    try {
      if (!selectedEvent) {
        console.error('No event selected for update');
        return;
      }
      const updatedEventData = {
        EventName: EventName !== '' ? EventName : undefined,
        EventDate: EventDate !== '' ? EventDate : undefined,
        Location: Location !== '' ? Location : undefined,
        MaxStudentsPerDept: MaxStudentsPerDept !== '' ? MaxStudentsPerDept : undefined,
        CategoryID: CategoryID !== '' ? CategoryID : undefined
      };
      const response = await axios.put(`http://localhost:3001/api/event/${selectedEvent.EventID}`, updatedEventData, { headers });
      Swal.fire({
        icon: 'success',
        text: 'Event updated successfully!',
      });
      handleClose();
      fetchEvents();
      resetEventDetails();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (EventID) => {
    const isConfirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      return result.isConfirmed;
    });

    if (isConfirm) {
      try {
        await axios.delete(`http://localhost:3001/api/event/${EventID}`, { headers });
        Swal.fire({
          icon: 'success',
          text: 'Event deleted successfully!',
        });
        fetchEvents();
      } catch (error) {
        Swal.fire({
          text: error.response.data.message,
          icon: 'error',
        });
      }
    }
  };

  const handleUpdate = (event) => {
    setSelectedEvent(event);
    setEventName(event.EventName);
    setEventDate(event.EventDate);
    setLocation(event.Location);
    setMaxStudentsPerDept(event.MaxStudentsPerDept);
    setCategoryID(event.CategoryID);
    handleShow();
  };

  return (
    <div className="event-container">
      <CustomNavbar user={user} handleLogout={handleLogout} />
      <div className="container">
        <br />
        <div className="event-button-button">
        {!selectedEvent && (
                  <Button variant="primary" className="category-button-event" onClick={handleShowCreateCategoryModal}>
                    Create Category
                  </Button>
              )}
          <Button variant="success" className="create-event-button" onClick={handleShow}>
            Create <br/> Event
          </Button>
        </div>
        <Table className='event-table'>
          <thead>
            <tr>
              <th className="event-thead-item">Event ID</th>
              <th className="event-thead-item">Event Name</th>
              <th className="event-thead-item">Event Date</th>
              <th className="event-thead-item">Location</th>
              <th className="event-thead-item">Max Students Per Dept</th>
              <th className="event-thead-item">Category</th>
              <th className="event-thead-item">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 && events.slice(0, 10).map((event, key) => (
              <tr key={key}>
                <td className="event-td-user">{event.EventID}</td>
                <td className="event-td-user">{event.EventName}</td>
                <td className="event-td-user">{event.EventDate}</td>
                <td className="event-td-user">{event.Location}</td>
                <td className="event-td-user">{event.MaxStudentsPerDept}</td>
                <td className="event-td-user">{categories.map((category) => {
                    if (category.CategoryID === event.CategoryID) {
                        return category.CategoryName;
                    }
                    return null;
                    })}
                </td>
                <td>
                  <Button variant="primary" className="me-2" onClick={() => handleUpdate(event)}>
                    <BsPencil />
                  </Button>
                  <Button variant="danger" onClick={() => deleteEvent(event.EventID)}>
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton style={{ fontSize: '10px' }}>
          </Modal.Header>
          <Modal.Body className="modal-event-body">
          <h3 className="Modal-event">
              {selectedEvent ? 'Update Event' : 'Create Event'}
            </h3>
            <Form onSubmit={selectedEvent ? updateEvent : createEvent}>
              <Row>
                <Col>
                  <Form.Group controlId="EventName">
                    <Form.Label className="modal-event-label">Event Name</Form.Label>
                    <Form.Control className="modal-event-control" type="text" value={EventName} onChange={(event) => { setEventName(event.target.value) }} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="EventDate">
                    <Form.Label className="modal-event-label">Event Date</Form.Label>
                    <Form.Control className="modal-event-control" type="date" value={EventDate} onChange={(event) => { setEventDate(event.target.value) }} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="Location">
                    <Form.Label className="modal-event-label">Location</Form.Label>
                    <Form.Control className="modal-event-control"  type="text" value={Location} onChange={(event) => { setLocation(event.target.value) }} />
                  </Form.Group>
                </Col>
              </Row>
              <div className="event-max-cat">
                  <Form.Group controlId="MaxStudentsPerDept">
                    <Form.Label className="modal-event-label">Max Students Per Dept</Form.Label>
                    <Form.Control className="event-studDept"  type="number" value={MaxStudentsPerDept} onChange={(event) => { setMaxStudentsPerDept(event.target.value) }} />
                  </Form.Group>
                  <Form.Group controlId="Category">
                    <Form.Label className="modal-event-label">Category</Form.Label>
                    <Form.Control className="event-categ"  as="select" value={CategoryID} onChange={(event) => { setCategoryID(event.target.value) }}>
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.CategoryID} value={category.CategoryID}>
                          {category.CategoryName}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </div>
                <div className='mb-3'></div>
              <div className="save-event-button" block="block">
              <Button variant="primary" type="submit">
                Save
              </Button> 
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showCreateCategoryModal} onHide={handleCloseCreateCategoryModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={createCategory}>
              <Form.Group controlId="newCategoryName">
                <Form.Label>New Category Name</Form.Label>
                <Form.Control type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
              </Form.Group>
              <div className="event-save-button">
              <Button variant="primary" type="submit">
                Save
              </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Event;
