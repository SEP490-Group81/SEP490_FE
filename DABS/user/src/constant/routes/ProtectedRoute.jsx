import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = (
    { allowedRoles }
) => {
    const { accessToken, isInitializing, user } = useSelector((state) => state.user);
    try {
        console.log("user in protected route : " + user?.role.name + " accessToken : " + accessToken);
        if (isInitializing) {
            return <div>...Loading</div>;  // sau dùng skeleton
        }
        // console.log("in priavate Route : " + accessToken);
        // if (!accessToken) {
        //     return <Navigate to="/login" replace />;
        // }
        console.log("allowRoles : " + allowedRoles);
        console.log("user role : " + user.role);

        if (allowedRoles && !allowedRoles.includes(user?.role.name)) {

            return <Navigate to="/unauthorized" replace />;
        }

        return <Outlet />;
    }
    catch (error) {
        return <Navigate to="/login" replace />;
    };

};

export default ProtectedRoute;
