import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.css';
import CustomNavbar from './Navbar';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = JSON.parse(localStorage.getItem('token'));
        const decoded_token = jwtDecode(response.data.token);
        setUser(decoded_token);
      } catch (error) {
        navigate("/login");
      }
    };
    
    fetchUser();
  }, []);

  return (
    <>
      <CustomNavbar user={user} />
      {/* Your other content */}
    </>
  );
}

export default Dashboard;
