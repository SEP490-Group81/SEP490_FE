import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { NavLink, Outlet,useLocation } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import {DashboardOutlined,UserOutlined} from '@ant-design/icons';
import { Content, Header } from "antd/es/layout/layout";
import Title from "antd/es/skeleton/Title";

const AdminSystemHeader = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 32, margin: 16, background: "rgba(255, 255, 255, 0.3)" }} />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key="/admin/dashboard" icon={<DashboardOutlined />}>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
          </Menu.Item>
          <Menu.Item key="/admin/users" icon={<UserOutlined />}>
            <NavLink to="/admin/users">Quản lý người dùng</NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
          <Title level={3} style={{ margin: 0 }}>
            Quản trị hệ thống bệnh viện
          </Title>
        </Header>
        <Content style={{ margin: 24, background: "#fff", minHeight: 360 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminSystemHeader;