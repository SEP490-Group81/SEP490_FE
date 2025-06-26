import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = (
    { allowedRoles }
) => {
    const { accessToken, isInitializing, user } = useSelector((state) => state.user);
    console.log("user in protected route : " +user?.role.name);
    if (isInitializing) {
        return <div>...Loading</div>;  // sau dùng skeleton
    }
    console.log("in priavate Route : " + accessToken);
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }
    console.log("allowRoles : " + allowedRoles);
    console.log("user role : " + user.role);

    if (allowedRoles && !allowedRoles.includes(user?.role.name)) {

        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
