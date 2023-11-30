import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Pro from '@/assets/pro.jpg';
export default function Header() {
  const [user, setUser] = useState([]);
  const [name, setName] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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
        <img
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="rounded-full w-[3rem] h-[3rem] object-cover cursor-pointer"
          src={Pro}
          alt=""
        />

        {showProfileMenu && (
          <div className="absolute border-2 w-[10rem] right-[5rem] flex flex-col justify-center items-center bg-white rounded-md p-2">
            <Link to="/profile">
              <p>Profile</p>
            </Link>

            <Link to="/profile">
              <p>Profile</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
