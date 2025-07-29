import React from 'react';
import {
    Modal,
    Descriptions,
    Avatar,
    Row,
    Col,
    Tag,
    Divider,
    Space,
    Rate,
    Typography
} from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CalendarOutlined,
    MedicineBoxOutlined,
    HeartOutlined,
    BookOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const ViewStaff = ({ visible, onCancel, staff }) => {
    if (!staff) return null;

    const getStatusTag = (status) => {
        const statusConfig = {
            active: { color: 'green', icon: <CheckCircleOutlined />, text: 'Hoạt động' },
            inactive: { color: 'red', icon: <CloseCircleOutlined />, text: 'Không hoạt động' },
            pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Chờ duyệt' }
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <Tag color={config.color} icon={config.icon}>
                {config.text}
            </Tag>
        );
    };

    const getGenderText = (gender) => {
        if (typeof gender === 'boolean') {
            return gender ? 'Nam' : 'Nữ';
        }
        return gender === 'male' ? 'Nam' : 'Nữ';
    };

    const getStaffTypeText = (type) => {
        const typeConfig = {
            doctor: { text: 'Bác sĩ', icon: <MedicineBoxOutlined />, color: '#1890ff' },
            nurse: { text: 'Y tá', icon: <HeartOutlined />, color: '#52c41a' }
        };

        const config = typeConfig[type] || typeConfig.doctor;
        return (
            <Space>
                <span style={{ color: config.color }}>{config.icon}</span>
                <Text strong style={{ color: config.color }}>{config.text}</Text>
            </Space>
        );
    };

    return (
        <Modal
            title={
                <Space>
                    <UserOutlined />
                    <span>Thông tin nhân viên</span>
                </Space>
            }
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
            destroyOnClose
        >
            <div style={{ padding: '16px 0' }}>
                {/* Header Section */}
                <Row gutter={24} style={{ marginBottom: 24 }}>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <Avatar
                            size={120}
                            src={staff.avatar}
                            icon={<UserOutlined />}
                            style={{ marginBottom: 16 }}
                        />
                        <div>
                            <Title level={4} style={{ marginBottom: 8 }}>{staff.name}</Title>
                            {getStaffTypeText(staff.type)}
                        </div>
                    </Col>
                    <Col span={18}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                    <div>
                                        <Text strong>Trạng thái: </Text>
                                        {getStatusTag(staff.status)}
                                    </div>
                                    <div>
                                        <Text strong>Mã nhân viên: </Text>
                                        <Text code>{staff.id}</Text>
                                    </div>
                                    {staff.type === 'doctor' && staff.rating && (
                                        <div>
                                            <Text strong>Đánh giá: </Text>
                                            <Rate disabled value={staff.rating} style={{ fontSize: 16 }} />
                                            <Text style={{ marginLeft: 8 }}>({staff.rating}/5)</Text>
                                        </div>
                                    )}
                                </Space>
                            </Col>
                            <Col span={12}>
                                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                                    <div>
                                        <Text strong>Khoa: </Text>
                                        <Tag color="blue">{staff.department}</Tag>
                                    </div>
                                    {staff.specialization && (
                                        <div>
                                            <Text strong>Chuyên khoa: </Text>
                                            <Tag color="purple">{staff.specialization}</Tag>
                                        </div>
                                    )}
                                    {staff.experience && (
                                        <div>
                                            <Text strong>Kinh nghiệm: </Text>
                                            <Text>{staff.experience} năm</Text>
                                        </div>
                                    )}
                                </Space>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Divider />

                
                <Title level={5} style={{ marginBottom: 16 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Thông tin cá nhân
                </Title>
                <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Họ và tên" span={2}>
                        {staff.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        <Space>
                            <MailOutlined />
                            {staff.email}
                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        <Space>
                            <PhoneOutlined />
                            {staff.phone}
                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Giới tính">
                        {getGenderText(staff.gender)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh">
                        <Space>
                            <CalendarOutlined />
                            {staff.dob ? dayjs(staff.dob).format('DD/MM/YYYY') : 'Chưa cập nhật'}
                        </Space>
                    </Descriptions.Item>
                </Descriptions>

                <Divider />

               
                <Title level={5} style={{ marginBottom: 16 }}>
                    <MedicineBoxOutlined style={{ marginRight: 8 }} />
                    Thông tin nghề nghiệp
                </Title>
                <Descriptions bordered column={2} size="small">
                    <Descriptions.Item label="Vị trí">
                        {staff.type === 'doctor' ? 'Bác sĩ' : 'Y tá'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Khoa làm việc">
                        {staff.department}
                    </Descriptions.Item>
                    {staff.specialization && (
                        <Descriptions.Item label="Chuyên khoa" span={2}>
                            {staff.specialization}
                        </Descriptions.Item>
                    )}
                    {staff.licenseNumber && (
                        <Descriptions.Item label="Số giấy phép hành nghề" span={2}>
                            <Text code>{staff.licenseNumber}</Text>
                        </Descriptions.Item>
                    )}
                    {staff.education && (
                        <Descriptions.Item label="Học vấn" span={2}>
                            <Space>
                                <BookOutlined />
                                {staff.education}
                            </Space>
                        </Descriptions.Item>
                    )}
                    {staff.certifications && (
                        <Descriptions.Item label="Chứng chỉ" span={2}>
                            {staff.certifications}
                        </Descriptions.Item>
                    )}
                    {staff.experience && (
                        <Descriptions.Item label="Kinh nghiệm">
                            {staff.experience} năm
                        </Descriptions.Item>
                    )}
                    {staff.consultationFee && (
                        <Descriptions.Item label="Phí khám">
                            <Space>
                                <DollarOutlined />
                                {staff.consultationFee?.toLocaleString()} VNĐ
                            </Space>
                        </Descriptions.Item>
                    )}
                </Descriptions>

               
                {(staff.schedule || staff.shift) && (
                    <>
                        <Divider />
                        <Title level={5} style={{ marginBottom: 16 }}>
                            <ClockCircleOutlined style={{ marginRight: 8 }} />
                            Lịch làm việc
                        </Title>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Ca làm việc">
                                {staff.schedule || staff.shift || 'Chưa cập nhật'}
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                )}

                
                {staff.bio && (
                    <>
                        <Divider />
                        <Title level={5} style={{ marginBottom: 16 }}>
                            Giới thiệu
                        </Title>
                        <Text>{staff.bio}</Text>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ViewStaff;
