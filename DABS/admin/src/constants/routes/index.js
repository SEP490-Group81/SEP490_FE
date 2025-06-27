// import BookRoom from "../Pages/BookRoom";
// import CreateRoom from "../Pages/CreateRoom";
// import Dashboard from "../Pages/Dashboard";
// import ListRoom from "../Pages/ListRoom";
import BlankLayout from "../../components/BlankLayout";
import LayoutCommon from "../../components/LayoutCommon";
import Dashboard from "../../pages/AdminHospital/Dashboard";
import ErrorPage from "../../pages/Error";
import Login from "../../pages/Login";
import UserManagement from "../../pages/AdminHospital/UserManagement";
import ProtectedRoute from "./ProtectedRoute";
import WorkSchedule from "../../pages/Doctor/WorkSchedule";
import DoctorProfile from "../../pages/Doctor/DoctorProfile";

export const routes = [
  {
    path: "/",
    element: <BlankLayout />,
    children: [
      {
        index: true, 
        element: <Login />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "unauthorized",
        element: <ErrorPage />
      },
    ],
  },
  {
    path: "/admin",
    element: <LayoutCommon />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "users",
        element:
          //  <ProtectedRoute allowedRoles={['admin']}>
          <UserManagement />
        // </ProtectedRoute>
        ,
        // requireAuth: true,

      },
    ]
  },
  {
    path: "/doctor",
    element: <LayoutCommon />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: "work-schedule",
        element: <WorkSchedule />
      },
      {
        path: "doctor-profile",
        element: <DoctorProfile />
      },
    ]
  },

];


