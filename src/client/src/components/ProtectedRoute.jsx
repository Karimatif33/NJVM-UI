import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAdmin, ...rest }) => {
  if (isAdmin === true) {
    // User is an admin, allow access
    return element;
  } else {
    // User is not an admin, redirect to another page
    return <Navigate to="/unauthorized" />;
  }
};

export default ProtectedRoute;
