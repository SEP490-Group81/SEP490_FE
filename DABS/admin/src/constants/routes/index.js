// import BookRoom from "../Pages/BookRoom";
// import CreateRoom from "../Pages/CreateRoom";
// import Dashboard from "../Pages/Dashboard";
// import ListRoom from "../Pages/ListRoom";
import BlankLayout from "../../components/BlankLayout";
import LayoutCommon from "../../components/LayoutCommon";
import Dashboard from "../../pages/Dashboard";
import DepartmentManagement from "../../pages/DepartmentManagement/DepartmentManagement";
import ErrorPage from "../../pages/Error";
import HospitalDetail from "../../pages/HospitalManagement/HospitalDetail";
import HospitalManagement from "../../pages/HospitalManagement/HospitalManagement";
import Login from "../../pages/Login";
import UserManagement from "../../pages/UserManagement";
import ProtectedRoute from "./ProtectedRoute";

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
        path: '/departments',
        element: <DepartmentManagement />,
      },
      {
        path: "unauthorized",
        element: <ErrorPage />
      },
      {
        path: '/admin/hospitals',
        element: <HospitalManagement />,
        // requireAuth: true,
        // roles: ['admin', 'systemAdmin'],
      },
      {
        path: '/hospital-detail/:id',
        element: <HospitalDetail />,
        // requireAuth: true,
        // roles: ['admin', 'systemAdmin', 'hospitalAdmin'], 
      }
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


