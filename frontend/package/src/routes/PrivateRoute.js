  import { Navigate } from "react-router-dom";

  const PrivateRoute = ({ element: Component }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    console.log('Auth Check:', isAuthenticated);

    return isAuthenticated ? <Component /> : <Navigate to="/login" />;
  };

  export default PrivateRoute;
