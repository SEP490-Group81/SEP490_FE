import React, { useState, useEffect } from "react";
import {
    Button, Modal, Form, Input, DatePicker, TimePicker, Select,
    Row, Col, Checkbox, message, ConfigProvider, List, Tag
} from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const { Option } = Select;
const { RangePicker } = DatePicker;

const weekdayOptions = [
    { label: "Thứ 2", value: 1 },
    { label: "Thứ 3", value: 2 },
    { label: "Thứ 4", value: 3 },
    { label: "Thứ 5", value: 4 },
    { label: "Thứ 6", value: 5 },
    { label: "Thứ 7", value: 6 },
    { label: "Chủ nhật", value: 0 },
];

dayjs.extend(customParseFormat);
dayjs.locale("vi");

// Fake nurse data
const nurses = [
    { id: 100, name: "Nguyễn Thị Y Tá A" },
    { id: 101, name: "Trần Văn Y Tá B" },
    { id: 102, name: "Phạm Y Tá C" }
];

const eventColor = (info) => {
    const { status } = info.event.extendedProps;
    if (status === "Đang làm") {
        Object.assign(info.el.style, {
            backgroundColor: "#4caf50",
            color: "white",
            borderRadius: "8px",
            border: "1px solid #388e3c"
        });
    } else if (status === "Chưa bắt đầu") {
        Object.assign(info.el.style, {
            backgroundColor: "#ffd54f",
            color: "black",
            borderRadius: "8px",
            border: "1px solid #ffa000"
        });
    } else {
        Object.assign(info.el.style, {
            backgroundColor: "#e0e0e0",
            color: "black",
            borderRadius: "8px",
            border: "1px solid #9e9e9e"
        });
    }
};

