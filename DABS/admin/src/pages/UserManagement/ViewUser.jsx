import React from 'react';
import { Modal, Descriptions, Avatar, Tag, Row, Col, Divider } from 'antd';
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const ViewUser = ({ visible, record, onCancel }) => {
  if (!record) return null;

  const getUserRole = (user) => {
    if (user.role) return user.role;

    const username = user.userName?.toLowerCase();
    if (username.includes('admin')) return 'admin';
    if (username.includes('doctor')) return 'doctor';
    if (username.includes('staff')) return 'staff';
    if (username.includes('hospitaladmin')) return 'hospitalAdmin';
    if (username.includes('systemadmin')) return 'systemAdmin';
    return 'user';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#ff4d4f';
      case 'doctor':
        return '#52c41a';
      case 'staff':
        return '#1890ff';
      case 'hospitalAdmin':
        return '#722ed1';
      case 'systemAdmin':
        return '#faad14';
      default:
        return '#1890ff';
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

  const role = getUserRole(record);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <UserOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          User Details: {record.fullname}
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="custom-modal"
    >
      <div style={{ padding: '20px 0' }}>
        {/* User Avatar and Basic Info */}
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={record.avatarUrl}
                style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
              />
              <div>
                <Tag 
                  color={getRoleColor(role)} 
                  style={{ fontSize: '14px', padding: '4px 12px' }}
                >
                  {role?.toUpperCase() || 'USER'}
                </Tag>
              </div>
            </div>
          </Col>
          <Col span={18}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="Full Name" span={2}>
                <strong>{record.fullname || 'N/A'}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Username">
                {record.userName || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {record.email || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone Number">
                {record.phoneNumber || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={record.active ? 'success' : 'default'}>
                  {record.active ? 'ACTIVE' : 'INACTIVE'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>

        <Divider orientation="left">Account Information</Divider>
        
        <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
          <Descriptions.Item label="User ID">
            {record.id || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Lock Status">
            <Tag color={record.isLocked ? 'error' : 'success'}>
              {record.isLocked ? 'LOCKED' : 'UNLOCKED'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Email Verification">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {record.isVerifiedEmail ? (
                <>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                  <span style={{ color: '#52c41a' }}>Verified</span>
                </>
              ) : (
                <>
                  <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
                  <span style={{ color: '#ff4d4f' }}>Not Verified</span>
                </>
              )}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Phone Verification">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {record.isVerifiedPhone ? (
                <>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                  <span style={{ color: '#52c41a' }}>Verified</span>
                </>
              ) : (
                <>
                  <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
                  <span style={{ color: '#ff4d4f' }}>Not Verified</span>
                </>
              )}
            </span>
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Additional Information</Divider>
        
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Date of Birth">
            {record.dateOfBirth ? formatDate(record.dateOfBirth) : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {record.address || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Created Date">
            {record.createdAt ? formatDate(record.createdAt) : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {record.updatedAt ? formatDate(record.updatedAt) : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Avatar URL">
            {record.avatarUrl ? (
              <a href={record.avatarUrl} target="_blank" rel="noopener noreferrer">
                {record.avatarUrl}
              </a>
            ) : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Modal>
  );
};

export default ViewUser;