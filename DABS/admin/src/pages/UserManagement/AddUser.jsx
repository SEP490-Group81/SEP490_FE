import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Spin, notification, Row, Col } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { createUser } from '../../services/userService';

const { Option } = Select;

const AddUser = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);

    const success = () => {
        notification.success({
            message: 'Success',
            description: 'User added successfully!',
            placement: 'topRight',
        });
    };

    const error = () => {
        notification.error({
            message: 'Error',
            description: 'Failed to add user. Please try again.',
            placement: 'topRight',
        });
    };

    const handleSubmit = async (values) => {
        setSpinning(true);
        try {
            const response = await createUser(values);
            setSpinning(false);

            if (response) {
                form.resetFields();
                success();
                onSuccess();
            } else {
                error();
            }
        } catch (err) {
            setSpinning(false);
            error();
            console.error("Error adding user:", err);
        }
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserAddOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    Add New User
                </div>
            }
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={700}
            className="custom-modal"
        >
            <Spin spinning={spinning}>
                <div className="user-form-container">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ status: 'active', role: 'user' }}
                    >
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[{ required: true, message: 'Please enter first name' }]}
                                >
                                    <Input placeholder="Enter first name" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="lastName"
                                    label="Last Name"
                                    rules={[{ required: true, message: 'Please enter last name' }]}
                                >
                                    <Input placeholder="Enter last name" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input placeholder="Enter email" />
                        </Form.Item>

                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[{ required: true, message: 'Please enter username' }]}
                        >
                            <Input placeholder="Enter username" />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[
                                        { required: true, message: 'Please enter password' },
                                        { min: 6, message: 'Password must be at least 6 characters' }
                                    ]}
                                >
                                    <Input.Password placeholder="Enter password" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Please confirm password' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two passwords do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm password" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="role"
                                    label="Role"
                                    rules={[{ required: true, message: 'Please select role' }]}
                                >
                                    <Select placeholder="Select role">
                                        <Option value="admin">Administrator</Option>
                                        <Option value="user">Regular User</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="status"
                                    label="Status"
                                    rules={[{ required: true, message: 'Please select status' }]}
                                >
                                    <Select placeholder="Select status">
                                        <Option value="active">Active</Option>
                                        <Option value="inactive">Inactive</Option>
                                        <Option value="blocked">Blocked</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item className="button-group">
                            <Button type="default" onClick={onCancel} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create User
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        </Modal>
    );
};

export default AddUser;