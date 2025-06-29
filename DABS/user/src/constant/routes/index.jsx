import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../../pages/UserAccount/Login";
import Home from "../../pages/Home";
import Register from "../../pages/UserAccount/Register";
import ErrorPage from "../../pages/Error";
import UserAccount from "../../pages/UserAccount/Detail";
import ChangePassword from "../../pages/UserAccount/ChangePassword";
import UpadteProfile from "../../pages/UserProfile/Update";
import HospitalList from "../../pages/Hospital/HospitalList";
import HospitalDetail from "../../pages/Hospital/HospitalDetail";
import PatientRecords from "../../pages/HealthRecords"; // Thêm import cho component mới

import BlankLayout from "../../components/BlankLayout";
import LayoutCommon from "../../components/LayoutCommon";
import NewPassword from "../../pages/UserAccount/ForgetPassword/NewPassword";
import ForgetPassword from "../../pages/UserAccount/ForgetPassword";
import DoctorDetail from "../../pages/Doctor/doctorDetail";
import VerifyEmailRegisterAuto from "../../pages/UserAccount/Register/VerifyEmailRegisterAuto";
import VerifyEmailRegisterNotice from "../../pages/UserAccount/Register/VerifyEmailRegisterNotice";
import VerifyEmailForgetAuto from "../../pages/UserAccount/ForgetPassword/VerifyEmailForgetAuto";
import VerifyEmailForgetNotice from "../../pages/UserAccount/ForgetPassword/VerifyEmailForgetNotice";
import AppointmentSchedule from "../../pages/Appointment/Schedule";
import AppointmentService from "../../pages/Appointment/Service";
import AppointmentSpecialty from "../../pages/Appointment/Specialty";
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
        path: "doctor-detail",
        element: <DoctorDetail />
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
          {
            path: "change-password",
            element: <ChangePassword />
          },
        ],
      },

      {
        path: "hospital-detail/:hospitalId",
        element: (
          <HospitalDetail />
        )
      },
      {
        path: "hospital-list",
        element: <HospitalList />
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
        path: "new-password",
        element: <NewPassword />
      },
      {
        path: "forget-password",
        element: <ForgetPassword />
      },
    ]
  },
  {
    path: "/appointment",
    element: <LayoutCommon />,
    children: [
      {
        index: true,
        element: <AppointmentService />
      },
      {
        path: "schedule",
        element: <AppointmentSchedule />
      },
      {
        path: "specialty",
        element: <AppointmentSpecialty />
      }
    ]
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      {
        path: "verify-email",
        element: <VerifyEmailRegisterAuto />
      },
      {
        path: "verify-email-notice",
        element: <VerifyEmailRegisterNotice />
      },
       {
        path: "reset-password/verify-code",
        element: <VerifyEmailForgetAuto />
      },
      {
        path: "reset-password/verify-email-notice",
        element: <VerifyEmailForgetNotice />
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

