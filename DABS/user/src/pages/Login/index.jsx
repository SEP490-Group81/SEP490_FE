import React from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

function Login() {
    const onFinish = (values) => {
        // handle login logic here
        console.log("Received values: ", values);
    };

    return (
        <div
            style={{
                minHeight: "74.3vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)",
            }}
        >
            <Card
                style={{
                    width: 600,
                    height: 450,
                    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                    borderRadius: 12,
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                   
                    <Title level={2} style={{ margin: "16px 0 0 0", color: "#1890ff" }}>
                        Đăng nhập DABS
                    </Title>
                    <div style={{ color: "#888" }}>Hệ thống bệnh viện</div>
                </div>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
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
                </Form>
            </Card>
        </div>
    );
}

export default Login;