import { Outlet, useLocation } from 'react-router-dom';

import App from '@/App';
import Header from '../Header';

export default function Root() {
  const location = useLocation();

  const isLogin = localStorage.getItem('motor_socmed');

  if (!isLogin) {
    return (window.location.href = '/login');
  }

  return (
    <div className="w-full border-2 relative">
      <div className="flex border-2">
        <div className="w-full px-2">
          {location.pathname === '/' ? <App /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}
