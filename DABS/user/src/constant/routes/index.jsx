import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../../pages/Login";
import LayoutCommon from "../../components/LayoutCommon";
import Home from "../../pages/Home";
import Register from "../../pages/Register";
import Appointment from "../../pages/Appointment";
import ErrorPage from "../../pages/Error";
import BlankLayout from "../../components/BlankLayout";
import ForgetPassword from "../../pages/ForgetPassword";
import NewPassword from "../../pages/NewPassword";
import UserAccount from "../../pages/UserAccount/Detail";
import ChangePassword from "../../pages/UserAccount/ChangePassword";
import HomeUserNavBar from "../../pages/UserProfile/HomeUser/HomeUserNavBar";
import UserProfile from "../../pages/UserProfile/HomeUser/Page/UserProfile";
import UserNotification from "../../pages/UserProfile/HomeUser/Page/UserNotification";
import UserMedicalForm from "../../pages/UserProfile/HomeUser/Page/UserMedicalForm";
import UpadteProfile from "../../pages/UserProfile/Update";
import HospitalList from "../../pages/Hospital/HospitalList";
import PatientRecords from "../../pages/HealthRecords"; // Thêm import cho component mới

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
        path: "account",
        element:
          // <ProtectedRoute allowedRoles={['user']}>
          <UserAccount />
        // </ProtectedRoute>
      },
      {
        path: "change-password",
        element: <ChangePassword />
      },
      {
        path: "hospital/:id",
        element: (
          <Appointment />
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
        path: "user",
        element: <HomeUserNavBar />,
        children: [
          {
            index: true,
            element: <UserProfile />
          },
          {
            path: "user-notification",
            element: <UserNotification />
          },
          {
            path: "user-medical-forms",
            element: <UserMedicalForm />
          }
        ]
      },
      {
        path: "health-records", // Thêm route mới cho hồ sơ bệnh nhân
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

