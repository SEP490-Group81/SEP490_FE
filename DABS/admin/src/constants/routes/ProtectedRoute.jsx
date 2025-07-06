import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = (
    { allowedRoles }
) => {
    const { token, isInitializing, user } = useSelector((state) => state.auth);
    try {
        if (isInitializing) {
            return <div>...Loading</div>;  // sau dùng skeleton
        }
        // console.log("in priavate Route : " + token);
        // if (!token) {
        //     return <Navigate to="/login" replace />;
        // }
        console.log("allowRoles : " + allowedRoles);
        console.log("user role : " + user.role);

        if (allowedRoles && !allowedRoles.includes(user?.role)) {

            return <Navigate to="/unauthorized" replace />;
        }

        return <Outlet />;
    }
    catch (error) {
        return <Navigate to="/login" replace />;
    };

};

export default ProtectedRoute;
