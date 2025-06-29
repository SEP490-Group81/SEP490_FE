import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../../pages/Login";
import Home from "../../pages/Home";
import Register from "../../pages/Register";
import Appointment from "../../pages/Appointment";
import ErrorPage from "../../pages/Error";
import ForgetPassword from "../../pages/ForgetPassword";
import NewPassword from "../../pages/NewPassword";
import UserAccount from "../../pages/UserAccount/Detail";
import ChangePassword from "../../pages/UserAccount/ChangePassword";
import UpadteProfile from "../../pages/UserProfile/Update";
import HospitalList from "../../pages/Hospital/HospitalList";
import HospitalDetail from "../../pages/Hospital/HospitalDetail";
import PatientRecords from "../../pages/HealthRecords"; // Thêm import cho component mới

import BlankLayout from "../../components/BlankLayout";
import LayoutCommon from "../../components/LayoutCommon";
import ChatPage from "../../components/ChatBox/ChatPage";
import BookingHistoryPage from "../../pages/BookingHistory/BookingHistoryPage";
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
        path: "unauthorized",
        element: <ErrorPage />
      },
      {
        path: "profile",
        element: <UpadteProfile />
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
      {
        path: "booking-history",
        element: <ProtectedRoute allowedRoles={['Patient']} />,
        children: [
          {
            path: "",
            element: <BookingHistoryPage />
          }
        ]
      },
      {
        path: "account",
        element: <ProtectedRoute allowedRoles={['Patient']} />,
        children: [
          {
            path: "",
            element: <UserAccount />,
          },
        ],
      },
      {
        path: "change-password",
        element: <ChangePassword />
      },
      {
        //path: "hospital/:id",
        path: "hospital-detail",
        element: (
          <HospitalDetail />
        )
      },
      {
        path: "hospital-list",
        element: <HospitalList />
      },
      {
        path: "appointment",
        element: <Appointment />
      },
      {
        path: "*",
        element: <Navigate to="/" />
      },
      {
        path: "health-records",
        element: <PatientRecords />
      },
    ]

  },
  {
    path: "/login",
    element: <BlankLayout />,
    children: [
      {
        index: true,
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "forget-password",
        element: <ForgetPassword />
      },
      {
        path: "new-password",
        element: <NewPassword />
      },
    ]
  }
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

