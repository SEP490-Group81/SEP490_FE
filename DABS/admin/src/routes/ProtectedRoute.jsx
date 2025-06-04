import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = (
    {allowedRoles}, 
    { element },
    {user}
) => {
    const { token, isInitializing } = useSelector((state) => state.auth);

    if (isInitializing) {
        return null; // Hoặc hiển thị một spinner trong lúc chờ khởi tạo
    }
    console.log("in priavate Route : "+ token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return element;
};

export default PrivateRoute;
