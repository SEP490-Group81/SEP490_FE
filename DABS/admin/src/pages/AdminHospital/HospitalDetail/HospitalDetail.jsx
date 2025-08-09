import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Tag,
    Avatar,
    Statistic,
    Descriptions,
    Spin,
    message,
    Typography,
    Space,
    Rate,
    Badge,
    Table,
    Tooltip
} from 'antd';
import {
    EditOutlined,
    PhoneOutlined,
    MailOutlined,
    GlobalOutlined,
    ClockCircleOutlined,
    HomeOutlined,
    UserOutlined,
    MedicineBoxOutlined,
    TeamOutlined,
    BankOutlined,
    SafetyOutlined,
    StarOutlined,
    EnvironmentOutlined,
    DollarOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getHospitalById } from '../../../services/hospitalService';
import { setMessage } from '../../../redux/slices/messageSlice';
import EditHospital from './EditHospitalDetail';
import './HospitalDetail.scss';

const { Title, Text } = Typography;

const MyHospital = () => {
    const [hospital, setHospital] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const user = useSelector((state) => state.user?.user);
    const dispatch = useDispatch();

    // Get hospital ID from user data
    const hospitalId = user?.hospitals?.[0]?.id;

    useEffect(() => {
        if (hospitalId) {
            fetchHospitalDetail();
        }
    }, [hospitalId]);

    const fetchHospitalDetail = async () => {
        setLoading(true);
        try {
            console.log('🏥 Fetching hospital detail for ID:', hospitalId);
            const response = await getHospitalById(hospitalId);
            console.log('✅ Hospital detail response:', response);

            // ✅ Extract data from API response structure
            const hospitalData = response.result || response;
            setHospital(hospitalData);

            dispatch(setMessage({
                type: 'success',
                content: 'Hospital information loaded successfully',
                duration: 3
            }));
        } catch (error) {
            console.error('❌ Error fetching hospital detail:', error);
            dispatch(setMessage({
                type: 'error',
                content: 'Failed to load hospital information',
                duration: 4
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleEditSuccess = (updatedHospital) => {
        setHospital(updatedHospital);
        setEditModalVisible(false);
        dispatch(setMessage({
            type: 'success',
            content: 'Hospital information updated successfully',
            duration: 4
        }));
        // Refresh data
        fetchHospitalDetail();
    };

    const getHospitalType = (type) => {
        switch (type) {
            case 1: return 'Bệnh viện Đa khoa';
            case 2: return 'Bệnh viện Chuyên khoa';
            case 3: return 'Bệnh viện Cộng đồng';
            default: return 'Bệnh viện';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 1: return 'blue';
            case 2: return 'purple';
            case 3: return 'green';
            default: return 'default';
        }
    };

    // ✅ Format time from API response
    const formatTime = (timeString) => {
        if (!timeString) return 'Chưa có thông tin';
        try {
            const date = new Date(timeString);
            return date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            return 'Chưa có thông tin';
        }
    };

    // ✅ Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // ✅ Services table columns
    const serviceColumns = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <Tag color="green" icon={<DollarOutlined />}>
                    {formatCurrency(price)}
                </Tag>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: {
                showTitle: false,
            },
            render: (description) => (
                <Tooltip placement="topLeft" title={description}>
                    {description}
                </Tooltip>
            ),
        }
    ];

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!hospital) {
        return (
            <Card style={{ textAlign: 'center', padding: '50px' }}>
                <Text type="secondary">Không có thông tin bệnh viện</Text>
            </Card>
        );
    }

    return (
        <div className="hospital-detail-container">
            {/* Header Section */}
            <Card className="hospital-header-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Avatar
                            size={80}
                            src={hospital.image}
                            icon={<BankOutlined />}
                            style={{
                                backgroundColor: '#1890ff',
                                marginRight: 24
                            }}
                        />
                        <div>
                            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                {hospital.name}
                            </Title>
                            <Space style={{ marginTop: 8 }}>
                                <Tag color={getTypeColor(hospital.type)} icon={<MedicineBoxOutlined />}>
                                    {getHospitalType(hospital.type)}
                                </Tag>
                                <Tag color="green" icon={<SafetyOutlined />}>
                                    Đang hoạt động
                                </Tag>
                                {hospital.code && (
                                    <Tag color="default">Mã: {hospital.code}</Tag>
                                )}
                            </Space>
                            <div style={{ marginTop: 8 }}>
                                <Space>
                                    <ClockCircleOutlined />
                                    <Text>
                                        {formatTime(hospital.openTime)} - {formatTime(hospital.closeTime)}
                                    </Text>
                                </Space>
                            </div>
                        </div>
                    </div>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => setEditModalVisible(true)}
                    >
                        Chỉnh sửa Bệnh viện
                    </Button>
                </div>
            </Card>

            {/* Statistics Section */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Tổng dịch vụ"
                            value={hospital.services?.length || 0}
                            prefix={<MedicineBoxOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="ID Bệnh viện"
                            value={hospital.id}
                            prefix={<BankOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Loại bệnh viện"
                            value={hospital.type}
                            prefix={<SafetyOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card>
                        <Statistic
                            title="Giá trung bình"
                            value={hospital.services?.length > 0 ?
                                (hospital.services.reduce((sum, service) => sum + service.price, 0) / hospital.services.length).toFixed(0) : 0
                            }
                            prefix={<DollarOutlined />}
                            suffix="VNĐ"
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Main Information */}
            <Row gutter={16}>
                <Col xs={24} lg={16}>
                    <Card
                        title={
                            <Space>
                                <HomeOutlined />
                                Thông tin bệnh viện
                            </Space>
                        }
                        style={{ marginBottom: 16 }}
                    >
                        <Descriptions column={1} bordered>
                            <Descriptions.Item label="Tên bệnh viện">
                                {hospital.name}
                            </Descriptions.Item>

                            <Descriptions.Item label="ID Bệnh viện">
                                <Text code>{hospital.id}</Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Mã bệnh viện">
                                <Text code>{hospital.code}</Text>
                            </Descriptions.Item>

                            <Descriptions.Item label="Loại hình">
                                <Tag color={getTypeColor(hospital.type)}>
                                    {getHospitalType(hospital.type)}
                                </Tag>
                            </Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                <Badge status="success" text="Hoạt động" />
                            </Descriptions.Item>

                            <Descriptions.Item label="Địa chỉ">
                                <Space>
                                    <EnvironmentOutlined />
                                    <Text copyable>{hospital.address}</Text>
                                </Space>
                            </Descriptions.Item>

                            <Descriptions.Item label="Giờ hoạt động">
                                <Space>
                                    <ClockCircleOutlined />
                                    <Text>
                                        {formatTime(hospital.openTime)} - {formatTime(hospital.closeTime)}
                                    </Text>
                                </Space>
                            </Descriptions.Item>

                            {hospital.phoneNumber && (
                                <Descriptions.Item label="Số điện thoại">
                                    <Space>
                                        <PhoneOutlined />
                                        <Text copyable>{hospital.phoneNumber}</Text>
                                    </Space>
                                </Descriptions.Item>
                            )}

                            {hospital.email && (
                                <Descriptions.Item label="Email">
                                    <Space>
                                        <MailOutlined />
                                        <Text copyable>{hospital.email}</Text>
                                    </Space>
                                </Descriptions.Item>
                            )}

                            <Descriptions.Item label="Vị trí">
                                <Space>
                                    <EnvironmentOutlined />
                                    <Text>
                                        Lat: {hospital.latitude}, Long: {hospital.longitude}
                                    </Text>
                                    {hospital.googleMapUri && (
                                        <Button
                                            type="link"
                                            size="small"
                                            onClick={() => window.open(hospital.googleMapUri, '_blank')}
                                        >
                                            Xem trên Google Maps
                                        </Button>
                                    )}
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Services Section */}
                    <Card
                        title={
                            <Space>
                                <MedicineBoxOutlined />
                                Dịch vụ bệnh viện ({hospital.services?.length || 0})
                            </Space>
                        }
                    >
                        <Table
                            dataSource={hospital.services || []}
                            columns={serviceColumns}
                            rowKey="id"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} trong ${total} dịch vụ`,
                            }}
                            scroll={{ x: 400 }}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    {/* Admin Information */}
                    <Card
                        title={
                            <Space>
                                <UserOutlined />
                                Quản trị viên
                            </Space>
                        }
                        style={{ marginBottom: 16 }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Avatar
                                size={64}
                                src={user?.avatarUrl}
                                icon={<UserOutlined />}
                            />
                            <div style={{ marginTop: 16 }}>
                                <Title level={4} style={{ margin: 0 }}>
                                    {user?.fullname || 'Quản trị viên bệnh viện'}
                                </Title>
                                <Text type="secondary">Quản trị viên bệnh viện</Text>
                                <div style={{ marginTop: 8 }}>
                                    <Text copyable>
                                        {user?.email || 'admin@hospital.com'}
                                    </Text>
                                </div>
                                {user?.phoneNumber && (
                                    <div style={{ marginTop: 4 }}>
                                        <Text copyable>
                                            {user.phoneNumber}
                                        </Text>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Quick Stats */}
                    <Card
                        title={
                            <Space>
                                <InfoCircleOutlined />
                                Thống kê nhanh
                            </Space>
                        }
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic
                                        title="Dịch vụ"
                                        value={hospital.services?.length || 0}
                                        valueStyle={{ fontSize: 20, color: '#1890ff' }}
                                    />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title="ID Bệnh viện"
                                        value={hospital.id}
                                        valueStyle={{ fontSize: 20, color: '#52c41a' }}
                                    />
                                </Col>
                            </Row>
                            <div style={{ marginTop: 16, padding: '16px', background: '#f5f5f5', borderRadius: '6px' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Bệnh viện đã được thành lập và đang hoạt động
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Edit Modal */}
            <EditHospital
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onSuccess={handleEditSuccess}
                hospital={hospital}
            />
        </div>
    );
};

export default MyHospital;