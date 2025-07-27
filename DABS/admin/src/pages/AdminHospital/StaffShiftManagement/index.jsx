import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Row,
  Col,
  Checkbox,
  message,
  ConfigProvider,
  List,
  Tag,
} from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  PlusOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getStaffNurseList } from "../../../services/staffNurseService";

const { Option,OptGroup  } = Select;
const { RangePicker } = DatePicker;

const weekdayOptions = [
  { label: "Thứ 2", value: 1 },
  { label: "Thứ 3", value: 2 },
  { label: "Thứ 4", value: 3 },
  { label: "Thứ 5", value: 4 },
  { label: "Thứ 6", value: 5 },
];

dayjs.extend(customParseFormat);
dayjs.locale("vi");

const staffs = [
  { id: 10, name: "Nguyễn Văn A" },
  { id: 11, name: "Trần Thị B" },
  { id: 12, name: "Lê Văn C" },
  { id: 13, name: "Nguyễn Lập" },
];

const eventColor = (info) => {
  const { type, status, patients } = info.event.extendedProps;
  if (type === "booking") {
    Object.assign(info.el.style, {
      backgroundColor: "#3575d3",
      color: "#fff",
      borderRadius: "10px",
      border: "1px solid #2a5ebd",
      boxShadow: "0 2px 10px rgba(53,117,211,0.25)",
      fontWeight: "600",
      padding: "6px 5px",
    });
  } else if (status === "Đang khám") {
    Object.assign(info.el.style, {
      backgroundColor: "#43a047",
      color: "#fff",
      borderRadius: "10px",
      border: "1px solid #2e7d32",
      boxShadow: "0 2px 10px rgba(67,160,71,0.25)",
      fontWeight: "600",
      padding: "6px 5px",
    });
  } else if (status === "Chưa bắt đầu") {
    Object.assign(info.el.style, {
      backgroundColor: "#ffd600",
      color: "#4e342e",
      borderRadius: "10px",
      border: "1px solid #c6a700",
      boxShadow: "0 2px 10px rgba(255,214,0,0.20)",
      fontWeight: "600",
      padding: "6px 5px",
    });
  } else if (!patients || patients.length === 0) {
    Object.assign(info.el.style, {
      backgroundColor: "#bdbdbd",
      color: "#212121",
      borderRadius: "10px",
      border: "1px solid #9e9e9e",
      boxShadow: "0 2px 10px rgba(189,189,189,0.25)",
      fontWeight: "600",
      padding: "6px 5px",
    });
  } else {
    Object.assign(info.el.style, {
      backgroundColor: "#2196f3",
      color: "#fff",
      borderRadius: "10px",
      border: "1px solid #1976d2",
      boxShadow: "0 2px 10px rgba(33,150,243,0.25)",
      fontWeight: "600",
      padding: "6px 5px",
    });
  }
};

const StaffShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [selectedstaffId, setSelectedstaffId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [modalDetail, setModalDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const user = useSelector((state) => state.user.user);
  console.log("hospital nurse id is: " + user.hospitals[0]?.id);
  const [allStaffs, setAllStaffs] = useState([]);
  const [nurses, setNurses] = useState([]);
    const [selectedPersonId, setSelectedPersonId] = useState(null);
  useEffect(() => {
    const fetchStaffs = async () => {
      if (!user?.hospitals?.[0]?.id) return;

      try {
        const staffList = await getStaffNurseList(user.hospitals[0].id);
        setAllStaffs(staffList || []);

        const nurseList = (staffList || []).filter((s) => s.role?.name === 'Nurse');
        setNurses(nurseList);
        console.log("Fetched nurses:", nurseList);
        console.log("Fetched all staff:", staffList);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
        setAllStaffs([]);
        setNurses([]);
      }
    };

    fetchStaffs();
  }, [user?.hospitals]);
  useEffect(() => {
    fetchShifts();
  }, []);
  const normalStaffs = allStaffs.filter(
    (s) => !nurses.find((n) => n.id === s.id)
  );
  const fetchShifts = async () => {
    const data = [
      {
        id: 1,
        staffId: 10,
        staffName: "Nguyễn Văn A",
        workDate: "2025-07-04",
        startTime: "08:00:00",
        endTime: "12:00:00",
        roomName: "Phòng 101",
        departmentName: "Khoa Nội",
        status: "Đang khám",
        type: "shift",
        patients: [
          { id: 1, name: "Nguyễn Văn A", age: 30, note: "Khám tổng quát" },
          { id: 2, name: "Trần Thị B", age: 25, note: "Khám tim mạch" },
        ],
      },
      {
        id: 2,
        staffId: 11,
        staffName: "Trần Thị B",
        workDate: "2025-07-04",
        startTime: "08:00:00",
        endTime: "12:00:00",
        roomName: "Phòng 101",
        departmentName: "Khoa Nội",
        status: "booking",
        type: "shift",
        patients: [
          { id: 1, name: "Nguyễn Văn A", age: 30, note: "Khám tổng quát" },
          { id: 2, name: "Trần Thị B", age: 25, note: "Khám tim mạch" },
        ],
      },
      {
        id: 3,
        staffId: 12,
        staffName: "Lê Văn C",
        workDate: "2025-07-04",
        startTime: "08:00:00",
        endTime: "12:00:00",
        roomName: "Phòng 101",
        departmentName: "Khoa Nội",
        status: "Chưa có ca khám",
        type: "shift",
      },
      {
        id: 4,
        staffId: 13,
        staffName: "Nguyễn Lập",
        workDate: "2025-07-05",
        startTime: "08:00:00",
        endTime: "12:00:00",
        roomName: "Phòng 101",
        departmentName: "Khoa Nội",
        status: "Chưa bắt đầu",
        type: "shift",
        patients: [
          { id: 1, name: "Nguyễn Văn A", age: 30, note: "Khám tổng quát" },
          { id: 2, name: "Trần Thị B", age: 25, note: "Khám tim mạch" },
        ],
      },
    ];
    setShifts(data);
    setFilteredShifts(data);
  };



  const events = filteredShifts.map((shift) => ({
    id: shift.id,
    title: `Nhân viên ${shift.staffName} - ${shift.roomName}`,
    start: `${shift.workDate}T${shift.startTime}`,
    end: `${shift.workDate}T${shift.endTime}`,
    extendedProps: { ...shift },
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
        const newData = shifts.filter((s) => s.id !== id);
        setShifts(newData);
        setFilteredShifts(newData);
        setModalDetail(false);
        message.success("Xóa ca làm việc thành công");
      },
    });
  };

  const onFinish = (values) => {
    const newShift = {
      id: editingShift ? editingShift.id : Date.now(),
      staffId: values.staffId,
      staffName: staffs.find((d) => d.id === values.staffId)?.name || "",
      workDate: values.workDate.format("YYYY-MM-DD"),
      startTime: values.startTime.format("HH:mm:ss"),
      endTime: values.endTime.format("HH:mm:ss"),
      roomName: values.roomName,
      departmentName: values.departmentName,
      status: values.status || "pending",
      type: "shift",
      patients: [],
    };
    const updated = editingShift
      ? shifts.map((s) => (s.id === editingShift.id ? newShift : s))
      : [...shifts, newShift];
    setShifts(updated);
    setModalVisible(false);
    message.success(editingShift ? "Cập nhật ca làm việc thành công" : "Thêm ca làm việc thành công");
  };

  const onFinishBulk = (values) => {
    const { staffIds, weekdays, shift, dateRange } = values;
    if (!staffIds || staffIds.length === 0) {
      message.error("Vui lòng chọn Nhân viên");
      return;
    }
    if (!weekdays || weekdays.length === 0) {
      message.error("Vui lòng chọn ngày trong tuần");
      return;
    }
    if (!shift || shift.length === 0) {
      message.error("Vui lòng chọn ca làm");
      return;
    }
    if (!dateRange || dateRange.length !== 2) {
      message.error("Vui lòng chọn khoảng thời gian");
      return;
    }
    const shiftTimes = {
      morning: { start: "08:00:00", end: "12:00:00" },
      afternoon: { start: "13:00:00", end: "17:00:00" }
    };

    const [startDate, endDate] = dateRange;
    const shiftsToAdd = [];
    let current = dayjs(startDate);

    while (current.isSameOrBefore(endDate, "day")) {
      if (weekdays.includes(current.day())) {
        shift.forEach((sh) => {
          staffIds.forEach((id) => {
            const staff = staffs.find((d) => d.id === id);
            shiftsToAdd.push({
              id: Date.now() + Math.random(),
              staffId: id,
              staffName: staff.name,
              workDate: current.format("YYYY-MM-DD"),
              startTime: shiftTimes[sh].start,
              endTime: shiftTimes[sh].end,
              roomName: "Phòng mặc định",
              departmentName: "Khoa mặc định",
              status: "Chưa bắt đầu",
              type: "shift",
              patients: [],
            });
          });
        });
      }
      current = current.add(1, "day");
    }

    setShifts((prev) => [...prev, ...shiftsToAdd]);
    message.success("Tạo lịch mẫu thành công!");
    bulkForm.resetFields();
  };

  const Legend = () => (
    <Row justify="center" gutter={16} style={{ marginBottom: 20 }}>
      <Col>
        <Tag icon={<CheckCircleOutlined />} color="#43a047" style={{ borderRadius: 8 }}>
          Đang làm
        </Tag>
      </Col>
      <Col>
        <Tag
          icon={<PauseCircleOutlined />}
          color="#ffd600"
          style={{ borderRadius: 8, color: "#4e342e" }}
        >
          Chưa bắt đầu
        </Tag>
      </Col>
      <Col>
        <Tag icon={<StopOutlined />} color="#bdbdbd" style={{ borderRadius: 8 }}>
          Không có ca
        </Tag>
      </Col>
      <Col>
        <Tag color="#2196f3" style={{ borderRadius: 8 }}>
          Khác
        </Tag>
      </Col>
    </Row>
  );

  return (
    <ConfigProvider locale={viVN}>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(120deg, #fafbfc 0%, #eef5f9 100%)",
          padding: "32px 0",
        }}
      >
        <div
          style={{
            maxWidth: 1220,
            margin: "auto",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 4px 32px #3575d324",
            padding: 32,
          }}
        >
          <Row justify="center">
            <Col>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  padding: "12px 40px",
                  borderRadius: 14,
                  background: "linear-gradient(90deg,#358cfb,#38c484 85%)",
                  color: "#fff",
                  marginBottom: 32,
                  userSelect: "none",
                }}
              >
                <CalendarOutlined style={{ marginRight: 16 }} />
                Quản lý lịch làm việc Nhân viên
              </h1>
            </Col>
          </Row>

          <Row justify="center" style={{ marginBottom: 32 }}>
            <Select
              allowClear
              showSearch
              placeholder="Chọn nhân viên hoặc y tá"
              style={{ width: 300 }}
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              onChange={setSelectedPersonId}
              value={selectedPersonId}
            >
              <OptGroup label="Y tá (Nurse)">
                {nurses.map(n => (
                  <Option key={`nurse-${n.id}`} value={n.id}>{n.fullname}</Option>
                ))}
              </OptGroup>
              <OptGroup label="Nhân viên (Staff)">
                {normalStaffs.map(s => (
                  <Option key={`staff-${s.id}`} value={s.id}>{s.fullname}</Option>
                ))}
              </OptGroup>
            </Select>
          </Row>

          <Legend />

          <Row gutter={28}>
            {/* Left column: Bulk create form */}
            <Col md={8} xs={24} style={{ marginBottom: 24 }}>
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 14,
                  boxShadow: "0 1px 8px #3575d311",
                  padding: "24px 18px",
                  height: '100%',
                }}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    marginBottom: 24,
                    color: "#3575d3",
                    textAlign: "center",
                  }}
                >
                  Tạo lịch mẫu cho Nhân viên
                </h2>
                <Form
                  layout="vertical"
                  form={bulkForm}
                  onFinish={onFinishBulk}
                  scrollToFirstError
                >
                  <Form.Item
                    name="staffIds"
                    label="Nhân viên"
                    rules={[{ required: true, message: "Vui lòng chọn Nhân viên." }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Chọn Nhân viên"
                      onChange={(value) => {
                        if (value.includes("all")) {
                          const allIds = staffs.map((n) => n.id);
                          bulkForm.setFieldsValue({ staffIds: allIds });
                        }
                      }}
                      style={{ borderRadius: 8 }}
                    >
                      <Option key="all" value="all">
                        Tất cả
                      </Option>
                      {staffs.map((doc) => (
                        <Option key={doc.id} value={doc.id}>
                          {doc.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="weekdays"
                    label="Ngày trong tuần"
                    rules={[{ required: true, message: "Vui lòng chọn ngày trong tuần." }]}
                  >
                    <Checkbox.Group options={weekdayOptions} />
                  </Form.Item>

                  <Form.Item
                    name="shift"
                    label="Ca làm"
                    rules={[{ required: true, message: "Vui lòng chọn ca làm." }]}
                  >
                    <Select mode="multiple" style={{ borderRadius: 8 }}>
                      <Option value="morning">Sáng</Option>
                      <Option value="afternoon">Chiều</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="dateRange"
                    label="Khoảng thời gian"
                    rules={[{ required: true, message: "Vui lòng chọn khoảng thời gian." }]}
                  >
                    <RangePicker style={{ width: "100%", borderRadius: 8 }} />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    style={{ borderRadius: 8 }}
                  >
                    Tạo lịch mẫu
                  </Button>
                </Form>
              </div>
            </Col>

            {/* Right column: calendar & "Tạo sự kiện" button */}
            <Col md={16} xs={24}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 15,
                  boxShadow: "0 2px 10px #2196f310",
                  padding: 12,
                  minHeight: 630,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Row justify="end" style={{ marginBottom: 8 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    style={{
                      background: "#2188ff",
                      border: "none",
                      borderRadius: 8,
                      boxShadow: "0 2px 10px #3575d322",
                    }}
                    onClick={() => onAddShift()}
                  >
                    Tạo sự kiện
                  </Button>
                </Row>

                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    start: "prev,next today",
                    center: "title",
                    end: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  locale="vi"
                  events={events}
                  height={600}
                  eventClick={(info) => onEditShift(info.event.extendedProps)}
                  eventDidMount={eventColor}
                  dateClick={(info) => onAddShift(info.dateStr)}
                  dayMaxEventRows={4}
                  firstDay={1}
                  allDaySlot={false}
                  slotMinTime="06:00:00"
                  slotMaxTime="18:00:00"
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                  contentHeight={550}
                  expandRows
                  eventContent={(eventInfo) => (
                    <b
                      title={eventInfo.event.title}
                      style={{ whiteSpace: "normal", cursor: "pointer" }}
                    >
                      {eventInfo.event.title}
                    </b>
                  )}
                />
              </div>
            </Col>
          </Row>

          {/* Modal: Add / Edit Shift */}
          <Modal
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            title={editingShift ? "Chỉnh sửa ca làm việc" : "Thêm ca làm việc"}
            footer={[
              <Button key="cancel" onClick={() => setModalVisible(false)} style={{ borderRadius: 8 }}>
                Hủy
              </Button>,
              <Button
                key="ok"
                type="primary"
                onClick={() => form.submit()}
                style={{ borderRadius: 8 }}
              >
                Lưu
              </Button>,
            ]}
            destroyOnClose
            centered
            bodyStyle={{ borderRadius: 14, padding: 24 }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                status: "pending",
              }}
              scrollToFirstError
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="staffId"
                    label="Nhân viên"
                    rules={[{ required: true, message: "Vui lòng chọn Nhân viên" }]}
                  >
                    <Select placeholder="Chọn Nhân viên" style={{ borderRadius: 8 }}>
                      {staffs.map((doc) => (
                        <Option key={doc.id} value={doc.id}>
                          {doc.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="workDate"
                    label="Ngày làm việc"
                    rules={[{ required: true, message: "Vui lòng chọn ngày làm việc" }]}
                  >
                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%", borderRadius: 8 }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="startTime"
                    label="Giờ bắt đầu"
                    rules={[{ required: true, message: "Vui lòng chọn giờ bắt đầu" }]}
                  >
                    <TimePicker
                      format="HH:mm"
                      style={{ width: "100%", borderRadius: 8 }}
                      minuteStep={5}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="endTime"
                    label="Giờ kết thúc"
                    rules={[{ required: true, message: "Vui lòng chọn giờ kết thúc" }]}
                  >
                    <TimePicker
                      format="HH:mm"
                      style={{ width: "100%", borderRadius: 8 }}
                      minuteStep={5}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="roomName"
                label="Phòng khám"
                rules={[{ required: true, message: "Vui lòng nhập phòng khám" }]}
              >
                <Input placeholder="Nhập tên phòng khám" style={{ borderRadius: 8 }} />
              </Form.Item>

              <Form.Item
                name="departmentName"
                label="Khoa"
                rules={[{ required: true, message: "Vui lòng nhập khoa" }]}
              >
                <Input placeholder="Nhập tên khoa" style={{ borderRadius: 8 }} />
              </Form.Item>

              <Form.Item name="status" label="Trạng thái">
                <Select style={{ borderRadius: 8 }} placeholder="Chọn trạng thái">
                  <Option value="pending">Đang chờ</Option>
                  <Option value="approved">Đã duyệt</Option>
                  <Option value="canceled">Đã hủy</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>

          {/* Modal: Chi tiết ca */}
          <Modal
            open={modalDetail}
            onCancel={() => setModalDetail(false)}
            footer={null}
            title={
              selectedEvent && (
                <div>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 22,
                      color: "#3575d3",
                      userSelect: "none",
                    }}
                  >
                    {selectedEvent.title}
                  </span>
                  {selectedEvent.departmentName && (
                    <div
                      style={{ fontSize: 15, color: "#1976d2", marginTop: 6, userSelect: "none" }}
                    >
                      {selectedEvent.departmentName} - Phòng {selectedEvent.roomName}
                    </div>
                  )}
                </div>
              )
            }
            width={620}
            centered
            bodyStyle={{
              borderRadius: 18,
              background: "#fcfcfe",
              padding: 28,
              minHeight: 280,
            }}
          >
            {selectedEvent && (
              <>
                <div style={{ marginBottom: 18, fontSize: 15, userSelect: "none" }}>
                  <b>Thời gian:</b> {selectedEvent.startTime} - {selectedEvent.endTime}
                  <br />
                  <b>Số bệnh nhân:</b> {(selectedEvent.patients && selectedEvent.patients.length) || 0}
                  <br />
                  <b>Trạng thái:</b> {selectedEvent.status || "Không rõ"}
                </div>
                <List
                  bordered
                  dataSource={selectedEvent.patients || []}
                  renderItem={(p) => (
                    <List.Item key={p.id} style={{ borderRadius: 10 }}>
                      <List.Item.Meta
                        title={<b>{p.name}</b>}
                        description={`Tuổi: ${p.age} | Ghi chú: ${p.note || "Không có"}`}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: "Chưa có bệnh nhân nào trong ca này." }}
                  style={{ marginBottom: 22, borderRadius: 12, background: "#fff" }}
                />
                <div
                  style={{
                    marginTop: 16,
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    type="primary"
                    style={{ borderRadius: 8 }}
                    onClick={() => {
                      setEditingShift(selectedEvent);
                      form.setFieldsValue({
                        staffId: selectedEvent.staffId,
                        workDate: dayjs(selectedEvent.workDate),
                        startTime: dayjs(selectedEvent.startTime, "HH:mm:ss"),
                        endTime: dayjs(selectedEvent.endTime, "HH:mm:ss"),
                        roomName: selectedEvent.roomName,
                        departmentName: selectedEvent.departmentName,
                        status: selectedEvent.status,
                      });
                      setModalVisible(true);
                      setModalDetail(false);
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button danger style={{ borderRadius: 8 }} onClick={() => onDeleteShift(selectedEvent.id)}>
                    Xóa
                  </Button>
                </div>
              </>
            )}
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default StaffShiftManagement;
