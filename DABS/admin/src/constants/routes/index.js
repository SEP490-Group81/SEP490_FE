// import BookRoom from "../Pages/BookRoom";
// import CreateRoom from "../Pages/CreateRoom";
// import Dashboard from "../Pages/Dashboard";
// import ListRoom from "../Pages/ListRoom";
import BlankLayout from "../../components/BlankLayout";
import LayoutCommon from "../../components/LayoutCommon";
import Dashboard from "../../pages/Admin/Dashboard";
import ErrorPage from "../../pages/Error";
import Login from "../../pages/Login";
import UserManagement from "../../pages/Admin/UserManagement";
import ProtectedRoute from "./ProtectedRoute";
import WorkSchedule from "../../pages/Doctor/WorkSchedule";

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
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
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


