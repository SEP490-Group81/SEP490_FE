import React, { useState } from 'react';
import { Tabs, Button, Input, Row, Col, Card, Badge, Table, Typography, } from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined, } from '@ant-design/icons';
import AddUser from './AddRequestLeave';
import UpdateRequestLeave from './UpdateRequestLeave';
import './styles.scss';


const DoctorRequestLeave = () => {
    const { Title, Text } = Typography;
    const leaveRequestsData = [
        {
            key: '1',
            fullName: 'Nguyễn Văn A',
            position: 'Bác sĩ chuyên khoa',
            department: 'Khoa Nội',
            startDate: '2025-07-01',
            endDate: '2025-07-05',
            status: 'pending',
        },
        {
            key: '2',
            fullName: 'Nguyễn Văn A',
            position: 'Bác sĩ chuyên khoa',
            department: 'Khoa Ngoại',
            startDate: '2025-06-15',
            endDate: '2025-06-20',
            status: 'approved',
        },
        {
            key: '3',
            fullName: 'Nguyễn Văn A',
            position: 'Bác sĩ chuyên khoa',
            department: 'Khoa Sản',
            startDate: '2025-05-01',
            endDate: '2025-05-03',
            status: 'completed',
        },
    ];
    const [dataSource, setDataSource] = useState(leaveRequestsData);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [searchText, setSearchText] = useState('');

    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Chức vụ',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Phòng ban',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = '';
                let text = '';

                switch (status) {
                    case 'pending':
                        color = 'gold';
                        text = 'Đang chờ';
                        break;
                    case 'approved':
                        color = 'green';
                        text = 'Đã chấp nhận';
                        break;
                    case 'completed':
                        color = 'gray';
                        text = 'Đã kết thúc';
                        break;
                    default:
                        color = 'default';
                        text = status;
                }

                return <Badge color={color} text={text} />;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        disabled={record.status !== 'pending'}
                        onClick={() => {
                            setEditingRecord(record);
                            setShowUpdateModal(true);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        danger
                        disabled={record.status !== 'pending'}
                        onClick={() => {

                        }}
                    >
                        Xoá
                    </Button>
                </>

            ),
        },
    ];

    const handleAddUser = () => {
        setShowAddModal(true);
    };

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredData = dataSource.filter((item) =>
        item.fullName.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAddUserSuccess = (newRequest) => {
        setShowAddModal(false);
        setDataSource((prev) => [...prev, newRequest]);
    };

    const handleUpdateSuccess = (updatedRecord) => {
        setShowUpdateModal(false);
        setEditingRecord(null);
        setDataSource((prev) =>
            prev.map((item) => (item.key === updatedRecord.key ? updatedRecord : item))
        );
    };
    const statisticsData = {
        totalDaysOff: "8/15",
        holidays: "0/3",
    };

    return (
        <div className="user-management-container">
            <Row gutter={24} style={{ marginBottom: 24, justifyContent: 'space-between' }}>
                <Col xs={24}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <h2>
                                <UserOutlined style={{ marginRight: 12 }} />
                                Đơn xin nghỉ phép của bác sĩ
                            </h2>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddUser}
                                size="large"
                            >
                                Tạo đơn xin nghỉ phép
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24} style={{ marginBottom: 24, justifyContent: 'space-between' }}>

                <Col xs={24} sm={8}>
                    <Card style={{ textAlign: 'center' }}>
                        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                            {statisticsData.totalDaysOff}
                        </Title>
                        <Text style={{ fontFamily: "Roboto", fontSize: 20, fontWeight: 500 }}>Số ngày đã nghỉ</Text>
                    </Card>
                </Col>

                <Col xs={24} sm={8}>
                    <Card style={{ textAlign: 'center' }}>
                        <Title level={2} style={{ margin: 0, color: '#faad14' }}>
                            {statisticsData.holidays}
                        </Title>
                        <Text style={{ fontFamily: "Roboto", fontSize: 20, fontWeight: 500 }}>Số ngày nghỉ lễ</Text>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <Card>
                        <Row className="actions-row" gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8} lg={6} className="search-container">
                                <Input.Search
                                    placeholder="Tìm theo họ tên..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onSearch={handleSearch}
                                    enterButton={<SearchOutlined />}
                                    size="middle"
                                    allowClear
                                />
                            </Col>
                        </Row>

                    </Card>
                </Col>

                <Col span={24}>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        pagination={{ pageSize: 5 }}
                        rowKey="key"
                        style={{ marginTop: 24 }}
                    />
                </Col>
            </Row>

            {showAddModal && (
                <AddUser
                    visible={showAddModal}
                    onCancel={() => setShowAddModal(false)}
                    onSuccess={handleAddUserSuccess}
                />
            )}

            {showUpdateModal && editingRecord && (
                <UpdateRequestLeave
                    visible={showUpdateModal}
                    onCancel={() => {
                        setShowUpdateModal(false);
                        setEditingRecord(null);
                    }}
                    onSuccess={handleUpdateSuccess}
                    initialValues={editingRecord}
                />
            )}
        </div>
    );
};

export default DoctorRequestLeave;
