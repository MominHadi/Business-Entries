import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = () => {
    let lastLoginTime = localStorage.getItem('lastLoginTime');
    console.log(localStorage.getItem('lastLoginTime'), 'lastTpginTime');

    if (!lastLoginTime) return false;
    lastLoginTime = parseInt(lastLoginTime)
    console.log(lastLoginTime, '7i0komo')
    const currentTime = new Date().getTime();

    const timeDifference = (currentTime - lastLoginTime) / (1000 * 60); // Convert milliseconds to minutes
    console.log(currentTime, timeDifference, 'TimeDiiee')
    return timeDifference < 2 // Check if time difference is less than 5 minutes
  };

  return isAuthenticated() ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
