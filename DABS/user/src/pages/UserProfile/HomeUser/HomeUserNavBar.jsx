import { Outlet } from "react-router-dom";
import { CalendarOutlined, MailOutlined, RightOutlined } from "@ant-design/icons";
import { Menu } from "antd";
function HomeUserNavBar() {

    const items = [
        {
            key: '1',
            icon: <MailOutlined />,
            label: 'Navigation One',
        },
        {
            key: '2',
            icon: <CalendarOutlined />,
            label: 'Navigation Two',
        },
        {
            key: '3',
            icon: <CalendarOutlined />,
            label: 'Navigation Three',
        },

    ];
    return (
        <div>
            <div>
                <h3 style={{marginLeft: '200px'}}>Trang chủ <RightOutlined /> </h3>
            </div>
            <div style={{ display: 'flex', gap: '300px', marginTop: '50px', marginBottom: '100px', justifyContent: 'center' }}>
                <div>
                    <Menu
                        style={{ width: 200 }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        items={items}
                    />
                </div>
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default HomeUserNavBar;