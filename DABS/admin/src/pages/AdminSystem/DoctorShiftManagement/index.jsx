import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, Select, Row, Col, Badge, ConfigProvider } from "antd";
import { Calendar as BigCalendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import viVN from "antd/es/locale/vi_VN";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { SearchOutlined } from '@ant-design/icons';
const { Option } = Select;
const localizer = dayjsLocalizer(dayjs);
dayjs.locale("vi");

const statusColors = {
    pending: "gold",
    approved: "green",
    canceled: "red",
};



const AdminDoctorShiftManagement = () => {

    const doctors = [
        { id: 10, name: "Nguyễn Văn A" },
        { id: 11, name: "Trần Thị B" },
        { id: 12, name: "Lê Văn C" },
    ];

    const initialShifts = [
        {
            id: 1,
            doctorId: 10,
            doctorName: "Nguyễn Văn A",
            workDate: "2025-07-01",
            startTime: "08:00:00",
            endTime: "12:00:00",
            roomName: "Phòng khám 1",
            departmentName: "Khoa Nội",
            status: "approved",
            reasonOfUnavailability: null,
        },
        {
            id: 2,
            doctorId: 10,
            doctorName: "Nguyễn Văn A",
            workDate: "2025-07-01",
            startTime: "13:00:00",
            endTime: "17:00:00",
            roomName: "Phòng khám 2",
            departmentName: "Khoa Ngoại",
            status: "pending",
            reasonOfUnavailability: null,
        },
        {
            id: 3,
            doctorId: 11,
            doctorName: "Trần Thị B",
            workDate: "2025-07-02",
            startTime: "09:00:00",
            endTime: "15:00:00",
            roomName: "Phòng khám 3",
            departmentName: "Khoa Sản",
            status: "canceled",
            reasonOfUnavailability: "Bác sĩ nghỉ ốm",
        },
        {
            id: 4,
            doctorId: 12,
            doctorName: "Lê Văn C",
            workDate: "2025-07-03",
            startTime: "07:00:00",
            endTime: "11:00:00",
            roomName: "Phòng khám 1",
            departmentName: "Khoa Tai Mũi Họng",
            status: "approved",
            reasonOfUnavailability: null,
        },
    ];

    const [shifts, setShifts] = useState(initialShifts);
    const [searchText, setSearchText] = useState('');
    const [filteredShifts, setFilteredShifts] = useState(initialShifts);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingShift, setEditingShift] = useState(null);

    const [form] = Form.useForm();
    useEffect(() => {
        if (!searchText) {
            setFilteredShifts(shifts);
        } else {
            setFilteredShifts(
                shifts.filter(shift =>
                    shift.doctorName.toLowerCase().includes(searchText.toLowerCase())
                )
            );
        }
    }, [searchText, shifts]);

    const handleSearch = (value) => {
        setSearchText(value);
    };


    const events = filteredShifts.map(shift => {
        const start = new Date(`${shift.workDate}T${shift.startTime}`);
        const end = new Date(`${shift.workDate}T${shift.endTime}`);
        return {
            id: shift.id,
            title: `${shift.roomName} - ${shift.departmentName}`,
            start,
            end,
            resource: shift,
        };
    });

    const columns = [
        { title: "Ngày", dataIndex: "workDate", key: "workDate" },
        { title: "Bác sĩ", dataIndex: "doctorName", key: "doctorName" },
        { title: "Phòng", dataIndex: "roomName", key: "roomName" },
        { title: "Giờ bắt đầu", dataIndex: "startTime", key: "startTime" },
        { title: "Giờ kết thúc", dataIndex: "endTime", key: "endTime" },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: status => <Badge color={statusColors[status]} text={status === "approved" ? "Đã duyệt" : status === "pending" ? "Chờ duyệt" : "Đã hủy"} />,
        },
        {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => onEditShift(record)}>Sửa</Button>
                    <Button type="link" danger onClick={() => onDeleteShift(record.id)}>Xóa</Button>
                </>
            ),
        },
    ];

    const onAddShift = () => {
        setEditingShift(null);
        form.resetFields();
        setModalVisible(true);
    };

    const onEditShift = (shift) => {
        setEditingShift(shift);
        form.setFieldsValue({
            ...shift,
            workDate: dayjs(shift.workDate),
            startTime: dayjs(shift.startTime, "HH:mm:ss"),
            endTime: dayjs(shift.endTime, "HH:mm:ss"),
        });
        setModalVisible(true);
    };

    const onDeleteShift = (id) => {
        Modal.confirm({
            title: "Xác nhận xóa ca làm việc?",
            onOk() {
                setShifts(prev => prev.filter(s => s.id !== id));
            },
        });
    };

    const onFinish = (values) => {
        const newShift = {
            id: editingShift ? editingShift.id : Date.now(),
            doctorId: values.doctorId,
            doctorName: doctors.find(d => d.id === values.doctorId)?.name || "",
            workDate: values.workDate.format("YYYY-MM-DD"),
            startTime: values.startTime.format("HH:mm:ss"),
            endTime: values.endTime.format("HH:mm:ss"),
            roomName: values.roomName,
            departmentName: values.departmentName,
            status: values.status || "pending",
        };

        if (editingShift) {
            setShifts(prev => prev.map(s => (s.id === editingShift.id ? newShift : s)));
        } else {
            setShifts(prev => [...prev, newShift]);
        }
        setModalVisible(false);
    };

    const eventStyleGetter = (event) => {
        const color = statusColors[event.resource.status] || "#ccc";
        return {
            style: {
                backgroundColor: color,
                color: "#fff",
                borderRadius: 8,
                border: "none",
                padding: 6,
                fontWeight: "bold",
                cursor: "pointer",
            },
        };
    };

    return (
        <ConfigProvider locale={viVN}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        <Input.Search
                            placeholder="Tìm theo tên bác sĩ..."
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            onSearch={handleSearch}
                            enterButton={<SearchOutlined />}
                            allowClear
                            style={{ width: 250 }}
                        />
                    </Col>

                    <Col>
                        <Button type="primary" onClick={onAddShift}>Thêm ca làm việc</Button>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Table
                            columns={columns}
                            dataSource={filteredShifts}
                            rowKey="id"
                            pagination={{ pageSize: 8 }}
                            scroll={{ y: 500 }}
                        />
                    </Col>
                    <Col span={12}>
                        <BigCalendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 600, borderRadius: 12, backgroundColor: "#f6ffed", padding: 8 }}
                            eventPropGetter={eventStyleGetter}
                            views={["week", "day"]}
                            defaultView="week"
                            onSelectEvent={onEditShift}
                            culture="vi"
                        />
                    </Col>
                </Row>

                <Modal
                    title={editingShift ? "Sửa ca làm việc" : "Thêm ca làm việc"}
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    destroyOnClose
                    width={600}
                >
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item
                            label="Bác sĩ"
                            name="doctorId"
                            rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
                        >
                            <Select placeholder="Chọn bác sĩ">
                                {doctors.map(doc => (
                                    <Option key={doc.id} value={doc.id}>{doc.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Phòng"
                            name="roomName"
                            rules={[{ required: true, message: "Vui lòng nhập phòng" }]}
                        >
                            <Input placeholder="Nhập tên phòng" />
                        </Form.Item>

                        <Form.Item
                            label="Phòng ban"
                            name="departmentName"
                            rules={[{ required: true, message: "Vui lòng nhập phòng ban" }]}
                        >
                            <Input placeholder="Nhập phòng ban" />
                        </Form.Item>

                        <Form.Item
                            label="Ngày làm việc"
                            name="workDate"
                            rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Giờ bắt đầu"
                                    name="startTime"
                                    rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu" }]}
                                >
                                    <TimePicker style={{ width: "100%" }} format="HH:mm:ss" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Giờ kết thúc"
                                    name="endTime"
                                    rules={[{ required: true, message: "Vui lòng chọn giờ kết thúc" }]}
                                >
                                    <TimePicker style={{ width: "100%" }} format="HH:mm:ss" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            initialValue="pending"
                            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
                        >
                            <Select>
                                <Option value="pending">Chờ duyệt</Option>
                                <Option value="approved">Đã duyệt</Option>
                                <Option value="canceled">Đã hủy</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ textAlign: "right" }}>
                            <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingShift ? "Cập nhật" : "Thêm"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default AdminDoctorShiftManagement;
