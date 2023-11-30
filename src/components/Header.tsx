import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Pro from '@/assets/pro.jpg';
import { MainContext } from './context/useMainContext';

export default function Header() {
  const [user, setUser] = useState([]);
  const [name, setName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { showMessage, setShowMessage } = useContext(MainContext);

  const fetchUserDetails = () => {
    axios
      .get(`${import.meta.env.VITE_MOTOR_MARKETPLACE}/user.php`, {
        params: {
          user_id: localStorage.getItem('motor_socmed'),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log('success');
          setUser(res.data[0]);
          setName(res.data[0].name);
          console.log(res.data);
        }
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('motor_socmed');
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="fixed top-0 flex justify-between items-center h-[7rem] bg-white w-full p-4 border-b-2">
      <div className="p-2">
        <h1 className="text-2xl font-bold">Hello, {name}</h1>
        <p className="text-sm">
          Welcome to Motor Connections where you can flex you motorcylce
        </p>
      </div>

      <div className="relative">
        <div className="flex gap-5 items-center">
          <Button onClick={() => setShowMessage(!showMessage)}>Message</Button>
          <img
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="rounded-full w-[3rem] h-[3rem] object-cover cursor-pointer"
            src={Pro}
            alt=""
          />
        </div>

        {showProfileMenu && (
          <div className="absolute border-2 w-[10rem] right-[5rem] flex flex-col justify-center items-center bg-white rounded-md p-2">
            <Link to="/profile">
              <p>Profile</p>
            </Link>

            <Link to="/profile">
              <p>Profile</p>
            </Link>

            <p className="cursor-pointer" onClick={handleLogout}>
              Logout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
