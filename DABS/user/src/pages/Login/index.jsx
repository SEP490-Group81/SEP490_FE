import React from "react";
import { Form, Input, Button, Typography, Card, Space } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import logo from "../../assets/images/dabs-logo.png"
import loginBg from "../../assets/images/login-bgr.png";
import loginDoctor from "../../assets/images/doctor-login.png";
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

function Login() {
    const navigate = useNavigate();
    const onFinish = (values) => {
        // handle login logic here
        console.log("Received values: ", values);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                background: `url(${loginBg}) center/cover no-repeat`,
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#e0f7fa",
            }}
        >
            <Space direction="horizontal" size={10}>
                <div
                    style={{
                        width: 400, 
                        height: 500,
                        overflow: "hidden",
                        borderRadius: 16,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                        marginRight: 0,
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <img
                        src={loginDoctor}
                        alt="doctor"
                        style={{
                            height: 500,
                            marginLeft: -175,
                        }}
                    />
                </div>
                <Card
                    style={{
                        width: 400,
                        height: 500,
                        borderRadius: 16,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                        marginRight: 0,
                        zIndex: 2,
                        background: "rgba(255,255,255,0.97)",
                    }}
                >
                    <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <img src={logo} alt="logo" style={{ width: 100, marginBottom: -20,marginTop: -40  }} />
                        <Title level={2} style={{ color: "#1890ff", margin: 0 }}>
                            Đăng nhập DABS
                        </Title>
                        <div style={{ color: "#888" }}>Hệ thống bệnh viện</div>
                    </div>
                    <Form name="login" onFinish={onFinish} layout="vertical">
                        <Form.Item
                            name="username"
                            label="Tên đăng nhập"
                            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Nhập tên đăng nhập"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Nhập mật khẩu"
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                style={{ borderRadius: 6, background: "#1890ff" }}
                            >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <a style={{ color: "#1890ff" }}>Quên mật khẩu?</a>
                            <a style={{ color: "#1890ff" }}>Đăng ký</a>
                        </div>
                    </Form>
                    <Button
                        type="link"
                        onClick={() => navigate('/')}
                        icon={<HomeOutlined />}
                        style={{ marginTop: 24, color: "#1890ff", paddingLeft: 0 }}
                        block
                    >
                        Quay về trang chính
                    </Button>
                </Card>
            </Space>
        </div>
    );
}

export default Login;