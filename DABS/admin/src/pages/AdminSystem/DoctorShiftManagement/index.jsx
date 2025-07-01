// Replace BigCalendar with FullCalendar
import React, { useState, useEffect } from "react";
import {
    Table, Button, Modal, Form, Input, DatePicker, TimePicker, Select, Row, Col, Badge, ConfigProvider, Checkbox, message
} from "antd";
import { SearchOutlined } from '@ant-design/icons';
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.locale("vi");

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusColors = {
    pending: "gold",
    approved: "green",
    canceled: "red",
};

const weekdayOptions = [
    { label: "Thứ 2", value: 1 },
    { label: "Thứ 3", value: 2 },
    { label: "Thứ 4", value: 3 },
    { label: "Thứ 5", value: 4 },
    { label: "Thứ 6", value: 5 },
    { label: "Thứ 7", value: 6 },
    { label: "Chủ nhật", value: 0 },
];

const AdminDoctorShiftManagement = () => {
    const doctors = [
        { id: 10, name: "Nguyễn Văn A" },
        { id: 11, name: "Trần Thị B" },
        { id: 12, name: "Lê Văn C" },
    ];

    const [shifts, setShifts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredShifts, setFilteredShifts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingShift, setEditingShift] = useState(null);
    const [form] = Form.useForm();
    const [bulkForm] = Form.useForm();

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        try {
            const response = await axios.get('/api/shifts');
            setShifts(response.data);
            setFilteredShifts(response.data);
        } catch (error) {
            console.error('Error fetching shifts:', error);
        }
    };

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
    const [selectedDoctors, setSelectedDoctors] = useState([]);

    const handleDoctorChange = (value) => {
        if (value.includes("all")) {
            const allDoctorIds = doctors.map(doc => doc.id);
            setSelectedDoctors(allDoctorIds);
            bulkForm.setFieldValue("doctorIds", allDoctorIds);
        } else {
            setSelectedDoctors(value);
            bulkForm.setFieldValue("doctorIds", value);
        }
    };
    const events = filteredShifts.map(shift => ({
        id: shift.id,
        title: `${shift.doctorName} - ${shift.roomName}`,
        start: `${shift.workDate}T${shift.startTime}`,
        end: `${shift.workDate}T${shift.endTime}`,
        extendedProps: { ...shift }
    }));

    const onAddShift = (dateStr = null) => {
        setEditingShift(null);
        form.resetFields();
        if (dateStr) {
            form.setFieldValue('workDate', dayjs(dateStr));
        }
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
            onOk: async () => {
                await axios.delete(`/api/shifts/${id}`);
                fetchShifts();
            },
        });
    };

    const onFinish = async (values) => {
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
            await axios.put(`/api/shifts/${editingShift.id}`, newShift);
        } else {
            await axios.post('/api/shifts', newShift);
        }
        fetchShifts();
        setModalVisible(false);
    };

    const onFinishBulk = async (values) => {
        const { doctorId, weekdays, shift, dateRange } = values;
        try {
            await axios.post("/api/schedules/bulk", {
                doctorId,
                weekdays,
                shift,
                fromDate: dateRange[0].format("YYYY-MM-DD"),
                toDate: dateRange[1].format("YYYY-MM-DD"),
            });
            message.success("Tạo lịch mẫu thành công!");
            bulkForm.resetFields();
            fetchShifts();
        } catch (err) {
            console.error(err);
            message.error("Tạo lịch mẫu thất bại.");
        }
    };

    return (
        <ConfigProvider locale={viVN}>
            <div style={{ margin: "0 auto", padding: 10 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" onClick={() => onAddShift()}>Tạo sự kiện</Button>
                    </Col>
                </Row>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form layout="vertical" form={bulkForm} onFinish={onFinishBulk} style={{ marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item name="doctorIds" label="Bác sĩ" rules={[{ required: true }]}>
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            showSearch
                                            placeholder="Chọn bác sĩ"
                                            value={selectedDoctors}
                                            onChange={handleDoctorChange}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            <Option value="all">Tất cả</Option>
                                            {doctors.map(doc => (
                                                <Option key={doc.id} value={doc.id}>{doc.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="weekdays" label="Ngày trong tuần" rules={[{ required: true }]}>
                                        <Checkbox.Group options={weekdayOptions} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="shift" label="Ca làm" rules={[{ required: true }]}>
                                        <Select>
                                            <Option value="morning">Sáng</Option>
                                            <Option value="afternoon">Chiều</Option>
                                            <Option value="evening">Tối</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="dateRange" label="Khoảng thời gian" rules={[{ required: true }]}>
                                        <RangePicker style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Button type="primary" htmlType="submit">Tạo lịch mẫu</Button>
                                </Col>
                            </Row>
                        </Form>


                    </Col>
                    <Col span={12}>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{ start: 'prev,next today', center: 'title', end: 'dayGridMonth,timeGridWeek,timeGridDay' }}
                            locale='vi'
                            events={events}
                            height={600}
                            eventClick={(info) => onEditShift(info.event.extendedProps)}
                            dateClick={(info) => onAddShift(info.dateStr)}
                        />
                    </Col>
                </Row>

                <Modal
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    title={editingShift ? "Chỉnh sửa ca làm việc" : "Thêm ca làm việc"}
                    onOk={() => form.submit()}
                    okText="Lưu"
                    cancelText="Hủy"
                >
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item name="doctorId" label="Bác sĩ" rules={[{ required: true }]}>
                            <Select placeholder="Chọn bác sĩ">
                                {doctors.map(doc => (
                                    <Option key={doc.id} value={doc.id}>{doc.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item name="workDate" label="Ngày làm việc" rules={[{ required: true }]}>
                            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true }]}>
                            <TimePicker format="HH:mm" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true }]}>
                            <TimePicker format="HH:mm" style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item name="roomName" label="Phòng khám" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="departmentName" label="Khoa" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái">
                            <Select>
                                <Option value="pending">Đang chờ</Option>
                                <Option value="approved">Đã duyệt</Option>
                                <Option value="canceled">Đã hủy</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default AdminDoctorShiftManagement;
