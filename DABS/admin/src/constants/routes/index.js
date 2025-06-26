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
    element: <LayoutCommon />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/admin/users",
        element:
        //  <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
         // </ProtectedRoute>
        ,
        // requireAuth: true,
        roles: ['admin'],
      },
      {
        path: "unauthorized",
        element: <ErrorPage />
      },
      {
        path: "work-schedule",
        element: <WorkSchedule />
      },
      {
        path: "doctor-profile",
        element: <DoctorProfile />
      },
      //   {
      //     path: "/book-room",
      //     element: <BookRoom />

      //   }
      //   ,
      //   {
      //     path: "/create-room",
      //     element: <CreateRoom />
      //   },
      //   {
      //     path: "/list-room",
      //     element: <ListRoom />
      //   }
    ]
  },
  {
    path: "/login",
    element: <BlankLayout />,
    children: [
      {
        index: true,
        element: <Login />
      }
    ]
  }
];


