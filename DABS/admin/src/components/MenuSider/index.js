import { Menu } from "antd";
import { OrderedListOutlined, UserAddOutlined, RadarChartOutlined, HeatMapOutlined, AndroidOutlined, UserOutlined, HomeOutlined, DashboardOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
function MenuSider() {
    const items = [
        {
            key: "home",
            label: <Link to="/">Dashboard</Link>,
            icon: <DashboardOutlined />
        },
        {
            key: "menu-1",
            label: "Menu 1",
            icon: <RadarChartOutlined />,
            children: [
                {
                    key: "child-1",
                    label: "Menu 1",
                    icon: <RadarChartOutlined />
                },
                {
                    key: "child-2",
                    label: "Menu 2",
                    icon: <RadarChartOutlined />
                },
                {
                    key: "child-3",
                    label: "Menu-3",
                    icon: <RadarChartOutlined />
                }
            ]
        },
        {
            key: "menu-2",
            label: "Menu 2",
            icon: <HeatMapOutlined />
        },
        {
            key: "book-room",
            label: <Link to="/book-room">Book Room</Link>,
            icon: <AndroidOutlined />
        },
        {
            key: "create-room",
            label: <Link to="/create-room">Create Room</Link>,
            icon: <UserAddOutlined />
        },
        {
            key: "list-room",
            label: <Link to="/list-room">List Room</Link>,
            icon: <OrderedListOutlined />
        },
        {
            key: "user-management",
            label: <Link to="/admin/users">User Management</Link>,
            icon: <UserOutlined />
        },
    ];
    return (
        <>
            <Menu
                mode="vertical"
                items={items}
            />
        </>
    )
}

export default MenuSider;