const NurseShiftManagement = () => {
    const [shifts, setShifts] = useState([]);
    const [filteredShifts, setFilteredShifts] = useState([]);
    const [selectedNurseId, setSelectedNurseId] = useState(100);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingShift, setEditingShift] = useState(null);
    const [form] = Form.useForm();
    const [bulkForm] = Form.useForm();
    const [modalDetail, setModalDetail] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchShifts();
    }, []);

    const fetchShifts = async () => {
        const data = [
            {
                id: 1,
                nurseId: 100,
                nurseName: "Nguyễn Thị Y Tá A",
                workDate: "2025-07-04",
                startTime: "08:00:00",
                endTime: "12:00:00",
                roomName: "Phòng 202",
                departmentName: "Khoa Hồi sức",
                status: "Đang làm"
            },
            {
                id: 2,
                nurseId: 101,
                nurseName: "Trần Văn Y Tá B",
                workDate: "2025-07-04",
                startTime: "13:00:00",
                endTime: "17:00:00",
                roomName: "Phòng 203",
                departmentName: "Khoa Ngoại",
                status: "Chưa bắt đầu"
            }
        ];
        setShifts(data);
        setFilteredShifts(data);
    };

    useEffect(() => {
        if (!selectedNurseId) setFilteredShifts(shifts);
        else setFilteredShifts(shifts.filter(s => s.nurseId === selectedNurseId));
    }, [selectedNurseId, shifts]);

    const events = filteredShifts.map(shift => ({
        id: shift.id,
        title: `Y tá ${shift.nurseName} - ${shift.roomName}`,
        start: `${shift.workDate}T${shift.startTime}`,
        end: `${shift.workDate}T${shift.endTime}`,
        extendedProps: { ...shift }
    }));

    const onAddShift = (dateStr = null) => {
        setEditingShift(null);
        form.resetFields();
        if (dateStr) form.setFieldValue("workDate", dayjs(dateStr));
        setModalVisible(true);
    };

    const onEditShift = (shift) => {
        setSelectedEvent(shift);
        setModalDetail(true);
    };

    const onDeleteShift = (id) => {
        Modal.confirm({
            title: "Xác nhận xóa ca làm việc?",
            onOk: () => {
                const newData = shifts.filter(s => s.id !== id);
                setShifts(newData);
                setFilteredShifts(newData);
                setModalDetail(false);
            }
        });
    };

    const onFinish = (values) => {
        const newShift = {
            id: editingShift ? editingShift.id : Date.now(),
            nurseId: values.nurseId,
            nurseName: nurses.find(n => n.id === values.nurseId)?.name || "",
            workDate: values.workDate.format("YYYY-MM-DD"),
            startTime: values.startTime.format("HH:mm:ss"),
            endTime: values.endTime.format("HH:mm:ss"),
            roomName: values.roomName,
            departmentName: values.departmentName,
            status: values.status || "Chưa bắt đầu"
        };
        const updated = editingShift
            ? shifts.map(s => (s.id === editingShift.id ? newShift : s))
            : [...shifts, newShift];
        setShifts(updated);
        setModalVisible(false);
    };

    const onFinishBulk = (values) => {
        const { nurseIds, weekdays, shift, dateRange } = values;
        const shiftTime = {
            morning: { start: "08:00:00", end: "12:00:00" },
            afternoon: { start: "13:00:00", end: "17:00:00" },
            evening: { start: "18:00:00", end: "21:00:00" },
        }[shift];
        const [startDate, endDate] = dateRange;
        const shiftsToAdd = [];
        let current = dayjs(startDate);
        while (current.isSameOrBefore(endDate, 'day')) {
            if (weekdays.includes(current.day())) {
                nurseIds.forEach(id => {
                    const nurse = nurses.find(n => n.id === id);
                    shiftsToAdd.push({
                        id: Date.now() + Math.random(),
                        nurseId: id,
                        nurseName: nurse.name,
                        workDate: current.format("YYYY-MM-DD"),
                        startTime: shiftTime.start,
                        endTime: shiftTime.end,
                        roomName: "Phòng mặc định",
                        departmentName: "Khoa mặc định",
                        status: "Chưa bắt đầu"
                    });
                });
            }
            current = current.add(1, 'day');
        }
        setShifts(prev => [...prev, ...shiftsToAdd]);
        message.success("Tạo lịch mẫu thành công!");
        bulkForm.resetFields();
    };

    const Legend = () => (
        <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
            <Col><Tag color="#4caf50">Đang làm</Tag></Col>
            <Col><Tag color="#ffd54f">Chưa bắt đầu</Tag></Col>
            <Col><Tag color="#e0e0e0">Khác</Tag></Col>
        </Row>
    );

    return (
        <ConfigProvider locale={viVN}>
            <div style={{ margin: "0 auto", padding: 10, backgroundColor: "#fff", borderRadius: 8 }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        <h2>Xem lịch y tá</h2>
                        <Select
                            placeholder="Lọc theo y tá"
                            allowClear
                            style={{ width: 250 }}
                            showSearch
                            optionFilterProp="children"
                            onChange={(value) => setSelectedNurseId(value)}
                            defaultValue={selectedNurseId}
                        >
                            {nurses.map(nurse => (
                                <Option key={nurse.id} value={nurse.id}>{nurse.name}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => onAddShift()}>Tạo ca làm</Button>
                    </Col>
                </Row>

                <Legend />

                <Row gutter={24}>
                    <Col xl={8} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 16 }}>
                        <h2>Tạo lịch mẫu cho y tá</h2>
                        <Form layout="vertical" form={bulkForm} onFinish={onFinishBulk}>
                            <Form.Item name="nurseIds" label="Y tá" rules={[{ required: true }]}>
                                <Select
                                    mode="multiple"
                                    placeholder="Chọn y tá"
                                    onChange={(value) => {
                                        if (value.includes("all")) {
                                            const allIds = nurses.map(n => n.id);
                                            bulkForm.setFieldsValue({ nurseIds: allIds });
                                        }
                                    }}
                                >
                                    <Option key="all" value="all">Tất cả</Option>
                                    {nurses.map(n => (
                                        <Option key={n.id} value={n.id}>{n.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="weekdays" label="Ngày trong tuần" rules={[{ required: true }]}>
                                <Checkbox.Group options={weekdayOptions} />
                            </Form.Item>
                            <Form.Item name="shift" label="Ca làm" rules={[{ required: true }]}>
                                <Select mode="multiple">
                                    <Option value="morning">Sáng</Option>
                                    <Option value="afternoon">Chiều</Option>
                                    <Option value="evening">Tối</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="dateRange" label="Khoảng thời gian" rules={[{ required: true }]}>
                                <RangePicker style={{ width: "100%" }} />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">Tạo lịch mẫu</Button>
                        </Form>
                    </Col>

                    <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{ start: 'prev,next today', center: 'title', end: 'dayGridMonth,timeGridWeek,timeGridDay' }}
                            locale='vi'
                            events={events}
                            height={600}
                            eventClick={(info) => onEditShift(info.event.extendedProps)}
                            eventDidMount={eventColor}
                            dateClick={(info) => onAddShift(info.dateStr)}
                        />
                    </Col>
                </Row>

                <Modal
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    title={editingShift ? "Chỉnh sửa ca làm" : "Thêm ca làm việc"}
                    footer={[
                        <Button key="cancel" onClick={() => setModalVisible(false)}>Hủy</Button>,
                        <Button key="ok" type="primary" onClick={() => form.submit()}>Lưu</Button>
                    ]}
                >
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Form.Item name="nurseId" label="Y tá" rules={[{ required: true }]}>
                            <Select placeholder="Chọn y tá">
                                {nurses.map(n => (
                                    <Option key={n.id} value={n.id}>{n.name}</Option>
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
                        <Form.Item name="roomName" label="Phòng làm việc" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="departmentName" label="Khoa" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="status" label="Trạng thái">
                            <Select>
                                <Option value="Đang làm">Đang làm</Option>
                                <Option value="Chưa bắt đầu">Chưa bắt đầu</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    open={modalDetail}
                    onCancel={() => setModalDetail(false)}
                    footer={null}
                    title={selectedEvent && (
                        <div>
                            <span style={{ fontWeight: 700, fontSize: 20 }}>{selectedEvent.title}</span>
                            <div style={{ fontSize: 15, color: "#1976d2", marginTop: 4 }}>
                                {selectedEvent.departmentName} - Phòng {selectedEvent.roomName}
                            </div>
                        </div>
                    )}
                    width={500}
                >
                    {selectedEvent && (
                        <>
                            <div style={{ marginBottom: 12 }}>
                                <b>Thời gian:</b> {selectedEvent.startTime} - {selectedEvent.endTime}<br />
                                <b>Trạng thái:</b> {selectedEvent.status || "Không rõ"}
                            </div>
                            <div style={{ marginTop: 16, textAlign: "right", display: "flex", justifyContent: "space-between" }}>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setEditingShift(selectedEvent);
                                        form.setFieldsValue({
                                            nurseId: selectedEvent.nurseId,
                                            workDate: dayjs(selectedEvent.workDate),
                                            startTime: dayjs(selectedEvent.startTime, 'HH:mm:ss'),
                                            endTime: dayjs(selectedEvent.endTime, 'HH:mm:ss'),
                                            roomName: selectedEvent.roomName,
                                            departmentName: selectedEvent.departmentName,
                                            status: selectedEvent.status
                                        });
                                        setModalVisible(true);
                                        setModalDetail(false);
                                    }}
                                >Chỉnh sửa</Button>
                                <Button danger onClick={() => onDeleteShift(selectedEvent.id)}>Xóa</Button>

                            </div>
                        </>
                    )}
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default NurseShiftManagement;
