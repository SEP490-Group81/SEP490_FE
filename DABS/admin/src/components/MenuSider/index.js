import { Menu } from "antd";
import {
    OrderedListOutlined,
    UserAddOutlined,
    RadarChartOutlined,
    HeatMapOutlined,
    AndroidOutlined,
    UserOutlined,
    DashboardOutlined,
    ReadOutlined,
    UserSwitchOutlined,
    UsergroupAddOutlined,
    ApartmentOutlined,
    ScheduleOutlined,
    TeamOutlined,
    IdcardOutlined,
    CalendarOutlined,
    FormOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { DOCTOR, HOSPITALADMIN, HOSPITALSTAFF, NURSE } from "../../constants/roles/role";

function MenuSider() {
    const user = useSelector((state) => state.user.user);
    const userRole = user?.role?.name;

    console.log("userRole in MenuSider:", userRole);

    const commonItems = [
        {
            key: "home",
            label: <Link to="/">Dashboard</Link>,
            icon: <DashboardOutlined />,
        },
    ];


    const hospitalAdminItems = [
        {
            key: "home",
            label: <Link to="/admin-hospital">Dashboard</Link>,
            icon: <DashboardOutlined />,
        },
        {
            key: "users",
            label: <Link to="/admin-hospital/users">Nhân viên</Link>,
            icon: <TeamOutlined />,
        },
        {
            key: "department-room",
            label: <Link to="/admin-hospital/room-depart-management">Khoa/Phòng ban</Link>,
            icon: <ApartmentOutlined />,
        },
        {
            key: "specialist-management",
            label: <Link to="/admin-hospital/specialist-management">Chuyên khoa</Link>,
            icon: <ReadOutlined />,
        },
        {
            key: "doctor-shift-management",
            label: <Link to="/admin-hospital/doctor-shift-management">Ca làm bác sĩ</Link>,
            icon: <UserSwitchOutlined />,
        },
        {
            key: "staff-shift-management",
            label: <Link to="/admin-hospital/staff-shift-management">Ca làm nhân viên</Link>,
            icon: <UsergroupAddOutlined />,
        },
        {
            key: "nurse-shift-management",
            label: <Link to="/admin-hospital/nurse-shift-management">Ca làm y tá</Link>,
            icon: <ScheduleOutlined />,
        },
    ];

    const doctorItems = [
        {
            key: "home",
            label: <Link to="/doctor">Dashboard</Link>,
            icon: <DashboardOutlined />, 
        },
        {
            key: "profile",
            label: <Link to="/doctor/doctor-profile">Hồ sơ</Link>,
            icon: <IdcardOutlined />, 
        },
        {
            key: "schedule",
            label: <Link to="/doctor/work-schedule">Lịch làm việc</Link>,
            icon: <CalendarOutlined />,
        },
        {
            key: "request-leave",
            label: <Link to="/doctor/request-leave">Xin nghỉ</Link>,
            icon: <FormOutlined />, 
        },
    ];

        const nurseItems = [
        {
            key: "home",
            label: <Link to="/nurse">Dashboard</Link>,
            icon: <DashboardOutlined />, 
        },
    ];

     const staffItems = [
        {
            key: "home",
            label: <Link to="/staff">Dashboard</Link>,
            icon: <DashboardOutlined />, 
        },
    
    ];
    const getMenuItems = (role) => {
        switch (role) {
            case HOSPITALADMIN:
                return hospitalAdminItems;
            case DOCTOR:
                return doctorItems;
            case HOSPITALSTAFF:
                return staffItems;
            case NURSE:
                return nurseItems;
            default:
                return commonItems;
        }
    };

    const items = getMenuItems(userRole);

    return (
        <Menu
            mode="vertical"
            items={items}
        />
    );
}

export default MenuSider;
