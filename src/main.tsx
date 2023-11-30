import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './components/root/Root.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import Profile from './components/Profile.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },

  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/register',
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
