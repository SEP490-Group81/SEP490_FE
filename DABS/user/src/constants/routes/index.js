
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../../pages/Login";
import LayoutCommon from "../../components/LayoutCommon";
import Home from "../../pages/Home";
import Register from "../../pages/Register";
import Appointment from "../../pages/Appointment";
import ErrorPage from "../../pages/Error";
export const routes = [
  //public
  {
    path: "/",
    element: <LayoutCommon />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path:"unauthorized",
        element: <ErrorPage />
      },
      {
        path: "job/:id",
        element: (
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <Appointment />
          </ProtectedRoute>
        )
      },
      {
        path: "*",
        element: <Navigate to="/" />
      },
    ]
  },

  // bác sĩ hoặc quản lý nếu phải tách riêng

//   {
//     element: <PrivateRoute />,
//     children: [
//       {
//         element: <LayoutAdmin />,
//         children: [
//           {
//             path: "admin",
//             element: <Dashboard />
//           },
//           {
//             path: "info-company",
//             element: <InfoCompany />
//           },
//           {
//             path: "job-mangage",
//             element: <JobManage />
//           },
//           {
//             path: "create-job",
//             element: <CreateJob />
//           },
//           {
//             path: "detail-job/:id",
//             element: <JobDetailAdmin />
//           },
//           {
//             path: "cv-manage",
//             element: <CVManage />
//           },
//           {
//             path: "detail-cv/:id",
//             element: <CVDetail />
//           },
//         ]
//       }
//     ]
//   }
];

