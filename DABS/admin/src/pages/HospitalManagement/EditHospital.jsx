import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Button, Spin, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { updateHospital } from '../../services/hospitalService';

const { Option } = Select;
const { TextArea } = Input;

const EditHospital = ({ visible, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (record && visible) {
      form.setFieldsValue({
        ...record,
        establishedDate: record.establishedDate ? record.establishedDate.split('T')[0] : ''
      });
    }
  }, [record, visible, form]);

  const handleSubmit = async (values) => {
    setSpinning(true);
    try {
      const response = await updateHospital(record.id, values);
      
      setTimeout(() => {
        setSpinning(false);
        if (response) {
          message.success('Hospital updated successfully!');
          onSuccess();
        } else {
          message.error('Failed to update hospital');
        }
      }, 1000);
    } catch (err) {
      setSpinning(false);
      message.error('Error updating hospital');
      console.error("Error updating hospital:", err);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          Edit Hospital: {record?.name}
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
          >
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

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="type"
                  label="Hospital Type"
                  rules={[{ required: true, message: 'Please select hospital type' }]}
                >
                  <Select placeholder="Select type">
                    <Option value="General">General</Option>
                    <Option value="Specialized">Specialized</Option>
                    <Option value="Community">Community</Option>
                  </Select>
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

              <Col xs={24} md={8}>
                <Form.Item
                  name="establishedDate"
                  label="Established Date"
                  rules={[{ required: true, message: 'Please enter established date' }]}
                >
                  <Input type="date" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input placeholder="123 Main Street" />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input placeholder="New York" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: 'Please enter state' }]}
                >
                  <Input placeholder="NY" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="zipCode"
                  label="Zip Code"
                  rules={[{ required: true, message: 'Please enter zip code' }]}
                >
                  <Input placeholder="10001" />
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
                  <Input placeholder="+1-555-0123" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
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

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="adminName"
                  label="Administrator Name"
                  rules={[{ required: true, message: 'Please enter administrator name' }]}
                >
                  <Input placeholder="Dr. John Smith" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="adminEmail"
                  label="Administrator Email"
                  rules={[
                    { required: true, message: 'Please enter administrator email' },
                    { type: 'email', message: 'Please enter valid email' }
                  ]}
                >
                  <Input placeholder="admin@hospital.com" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="totalBeds"
                  label="Total Beds"
                  rules={[{ required: true, message: 'Please enter total beds' }]}
                >
                  <Input type="number" placeholder="500" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="totalDepartments"
                  label="Total Departments"
                  rules={[{ required: true, message: 'Please enter total departments' }]}
                >
                  <Input type="number" placeholder="15" />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="totalStaff"
                  label="Total Staff"
                  rules={[{ required: true, message: 'Please enter total staff' }]}
                >
                  <Input type="number" placeholder="800" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea 
                rows={3} 
                placeholder="Brief description of the hospital..." 
              />
            </Form.Item>

            <Form.Item className="button-group">
              <Button type="default" onClick={onCancel} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update Hospital
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default EditHospital;