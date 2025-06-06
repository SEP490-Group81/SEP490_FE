import React from "react";
import { Form, Input, Button, Typography, Card, Space } from "antd";
import { UserOutlined, LockOutlined, HomeOutlined } from "@ant-design/icons";
import logo from "../../assets/images/dabs-logo.png"
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;

function ForgetPassword() {
    const navigate = useNavigate();
    const onFinish = (values) => {
        // handle forget password logic here
        console.log("Received values: ", values);
        // You might want to call an API to send reset email here
    };

    return (
        <Card
            style={{
                width: 400,
                minHeight: 500,
                borderRadius: 16,
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                marginRight: 0,
                zIndex: 2,
                background: "rgba(255,255,255,0.97)",
            }}
        >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <img src={logo} alt="logo" style={{ width: 100, marginBottom: -20 }} />
                <Title level={2} style={{ color: "#1890ff", margin: 0 }}>
                    Quên mật khẩu
                </Title>
                <div style={{ color: "#888" }}>Nhập email để lấy lại mật khẩu</div>
            </div>
            <Form name="forget-password" onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" }
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nhập email"
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
                        Gửi yêu cầu đặt lại mật khẩu
                    </Button>
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/login');
                        }}
                        style={{ color: "#1890ff" }}
                    >
                        Đăng nhập
                    </a>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/login/register');
                        }}
                        style={{ color: "#1890ff" }}
                    >
                        Đăng ký
                    </a>
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
    );
}

export default ForgetPassword;