import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import Default from '../assets/default.png';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
export default function Sidebar({
  setShowMotorInput,
  showMotorInput,
}: {
  setShowMotorInput: any;
  showMotorInput: boolean;
}) {
  const user_id = localStorage.getItem('motor_socmed') as string;
  const [image, setImage] = useState('' as string);
  const [user, setUser] = useState({
    address: '',
    birthday: '',
    email: '',
    gender: '',
    name: '',
    password: '',
    profile_picture: '',
    user_id: '',
  });

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

          setImage(res.data[0].profile_picture);
          setUser(res.data[0]);
          console.log(res.data);
        }
      });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('motor_socmed');
    window.location.href = '/login';
  };
  return (
    <div className="flex flex-col h-[80%] justify-between mt-[10rem] fixed left-0 p-5 w-[20rem] z-40 bg-white rounded-lg">
      <div>
        <div className="flex items-center my-4">
          <img
            className="rounded-full w-[4rem] h-[4rem] object-cover cursor-pointer"
            src={image.length > 0 ? image : Default}
            alt=""
          />
          <div>
            <h1 className="font-bold text-2xl">{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>
        <Link to={`/`}>
          <Button className="w-full mb-2">Home</Button>
        </Link>
        <Button
          className="w-full"
          onClick={() => setShowMotorInput(!showMotorInput)}
        >
          {showMotorInput ? 'Close' : 'Post Now'}
        </Button>

        <Link to={`/post/${user_id}`}>
          <Button className="w-full mt-2">Your Posts</Button>
        </Link>
      </div>

      <div className="w-full block">
        <Button onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
}
