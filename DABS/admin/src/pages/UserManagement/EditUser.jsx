import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Spin, notification, Row, Col } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getUserById, updateUser } from '../../services/user';

const { Option } = Select;

const EditUser = ({ visible, record, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (record?.id) {
            fetchUserDetails(record.id);
        }
    }, [record]);

    const fetchUserDetails = async (userId) => {
        setLoading(true);
        try {
            const userData = await getUserById(userId);
            if (userData) {
                form.setFieldsValue({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    username: userData.username,
                    role: userData.role,
                    status: userData.status,
                });
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };

    const success = () => {
        notification.success({
            message: 'Success',
            description: 'User updated successfully!',
            placement: 'topRight',
        });
    };

    const error = () => {
        notification.error({
            message: 'Error',
            description: 'Failed to update user. Please try again.',
            placement: 'topRight',
        });
    };

    const handleSubmit = async (values) => {
        setSpinning(true);
        try {
            // Remove confirmPassword if it exists
            const { confirmPassword, ...updateData } = values;

            // Remove password if empty (user didn't want to change it)
            if (!updateData.password) {
                delete updateData.password;
            }

            const response = await updateUser(record.id, updateData);
            setSpinning(false);

            if (response) {
                success();
                onSuccess();
            } else {
                error();
            }
        } catch (err) {
            setSpinning(false);
            error();
            console.error("Error updating user:", err);
        }
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <EditOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                    Edit User: {record?.firstName} {record?.lastName}
                </div>
            }
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={700}
            className="custom-modal"
        >
            <Spin spinning={spinning || loading}>
                <div className="user-form-container">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            firstName: record?.firstName,
                            lastName: record?.lastName,
                            email: record?.email,
                            username: record?.username,
                            role: record?.role,
                            status: record?.status,
                        }}
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
                            <Input placeholder="Enter username" disabled />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="password"
                                    label="New Password"
                                    rules={[
                                        { min: 6, message: 'Password must be at least 6 characters' }
                                    ]}
                                >
                                    <Input.Password placeholder="Leave blank to keep current password" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    dependencies={['password']}
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!getFieldValue('password') || !value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two passwords do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm new password" />
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
                            <Button type="primary" htmlType="submit" icon={<EditOutlined />}>
                                Update User
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        </Modal>
    );
};

export default EditUser;