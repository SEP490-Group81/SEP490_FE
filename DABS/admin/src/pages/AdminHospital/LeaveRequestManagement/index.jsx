import React, { useState, useMemo } from "react";
import {
    Table, Modal, Button, Tag, message, Space, Tabs,
    Input, Row, Col, Card, Badge, ConfigProvider
} from "antd";
import {
    EyeOutlined, CheckOutlined, CloseOutlined, ScheduleOutlined, SearchOutlined
} from "@ant-design/icons";
import "./style.scss";
import viVN from "antd/es/locale/vi_VN";

const { TabPane } = Tabs;

const LeaveRequestManagement = () => {
    const [leaveRequests, setLeaveRequests] = useState([
        {
            id: 1,
            employeeName: "Nguyễn Văn A",
            role: "doctor",
            reason: "Nghỉ ốm",
            fromDate: "2025-07-10",
            toDate: "2025-07-12",
            status: "pending"
        },
        {
            id: 2,
            employeeName: "Trần Thị B",
            role: "nurse",
            reason: "Việc gia đình",
            fromDate: "2025-07-15",
            toDate: "2025-07-16",
            status: "approved"
        },
        {
            id: 3,
            employeeName: "Lê Văn C",
            role: "healthcare staff",
            reason: "Đi du lịch",
            fromDate: "2025-07-20",
            toDate: "2025-07-23",
            status: "pending"
        }
    ]);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [searchText, setSearchText] = useState("");

    const updateStatus = (newStatus) => {
        setLeaveRequests(prev =>
            prev.map(req =>
                req.id === selectedRequest.id ? { ...req, status: newStatus } : req
            )
        );
        message.success(`Yêu cầu đã được ${newStatus === "approved" ? "duyệt" : "từ chối"}`);
        setSelectedRequest(null);
    };

    const showDetail = (record) => {
        setSelectedRequest(record);
    };

    // Đếm số lượng theo vai trò
    const counts = useMemo(() => {
        const doctor = leaveRequests.filter(r => r.role === "doctor").length;
        const nurse = leaveRequests.filter(r => r.role === "nurse").length;
        const staff = leaveRequests.filter(r => r.role === "healthcare staff").length;
        return {
            all: leaveRequests.length,
            doctor,
            nurse,
            staff,
        };
    }, [leaveRequests]);

    // Bộ lọc theo tab và searchText
    const filteredRequests = useMemo(() => {
        return leaveRequests.filter(req =>
            (activeTab === "all" || req.role === activeTab) &&
            (req.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
                req.reason.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [leaveRequests, activeTab, searchText]);

    const columns = [
        {
            title: "Tên nhân viên",
            dataIndex: "employeeName",
            key: "employeeName"
        },
        {
            title: "Vai trò",
            dataIndex: "role",
            key: "role",
            render: (role) => {
                if (role === "doctor") return "Bác sĩ";
                if (role === "nurse") return "Y tá";
                return "Nhân viên y tế";
            }
        },
        {
            title: "Từ ngày",
            dataIndex: "fromDate",
            key: "fromDate"
        },
        {
            title: "Đến ngày",
            dataIndex: "toDate",
            key: "toDate"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const color =
                    status === "approved" ? "green" :
                        status === "rejected" ? "red" : "orange";
                const label =
                    status === "approved" ? "Đã duyệt" :
                        status === "rejected" ? "Đã từ chối" : "Chờ duyệt";
                return <Tag color={color}>{label}</Tag>;
            }
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => showDetail(record)}
                >
                    Xem
                </Button>
            )
        }
    ];

    return (
        <ConfigProvider locale={viVN}>
            <div className="leave-request-management">
                <Row gutter={[0, 24]}>
                    <Col span={24}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <h2><ScheduleOutlined style={{ marginRight: 8 }} />Quản lý yêu cầu nghỉ phép</h2>
                            </Col>
                        </Row>
                    </Col>

                    <Col span={24}>
                        <Card>
                            <Row className="actions-row" style={{ marginBottom: 16 }}>
                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <Input.Search
                                        placeholder="Tìm theo tên hoặc lý do"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        enterButton={<SearchOutlined />}
                                        allowClear
                                        size="middle"
                                    />
                                </Col>
                            </Row>

                            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                                <TabPane
                                    tab={<span>Tất cả <Badge count={counts.all} style={{ backgroundColor: '#1890ff' }} /></span>}
                                    key="all"
                                />
                                <TabPane
                                    tab={<span>Bác sĩ <Badge count={counts.doctor} /></span>}
                                    key="doctor"
                                />
                                <TabPane
                                    tab={<span>Y tá <Badge count={counts.nurse} /></span>}
                                    key="nurse"
                                />
                                <TabPane
                                    tab={<span>Nhân viên y tế <Badge count={counts.staff} /></span>}
                                    key="healthcare staff"
                                />
                            </Tabs>

                            <Table
                                dataSource={filteredRequests}
                                rowKey="id"
                                columns={columns}
                                pagination={{ pageSize: 5 }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title="Chi tiết yêu cầu nghỉ phép"
                    open={!!selectedRequest}
                    onCancel={() => setSelectedRequest(null)}
                    footer={[
                        <Button key="cancel" onClick={() => setSelectedRequest(null)}>Đóng</Button>,
                        selectedRequest?.status === "pending" && (
                            <Space key="actions">
                                <Button
                                    icon={<CloseOutlined />}
                                    danger
                                    onClick={() => updateStatus("rejected")}
                                >
                                    Từ chối
                                </Button>
                                <Button
                                    icon={<CheckOutlined />}
                                    type="primary"
                                    onClick={() => updateStatus("approved")}
                                >
                                    Duyệt
                                </Button>
                            </Space>
                        )
                    ]}
                >
                    {selectedRequest && (
                        <>
                            <p><b>Nhân viên:</b> {selectedRequest.employeeName}</p>
                            <p><b>Vai trò:</b> {
                                selectedRequest.role === "doctor"
                                    ? "Bác sĩ"
                                    : selectedRequest.role === "nurse"
                                        ? "Y tá"
                                        : "Nhân viên y tế"
                            }</p>
                            <p><b>Thời gian nghỉ:</b> {selectedRequest.fromDate} → {selectedRequest.toDate}</p>
                            <p><b>Lý do:</b> {selectedRequest.reason}</p>
                            <p><b>Trạng thái:</b> {
                                selectedRequest.status === "approved"
                                    ? "Đã duyệt"
                                    : selectedRequest.status === "rejected"
                                        ? "Đã từ chối"
                                        : "Chờ duyệt"
                            }</p>
                        </>
                    )}
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default LeaveRequestManagement;
