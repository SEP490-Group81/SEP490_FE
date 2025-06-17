// import BookRoom from "../Pages/BookRoom";
// import CreateRoom from "../Pages/CreateRoom";
// import Dashboard from "../Pages/Dashboard";
// import ListRoom from "../Pages/ListRoom";
import LayoutCommon from "../../components/LayoutCommon";
import Dashboard from "../../pages/Dashboard";
import UserManagement from "../../pages/UserManagement";

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
        element: <UserManagement />,
        // requireAuth: true,
        roles: ['admin'],
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

  }
];


