import React, { useState } from 'react';
import { Modal, Form, Input, Select, Row, Col, Button, Spin, message, TimePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createHospital } from '../../../services/hospitalService';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const AddHospital = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [spinning, setSpinning] = useState(false);

    const handleSubmit = async (values) => {
        setSpinning(true);
        try {
            console.log('🚀 Form values:', values);
            
            // ✅ Transform data to match API schema
            const hospitalData = {
                code: values.code,
                name: values.name,
                address: values.address,
                image: values.image || '',
                googleMapUri: values.googleMapUri || '',
                banner: values.banner || '',
                type: parseInt(values.type), // Convert to number
                phoneNumber: values.phoneNumber,
                email: values.email,
                openTime: values.openTime ? values.openTime.toISOString() : null,
                closeTime: values.closeTime ? values.closeTime.toISOString() : null
            };

            console.log('📤 Sending hospital data:', hospitalData);
            
            const response = await createHospital(hospitalData);

            setSpinning(false);
            if (response) {
                form.resetFields();
                message.success('Hospital created successfully!');
                onSuccess();
            } else {
                message.error('Failed to create hospital');
            }
        } catch (err) {
            setSpinning(false);
            console.error("❌ Error creating hospital:", err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error ||
                               err.message || 
                               'Failed to create hospital. Please try again.';
            message.error(errorMessage);
        }
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PlusOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                    Add New Hospital
                </div>
            }
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={900}
            className="custom-modal"
        >
            <Spin spinning={spinning}>
                <div className="hospital-form-container">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            type: 1, // Default to General Hospital
                            openTime: dayjs('08:00', 'HH:mm'),
                            closeTime: dayjs('18:00', 'HH:mm')
                        }}
                    >
                        {/* Basic Information */}
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="name"
                                    label="Hospital Name"
                                    rules={[{ required: true, message: 'Please enter hospital name' }]}
                                >
                                    <Input placeholder="City General Hospital" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="code"
                                    label="Hospital Code"
                                    rules={[{ required: true, message: 'Please enter hospital code' }]}
                                >
                                    <Input placeholder="CGH001" />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Type and Contact */}
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="type"
                                    label="Hospital Type"
                                    rules={[{ required: true, message: 'Please select hospital type' }]}
                                >
                                    <Select placeholder="Select type">
                                        <Option value={1}>General Hospital</Option>
                                        <Option value={2}>Specialized Hospital</Option>
                                        <Option value={3}>Community Hospital</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="phoneNumber"
                                    label="Phone Number"
                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                >
                                    <Input placeholder="+84-123-456-789" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Please enter email' },
                                        { type: 'email', message: 'Please enter valid email' }
                                    ]}
                                >
                                    <Input placeholder="contact@hospital.com" />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Address */}
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true, message: 'Please enter address' }]}
                        >
                            <Input placeholder="123 Main Street, District 1, Ho Chi Minh City" />
                        </Form.Item>

                        {/* Operating Hours */}
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="openTime"
                                    label="Opening Time"
                                    rules={[{ required: true, message: 'Please select opening time' }]}
                                >
                                    <TimePicker 
                                        style={{ width: '100%' }}
                                        format="HH:mm"
                                        placeholder="Select opening time"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="closeTime"
                                    label="Closing Time"
                                    rules={[{ required: true, message: 'Please select closing time' }]}
                                >
                                    <TimePicker 
                                        style={{ width: '100%' }}
                                        format="HH:mm"
                                        placeholder="Select closing time"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Media URLs */}
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="image"
                                    label="Hospital Logo/Image URL"
                                >
                                    <Input placeholder="https://example.com/hospital-logo.png" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="banner"
                                    label="Banner Image URL"
                                >
                                    <Input placeholder="https://example.com/hospital-banner.png" />
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Google Maps */}
                        <Form.Item
                            name="googleMapUri"
                            label="Google Maps Embed URI"
                        >
                            <TextArea 
                                rows={3}
                                placeholder="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
                            />
                        </Form.Item>

                        {/* Action Buttons */}
                        <Form.Item className="button-group">
                            <Button type="default" onClick={onCancel} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create Hospital
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        </Modal>
    );
};

export default AddHospital;