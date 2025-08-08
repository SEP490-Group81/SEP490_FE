import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Rate,
    Upload,
    Button,
    Row,
    Col,
    message,
    Spin
} from 'antd';
import {
    UploadOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { updateHospital } from '../../../services/hospitalService';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const EditMyHospital = ({ visible, onCancel, onSuccess, hospital }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (visible && hospital) {
            // Populate form with hospital data
            form.setFieldsValue({
                name: hospital.name,
                code: hospital.code,
                type: hospital.type,
                status: hospital.status,
                address: hospital.address,
                city: hospital.city,
                state: hospital.state,
                zipCode: hospital.zipCode,
                country: hospital.country,
                phoneNumber: hospital.phoneNumber,
                email: hospital.email,
                website: hospital.website,
                establishedDate: hospital.establishedDate ? moment(hospital.establishedDate) : null,
                licenseNumber: hospital.licenseNumber,
                totalBeds: hospital.totalBeds,
                totalDepartments: hospital.totalDepartments,
                totalStaff: hospital.totalStaff,
                rating: hospital.rating,
                accreditation: hospital.accreditation,
                adminName: hospital.adminName,
                adminEmail: hospital.adminEmail,
                description: hospital.description,
                services: hospital.services ? hospital.services.join(', ') : ''
            });
        }
    }, [visible, hospital, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            // Transform data for API
            const updateData = {
                id: hospital.id,
                ...values,
                establishedDate: values.establishedDate ? values.establishedDate.toISOString() : null,
                services: values.services ? values.services.split(',').map(s => s.trim()) : []
            };

            console.log('🔄 Updating hospital with data:', updateData);

            const response = await updateHospital(updateData);
            console.log('✅ Hospital updated successfully:', response);

            message.success('Hospital information updated successfully');
            onSuccess(response.result || updateData);

        } catch (error) {
            console.error('❌ Error updating hospital:', error);

            if (error.errorFields) {
                // Form validation errors
                message.error('Please check all required fields');
            } else {
                // API errors
                message.error('Failed to update hospital information');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    const uploadProps = {
        name: 'file',
        action: '/api/upload',
        headers: {
            authorization: 'authorization-text',
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Image must smaller than 2MB!');
            }
            return isImage && isLt2M;
        },
        onChange: (info) => {
            if (info.file.status === 'uploading') {
                setUploading(true);
            }
            if (info.file.status === 'done') {
                setUploading(false);
                message.success(`${info.file.name} file uploaded successfully`);
                // Set logoUrl in form
                form.setFieldsValue({ logoUrl: info.file.response?.url });
            } else if (info.file.status === 'error') {
                setUploading(false);
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <Modal
            title="Edit Hospital Information"
            open={visible}
            onCancel={handleCancel}
            onOk={handleSubmit}
            width={800}
            confirmLoading={loading}
            destroyOnClose
            okText="Update Hospital"
            cancelText="Cancel"
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    preserve={false}
                >
                    {/* Basic Information */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Hospital Name"
                                rules={[
                                    { required: true, message: 'Please enter hospital name' }
                                ]}
                            >
                                <Input placeholder="Enter hospital name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="code"
                                label="Hospital Code"
                            >
                                <Input placeholder="Enter hospital code" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="type"
                                label="Hospital Type"
                                rules={[
                                    { required: true, message: 'Please select hospital type' }
                                ]}
                            >
                                <Select placeholder="Select hospital type">
                                    <Option value="General">General</Option>
                                    <Option value="Specialized">Specialized</Option>
                                    <Option value="Community">Community</Option>
                                    <Option value="Private">Private</Option>
                                    <Option value="Public">Public</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[
                                    { required: true, message: 'Please select status' }
                                ]}
                            >
                                <Select placeholder="Select status">
                                    <Option value="active">Active</Option>
                                    <Option value="inactive">Inactive</Option>
                                    <Option value="pending">Pending</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Contact Information */}
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[
                            { required: true, message: 'Please enter address' }
                        ]}
                    >
                        <Input placeholder="Enter full address" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="city"
                                label="City"
                            >
                                <Input placeholder="Enter city" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="state"
                                label="State/Province"
                            >
                                <Input placeholder="Enter state" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="zipCode"
                                label="ZIP Code"
                            >
                                <Input placeholder="Enter ZIP code" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                            >
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { type: 'email', message: 'Please enter valid email' }
                                ]}
                            >
                                <Input placeholder="Enter email" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="website"
                                label="Website"
                            >
                                <Input placeholder="Enter website URL" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Additional Information */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="establishedDate"
                                label="Established Date"
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Select date"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="licenseNumber"
                                label="License Number"
                            >
                                <Input placeholder="Enter license number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="totalBeds"
                                label="Total Beds"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Enter total beds"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="totalDepartments"
                                label="Total Departments"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Enter total departments"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="totalStaff"
                                label="Total Staff"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: '100%' }}
                                    placeholder="Enter total staff"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="rating"
                                label="Rating"
                            >
                                <Rate allowHalf />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="accreditation"
                                label="Accreditation"
                            >
                                <Input placeholder="Enter accreditation" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Admin Information */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="adminName"
                                label="Admin Name"
                            >
                                <Input placeholder="Enter admin name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="adminEmail"
                                label="Admin Email"
                                rules={[
                                    { type: 'email', message: 'Please enter valid email' }
                                ]}
                            >
                                <Input placeholder="Enter admin email" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Logo Upload */}
                    <Form.Item
                        name="logoUrl"
                        label="Hospital Logo"
                    >
                        <Upload {...uploadProps}>
                            <Button
                                icon={uploading ? <LoadingOutlined /> : <UploadOutlined />}
                                loading={uploading}
                            >
                                Upload Logo
                            </Button>
                        </Upload>
                    </Form.Item>

                    {/* Description */}
                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Enter hospital description"
                        />
                    </Form.Item>

                    {/* Services */}
                    <Form.Item
                        name="services"
                        label="Services (comma separated)"
                    >
                        <TextArea
                            rows={2}
                            placeholder="Emergency Care, Surgery, Cardiology, Pediatrics..."
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default EditMyHospital;