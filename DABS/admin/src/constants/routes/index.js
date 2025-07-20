// import BookRoom from "../Pages/BookRoom";
// import CreateRoom from "../Pages/CreateRoom";
// import Dashboard from "../Pages/Dashboard";
// import ListRoom from "../Pages/ListRoom";
import BlankLayout from "../../components/BlankLayout";
import LayoutCommon from "../../components/LayoutCommon";
import DepartmentManagement from "../../pages/AdminHospital/DepartmentManagement/DepartmentManagement";
import ErrorPage from "../../pages/Error";
import HospitalDetail from "../../pages/AdminHospital/HospitalManagement/HospitalDetail";
import Login from "../../pages/Login";
import UserManagement from "../../pages/AdminHospital/UserManagement";
import ProtectedRoute from "./ProtectedRoute";
import WorkSchedule from "../../pages/Doctor/WorkSchedule";
import DoctorProfile from "../../pages/Doctor/DoctorProfile";
import DoctorHome from "../../pages/Doctor/DoctorHome";
import HospitalStaffHome from "../../pages/HospitalStaff/StaffHome";
import NurseHome from "../../pages/Nurse/NurseHome";
import AdminHospitalHome from "../../pages/AdminHospital/AdminHospitalHome";
import AdminSystem from "../../pages/AdminSystem/DashBoard";
import AdminSystemHeader from "../../components/LayoutCommon/admin-system-header";
import DoctorRequestLeave from "../../pages/Doctor/DoctorRequestLeave";
import AdminDoctorShiftManagement from "../../pages/AdminHospital/DoctorShiftManagement";
import NurseShiftManagement from "../../pages/AdminHospital/NurseShiftManagement";
import StaffShiftManagement from "../../pages/AdminHospital/StaffShiftManagement";
import ManageRoom from "../../pages/AdminHospital/RoomManagement";
import ManageSpecialist from "../../pages/AdminHospital/SpecialistManagement";
import HospitalManagement from "../../pages/AdminHospital/HospitalManagement/HospitalManagement";
import AppointmentOverview from "../../pages/Nurse/NurseHome/AppointmentOverview/AppointmentOverview";
import ReviewFeedback from "../../pages/HospitalStaff/ReviewFeedback/ReviewFeedback";
import MedicalServiceManagement from "../../pages/AdminHospital/MedicalServiceManagement";
import LeaveRequestManagement from "../../pages/AdminHospital/LeaveRequestManagement";
import HospitalStatisticPage from "../../pages/AdminHospital/HospitalStatisticPage";
import NurseProfile from "../../pages/Nurse/NurseProfile";
import WorkScheduleNurse from "../../pages/Nurse/WorkSchedule";
import StaffProfile from "../../pages/HospitalStaff/StaffProfile";
import AdjustBookingSchedule from "../../pages/Nurse/AdjustAppointmentSchedule";
import StaffPaymentConfirmation from "../../pages/HospitalStaff/StaffPaymentAdjust/ConfirmPayment";
import StaffUnpaidBookingList from "../../pages/HospitalStaff/StaffPaymentAdjust/UnpaidBookingList";


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
    path: "/admin-hospital",
    element: <LayoutCommon />,
    children: [
      {
        index: true,
        element: <AdminHospitalHome />
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
      {
        path: "doctor-shift-management",
        element:
          <AdminDoctorShiftManagement />
      },
      {
        path: "nurse-shift-management",
        element:
          <NurseShiftManagement />
      },
      {
        path: "staff-shift-management",
        element:
          <StaffShiftManagement />
      },
      {
        path: "room-management",
        element:
          <ManageRoom />
      },
      {
        path: "specialist-management",
        element:
          <ManageSpecialist />
      },
      {
        path: 'hospital-detail/:id',
        element: <HospitalDetail />,
        // requireAuth: true,
        // roles: ['admin', 'systemAdmin', 'hospitalAdmin'], 
      },
      {
        path: 'departments',
        element: <DepartmentManagement />,
      },
      {
        path: 'hospitals',
        element: <HospitalManagement />,
      },
      {
        path: "medical-service-management",
        element:
          <MedicalServiceManagement />
      },
      {
        path: "leave-request-management",
        element:
          <LeaveRequestManagement />
      },
      {
        path: "hospital-statistic",
        element:
          <HospitalStatisticPage />
      },
    ]
  },
  {
    path: "/doctor",
    element: <LayoutCommon />,
    children: [
      {
        index: true,
        element: <DoctorHome />
      },
      {
        path: "work-schedule",
        element: <WorkSchedule />
      },
      {
        path: "profile",
        element: <DoctorProfile />
      },
      {
        path: "request-leave",
        element: <DoctorRequestLeave />,
      }
    ]
  },
  {
    path: "/staff",
    element: <LayoutCommon />,
    children: [
      {
        index: true,
        element: <HospitalStaffHome />
      },
      {
        path: 'review-feedback',
        element: <ReviewFeedback />,
      },
      {
        path: "staff-profile",
        element: <StaffProfile />
      },
      {
        path: "payment-confirm",
        element: <StaffPaymentConfirmation />
      },
        {
        path: "payment-list",
        element: <StaffUnpaidBookingList />
      },
    ]
  },
  {
    path: "/nurse",
    element: <LayoutCommon />,
    children: [
      {
        index: true,
        element: <NurseHome />
      },
      {
        path: 'appointment',
        element: <AppointmentOverview />,
      },

      {
        path: "profile",
        element: <NurseProfile />
      },
      {
        path: "work-schedule",
        element: <WorkScheduleNurse />
      },
      {
        path: "adjust-appointment-schedule",
        element: <AdjustBookingSchedule />
      },
    ]
  },
  {
    path: "/admin-system",
    element: <AdminSystemHeader />,
    children: [
      {
        index: true,
        element: <AdminSystem />
      },
      {
        path: 'hospitals',
        element: <HospitalManagement />,
      },
      {
        path: 'hospital-detail/:id',
        element: <HospitalDetail />,
        // requireAuth: true,
        // roles: ['admin', 'systemAdmin', 'hospitalAdmin'], 
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
];


