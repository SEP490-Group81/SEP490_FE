import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Spin, notification, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { createDepartment } from '../../../services/departmentService';

const { Option } = Select;
const { TextArea } = Input;

const AddDepartment = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);

  const success = () => {
    notification.success({
      message: 'Success',
      description: 'Department added successfully!',
      placement: 'topRight',
    });
  };

  const error = () => {
    notification.error({
      message: 'Error',
      description: 'Failed to add department. Please try again.',
      placement: 'topRight',
    });
  };

  const handleSubmit = async (values) => {
    setSpinning(true);
    try {
      const response = await createDepartment(values);
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
      console.error("Error adding department:", err);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PlusOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Add New Department
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="custom-modal"
    >
      <Spin spinning={spinning}>
        <div className="department-form-container">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ status: 'active' }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Department Name"
                  rules={[{ required: true, message: 'Please enter department name' }]}
                >
                  <Input placeholder="Enter department name" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="code"
                  label="Department Code"
                  rules={[{ required: true, message: 'Please enter department code' }]}
                >
                  <Input placeholder="Enter department code (e.g., EM, CD)" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <TextArea 
                placeholder="Enter department description" 
                rows={3}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="headOfDepartment"
                  label="Head of Department"
                  rules={[{ required: true, message: 'Please enter head of department' }]}
                >
                  <Input placeholder="Dr. John Smith" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="location"
                  label="Location"
                  rules={[{ required: true, message: 'Please enter location' }]}
                >
                  <Input placeholder="Building A - Floor 1" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="+1-234-567-8901" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' }
                  ]}
                >
                  <Input placeholder="department@hospital.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="totalStaff"
                  label="Total Staff"
                  rules={[{ required: true, message: 'Please enter total staff' }]}
                >
                  <Input type="number" placeholder="25" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="totalBeds"
                  label="Total Beds"
                  rules={[{ required: true, message: 'Please enter total beds' }]}
                >
                  <Input type="number" placeholder="15" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Please select status' }]}
                >
                  <Select placeholder="Select status">
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="operatingHours"
              label="Operating Hours"
              rules={[{ required: true, message: 'Please enter operating hours' }]}
            >
              <Input placeholder="Mon-Fri: 8AM-6PM or 24/7" />
            </Form.Item>

            <Form.Item className="button-group">
              <Button type="default" onClick={onCancel} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create Department
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default AddDepartment;