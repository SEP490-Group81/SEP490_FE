import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Avatar,
  Tag,
  Descriptions,
  Tabs,
  Button,
  Rate,
  Statistic,
  Spin,
  message
} from 'antd';
import {
  ArrowLeftOutlined,
  MedicineBoxOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { getHospitalById } from '../../services/hospitalService';
import { useSelector } from 'react-redux';
import './HospitalDetail.scss';

const { TabPane } = Tabs;

const HospitalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');

  // Get user role for permission check
  const user = useSelector((state) => state.user.user);
  const userRole = user?.role || 'user';

  useEffect(() => {
    fetchHospitalDetail();
  }, [id]);

  const fetchHospitalDetail = async () => {
    setLoading(true);
    try {
      const data = await getHospitalById(id);
      if (data) {
        setHospital(data);
      } else {
        message.error('Hospital not found');
        navigate('/hospitals');
      }
    } catch (error) {
      console.error('Error fetching hospital detail:', error);
      message.error('Failed to load hospital details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Check if user is hospital admin, redirect to appropriate page
    if (userRole === 'hospitalAdmin') {
      navigate('/dashboard'); // or their specific dashboard
    } else {
      navigate('/admin/hospitals');
    }
  };

  const handleEdit = () => {
    // Only system admin can edit from this page
    if (userRole === 'admin' || userRole === 'systemAdmin') {
      navigate(`/hospitals/edit/${id}`);
    }
  };

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

  const getTypeColor = (type) => {
    switch (type) {
      case 'General':
        return 'blue';
      case 'Specialized':
        return 'purple';
      case 'Community':
        return 'green';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!hospital) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h3>Hospital not found</h3>
      </div>
    );
  }

  return (
    <div className="hospital-detail-container">
      {/* Header */}
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Card className="hospital-header-card">
            <Row justify="space-between" align="middle">
              <Col>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBack}
                  style={{ marginRight: 16 }}
                >
                  Back
                </Button>
              </Col>
              <Col>
                {(userRole === 'admin' || userRole === 'systemAdmin') && (
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                  >
                    Edit Hospital
                  </Button>
                )}
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Hospital Overview */}
        <Col span={24}>
          <Card className="hospital-overview-card">
            <Row gutter={24}>
              <Col xs={24} md={6}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar
                    size={120}
                    icon={<MedicineBoxOutlined />}
                    src={hospital.logoUrl}
                    style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
                  />
                  <div>
                    <Tag color={getTypeColor(hospital.type)} style={{ fontSize: '14px', padding: '4px 12px' }}>
                      {hospital.type}
                    </Tag>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Tag color={getStatusColor(hospital.status)} style={{ fontSize: '12px' }}>
                      {hospital.status?.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={18}>
                <Row gutter={[0, 16]}>
                  <Col span={24}>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                      {hospital.name}
                    </h1>
                    <p style={{ fontSize: '16px', color: '#8c8c8c', margin: '8px 0' }}>
                      Code: {hospital.code} | License: {hospital.licenseNumber}
                    </p>
                    <div style={{ marginBottom: 16 }}>
                      <Rate disabled value={hospital.rating} style={{ fontSize: '16px' }} />
                      <span style={{ marginLeft: 8, fontSize: '16px', fontWeight: 'bold' }}>
                        {hospital.rating}/5.0
                      </span>
                      <Tag color="gold" style={{ marginLeft: 8 }}>
                        {hospital.accreditation}
                      </Tag>
                    </div>
                  </Col>

                  <Col span={24}>
                    <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                      {hospital.description}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Statistics */}
        <Col span={24}>
          <Row gutter={16}>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Total Beds"
                  value={hospital.totalBeds}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Departments"
                  value={hospital.totalDepartments}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Total Staff"
                  value={hospital.totalStaff}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={6}>
              <Card>
                <Statistic
                  title="Rating"
                  value={hospital.rating}
                  precision={1}
                  valueStyle={{ color: '#faad14' }}
                  suffix="/ 5.0"
                />
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Detailed Information Tabs */}
        <Col span={24}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Basic Information" key="1">
                <Row gutter={24}>
                  <Col xs={24} lg={12}>
                    <Descriptions title="Contact Information" column={1} bordered>
                      <Descriptions.Item
                        label={<><PhoneOutlined style={{ marginRight: 8 }} />Phone</>}
                      >
                        {hospital.phoneNumber}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={<><MailOutlined style={{ marginRight: 8 }} />Email</>}
                      >
                        {hospital.email}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={<><GlobalOutlined style={{ marginRight: 8 }} />Website</>}
                      >
                        <a href={hospital.website} target="_blank" rel="noopener noreferrer">
                          {hospital.website}
                        </a>
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={<><EnvironmentOutlined style={{ marginRight: 8 }} />Address</>}
                      >
                        {hospital.address}<br />
                        {hospital.city}, {hospital.state} {hospital.zipCode}<br />
                        {hospital.country}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>

                  <Col xs={24} lg={12}>
                    <Descriptions title="Administrative Information" column={1} bordered>
                      <Descriptions.Item label="Administrator">
                        {hospital.adminName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Admin Email">
                        {hospital.adminEmail}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={<><CalendarOutlined style={{ marginRight: 8 }} />Established</>}
                      >
                        {formatDate(hospital.establishedDate)}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={<><SafetyCertificateOutlined style={{ marginRight: 8 }} />License Number</>}
                      >
                        {hospital.licenseNumber}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Services" key="2">
                <Row gutter={16}>
                  <Col span={24}>
                    <h3>Available Services</h3>
                    <div style={{ marginTop: 16 }}>
                      {hospital.services?.map((service, index) => (
                        <Tag
                          key={index}
                          color="blue"
                          style={{ margin: '4px', padding: '4px 12px', fontSize: '14px' }}
                        >
                          {service}
                        </Tag>
                      ))}
                    </div>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="Statistics" key="3">
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        title="Total Beds"
                        value={hospital.totalBeds}
                        valueStyle={{ color: '#3f8600', fontSize: '32px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        title="Departments"
                        value={hospital.totalDepartments}
                        valueStyle={{ color: '#1890ff', fontSize: '32px' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card>
                      <Statistic
                        title="Total Staff"
                        value={hospital.totalStaff}
                        valueStyle={{ color: '#cf1322', fontSize: '32px' }}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>

              <TabPane tab="System Information" key="4">
                <Descriptions column={2} bordered>
                  <Descriptions.Item label="Hospital ID">
                    {hospital.id}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hospital Code">
                    {hospital.code}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created Date">
                    {formatDate(hospital.createdAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    {formatDate(hospital.updatedAt)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={getStatusColor(hospital.status)}>
                      {hospital.status?.toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Type">
                    <Tag color={getTypeColor(hospital.type)}>
                      {hospital.type}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HospitalDetail;