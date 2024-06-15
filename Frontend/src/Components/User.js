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
import './userStyle.css';

const User = ({ handleLogout }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [newRoleCode, setNewRoleCode] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const user = JSON.parse(localStorage.getItem('token'));
  const token = user.data.token;

  const headers = {
    'accept': 'application/json',
    'Authorization': token
  };

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    resetUserDetails();
  };
  const handleShow = () => setShow(true);

  const [Name, setName] = useState('');
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [RoleID, setRoleId] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const resetUserDetails = () => {
    setName('');
    setUsername('');
    setPassword('');
    setRoleId('');
    setSelectedUser(null);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users', { headers });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/roles', { headers });
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleCloseCreateRoleModal = () => setShowCreateRoleModal(false);
  const handleShowCreateRoleModal = () => setShowCreateRoleModal(true);

  const createRole = async (e) => {
    e.preventDefault();
    if (!newRoleCode || !newRoleName) {
      Swal.fire({
        text: 'Please enter both role code and role name.',
        icon: 'warning',
      });
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:3001/api/role_reg',
        { RoleCode: newRoleCode, RoleName: newRoleName },
        { headers }
      );
      fetchRoles();
      setNewRoleName('');
      setNewRoleCode('');
      Swal.fire({
        icon: 'success',
        text: 'Role created successfully!',
      });
    } catch (error) {
      console.error('Error creating role:', error);
      Swal.fire({
        text: 'Error creating role',
        icon: 'error',
      });
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    if (!Name || !Username || !Password || !RoleID) {
      Swal.fire({
        text: 'Please fill in all the fields.',
        icon: 'warning',
      });
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/register', { Name, Username, Password, RoleID }, { headers });
      Swal.fire({
        icon: 'success',
        text: response.data.message,
      });
      fetchUsers();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Swal.fire({
          text: error.response.data.message,
          icon: 'error',
        });
      }
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      if (!selectedUser) {
        console.error('No user selected for update');
        return;
      }
      const updatedUserData = {
        Name: Name !== '' ? Name : undefined,
        Username: Username !== '' ? Username : undefined,
        Password: Password !== '' ? Password : undefined,
        RoleID: RoleID !== '' ? RoleID : undefined
      };
      const response = await axios.put(`http://localhost:3001/api/user/${selectedUser.UserID}`, updatedUserData, { headers });
      Swal.fire({
        icon: 'success',
        text: 'User updated successfully!',
      });
      handleClose();
      fetchUsers();
      resetUserDetails();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (UserID) => {
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
        await axios.delete(`http://localhost:3001/api/user/${UserID}`, { headers });
        Swal.fire({
          icon: 'success',
          text: 'Successfully Deleted',
        });
        fetchUsers();
      } catch (error) {
        Swal.fire({
          text: error.response.data.message,
          icon: 'error',
        });
      }
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setName(user.Name);
    setUsername(user.Username);
    setPassword(user.Password);
    setRoleId(user.RoleID);
    handleShow();
  };

// Function to get role name by role ID
const getRoleName = (roleId) => {
  const role = roles.find(role => role.RoleID === roleId);
  return role ? role.RoleName : '';
};



  return (
    <div className="user-container">
      <CustomNavbar user={user} handleLogout={handleLogout} />
      <div className="container">
        <br/>
        <div className='user-button'>
          <Button variant="success" className="create-user-button" onClick={handleShow}>
            Create <br/> User
          </Button>
          {!selectedUser && (
                <Button variant="primary" className="create-role-button" onClick={handleShowCreateRoleModal} block="block">
                  Create <br/> Role
                </Button>
              )}
        </div>
        <Table className='event-table'>
          <thead>
            <tr>
            <th className="event-thead-item">ID</th>
            <th className="event-thead-item">Name</th>
            <th className="event-thead-item">Username</th>
            <th className="event-thead-item">Role</th>
            <th className="event-thead-item">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 && users.slice(0, 10).map((row, key) => (
              <tr key={key}>
                <td className="event-td-user">{row.UserID}</td>
                <td className="event-td-user">{row.Name}</td>
                <td className="event-td-user">{row.Username}</td>
                <td className="event-td-user">{getRoleName(row.RoleID)}</td>
                <td>
                  <Button variant="primary" className="me-2" onClick={() => handleUpdate(row)}>
                    <BsPencil />
                  </Button>
                  <Button variant="danger" onClick={() => deleteUser(row.UserID)}>
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedUser ? 'Update User' : 'Create User'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={selectedUser ? updateUser : createUser}>
              <Row>
                <Col>
                  <Form.Group controlId="Name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={Name} onChange={(event) => { setName(event.target.value) }} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="Username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" value={Username} onChange={(event) => { setUsername(event.target.value) }} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="Password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={Password} onChange={(event) => { setPassword(event.target.value) }} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId="Role">
                    <Form.Label>Role</Form.Label>
                    <Form.Control as="select" value={RoleID} onChange={(event) => { setRoleId(event.target.value) }}>
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.RoleID} value={role.RoleID}>{role.RoleName}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
                <div className="user-save-button">
              <Button variant="primary" type="submit">
                Save
              </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <Modal show={showCreateRoleModal} onHide={handleCloseCreateRoleModal}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Role</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={createRole}>
              <Form.Group controlId="newRoleCode">
                <Form.Label>New Role Code</Form.Label>
                <Form.Control type="text" value={newRoleCode} onChange={(e) => setNewRoleCode(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="newRoleName">
                <Form.Label>New Role Name</Form.Label>
                <Form.Control type="text" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
              </Form.Group>
                <div className='role-button'>
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

export default User;
