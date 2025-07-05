import React from 'react';
import { Modal, Descriptions, Avatar, Tag, Row, Col, Divider } from 'antd';
import { BankOutlined, UserOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';

const ViewDepartment = ({ visible, record, onCancel }) => {
  if (!record) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BankOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          Department Details: {record.name}
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      className="custom-modal"
    >
      <div style={{ padding: '20px 0' }}>
        {/* Department Header */}
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={<BankOutlined />}
                style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
              />
              <div>
                <Tag 
                  color={getStatusColor(record.status)} 
                  style={{ fontSize: '14px', padding: '4px 12px' }}
                >
                  {record.status?.toUpperCase() || 'N/A'}
                </Tag>
              </div>
            </div>
          </Col>
          <Col span={18}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Department Name" span={2}>
                <strong style={{ fontSize: '16px' }}>{record.name || 'N/A'}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Department Code">
                <Tag color="blue">{record.code || 'N/A'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(record.status)}>
                  {record.status?.toUpperCase() || 'N/A'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {record.description || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider orientation="left">Department Information</Divider>
        
        <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
          <Descriptions.Item 
            label={
              <span>
                <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                Head of Department
              </span>
            }
          >
            {record.headOfDepartment || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <span>
                <EnvironmentOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                Location
              </span>
            }
          >
            {record.location || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <span>
                <PhoneOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                Phone Number
              </span>
            }
          >
            {record.phoneNumber || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item 
            label={
              <span>
                <MailOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                Email
              </span>
            }
          >
            {record.email || 'N/A'}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Statistics & Operations</Divider>
        
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {record.totalStaff || 0}
              </div>
              <div style={{ color: '#8c8c8c' }}>Total Staff</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {record.totalBeds || 0}
              </div>
              <div style={{ color: '#8c8c8c' }}>Total Beds</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fa8c16' }}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Operating Hours
              </div>
              <div style={{ color: '#8c8c8c', marginTop: '8px' }}>
                {record.operatingHours || 'N/A'}
              </div>
            </div>
          </Col>
        </Row>

        <Divider orientation="left">System Information</Divider>
        
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Department ID">
            {record.id || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Created Date">
            {record.createdAt ? formatDate(record.createdAt) : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {record.updatedAt ? formatDate(record.updatedAt) : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default ViewDepartment;