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
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { getDoctorByHospitalId, getDoctorByUserId } from "../../../services/doctorService";
import { useRef } from "react";
import { getScheduleByDoctorId } from "../../../services/scheduleService";

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

const renderEventContent = (eventInfo) => {
  const { title, extendedProps } = eventInfo.event;
  const { status, patients } = extendedProps;

  return (
    <div style={{ padding: 2 }}>
      <div style={{ fontWeight: "bold" }}>{title.split(" - ")[0]}</div>
      <div style={{ fontSize: 12, color: "#333" }}>{status}</div>
      <div style={{ fontSize: 12 }}>👥 {patients.length} bệnh nhân</div>
    </div>
  );
};

const AdminDoctorShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingShift, setEditingShift] = useState(null);
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [modalDetail, setModalDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [events, setEvents] = useState([]);
  const dispatch = useDispatch();
  const { confirm } = Modal;
  const calendarRef = useRef();
  const user = useSelector((state) => state.user.user);
  console.log("hospital admin id is: " + user.hospitals[0]?.id);

  const isShiftDisabled = (event) => {
    if (!event) return true;

    const now = dayjs();
    const eventEnd = dayjs(event.end);

    const patients = event.extendedProps?.patients || [];

    if (patients.length > 0) return true;

    if (eventEnd.isBefore(now)) return true;

    return false;
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!user.id) return;
      const result = await getDoctorByUserId(selectedDoctorId);
      if (result) {
        console.log("result doctor detail : " + result);
        setDoctorDetail(result);
      } else {
        console.error("Không tìm thấy thông tin bác sĩ.");
      }
    };
    fetchDoctor();
  }, [selectedDoctorId]);

  useEffect(() => {
    if (doctorDetail && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const view = calendarApi.view;
      handleDatesSet({ start: view.activeStart, end: view.activeEnd });
    }
  }, [doctorDetail]);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!user.id) return;
      const result = await getDoctorByHospitalId(user.hospitals[0]?.id);
      if (result) {
        console.log("result doctor list : " + JSON.stringify(result));
        setDoctors(result);
      } else {
        console.error("Không tìm thấy thông tin bác sĩ.");
      }
    };
    fetchDoctor();
  }, [user.hospitals[0]?.id]);


  const handleDatesSet = async (arg) => {
    if (!doctorDetail) return;

    const from = dayjs(arg.start).toISOString();
    const to = dayjs(arg.end).toISOString();
    console.log("from schedule : " + from + " to Schedule : " + to);

    try {
      const result = await getScheduleByDoctorId(doctorDetail.id, from, to);
      console.log("result doctor schedule: " + JSON.stringify(result));
      const now = dayjs();

      const formattedEvents = result.map((item) => {
        const dateStr = item.workDate.split("T")[0];
        const startStr = `${dateStr}T${item.startTime}`;
        const endStr = `${dateStr}T${item.endTime}`;
        const start = dayjs(startStr);
        const end = dayjs(endStr);

        let status = "Ca làm việc khác";
        const hasAppointments = item.appointment?.length > 0;

        if (hasAppointments) {
          if (now.isAfter(end)) {
            status = "Đã khám";
          } else if (now.isBefore(start)) {
            status = "Chưa bắt đầu";
          } else {
            status = "Đang khám";
          }
        } else {
          if (now.isAfter(end)) {
            status = "Ca rỗng (đã qua)";
          } else if (now.isBefore(start)) {
            status = "Ca rỗng (sắp tới)";
          } else {
            status = "Ca rỗng (đang chờ)";
          }
        }

        const patients =
          item.appointment?.map((appt) => {
            const dob = dayjs(appt.patient.dob);
            const age = dayjs().diff(dob, "year");

            return {
              id: appt.id,
              name: appt.patient.fullname || "Không rõ",
              age,
              note: appt.note || "",
              gender: appt.patient.gender ? "Nam" : "Nữ",
              service: appt.service?.name || "Không rõ",
            };
          }) || [];

        return {
          id: item.id,
          title: item.timeShift === 1 ? "Ca sáng" : "Ca chiều",

          start: start.toISOString(),
          end: end.toISOString(),
          extendedProps: {
            type: status.includes("rỗng") ? "shift" : "appointment",
            department: item.room?.department?.name || "Không rõ",
            room: item.room?.name || "Không rõ",
            status,
            patients,
          },
        };
      });

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Lỗi khi tải lịch làm việc:", err);
    }
  };

  useEffect(() => {
    if (!selectedDoctorId) setFilteredShifts(shifts);
    else setFilteredShifts(shifts.filter((s) => s.doctorId === selectedDoctorId));
  }, [selectedDoctorId, shifts]);



  const onAddShift = (dateStr = null) => {
    setEditingShift(null);
    form.resetFields();
    if (dateStr) form.setFieldValue("workDate", dayjs(dateStr));
    setModalVisible(true);
  };

  const handleEventClick = ({ event }) => {
    // const clonedEvent = {
    //   ...event,
    //   extendedProps: {
    //     ...event.extendedProps,
    //     patients: Array.from({ length: 30 }, (_, i) => ({
    //       id: i + 1,
    //       name: `Bệnh nhân ${i + 1}`,
    //       age: 25 + (i % 10),
    //       gender: i % 2 === 0 ? "Nam" : "Nữ",
    //       service: "Khám tổng quát",
    //       note: `Ghi chú ${i + 1}`,
    //     })),
    //   },
    // };

    setSelectedEvent(event);
    console.log("Selected even in doctor shift management " + JSON.stringify(selectedEvent));
    setModalDetail(true);
  };
  const onDeleteShift = (id) => {
    confirm({
      title: "Xác nhận xóa ca làm việc?",
      onOk: () => {
        const newData = shifts.filter((s) => String(s.id) !== String(id));
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
      doctorId: values.doctorId,
      doctorName: doctors.find((d) => d.id === values.doctorId)?.name || "",
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
    const { doctorIds, weekdays, shift, dateRange } = values;
    if (!doctorIds || doctorIds.length === 0) {
      message.error("Vui lòng chọn bác sĩ");
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
      afternoon: { start: "13:00:00", end: "17:00:00" },
      evening: { start: "18:00:00", end: "21:00:00" },
    };

    const [startDate, endDate] = dateRange;
    const shiftsToAdd = [];
    let current = dayjs(startDate);

    while (current.isSameOrBefore(endDate, "day")) {
      if (weekdays.includes(current.day())) {
        shift.forEach((sh) => {
          doctorIds.forEach((id) => {
            const doctor = doctors.find((d) => d.id === id);
            shiftsToAdd.push({
              id: Date.now() + Math.random(),
              doctorId: id,
              doctorName: doctor.name,
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
        <Tag icon={<CalendarOutlined />} color="#3575d3" style={{ borderRadius: 8 }}>
          Đặt khám
        </Tag>
      </Col>
      <Col>
        <Tag icon={<CheckCircleOutlined />} color="#43a047" style={{ borderRadius: 8 }}>
          Đang khám
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
                Quản lý lịch làm việc bác sĩ
              </h1>
            </Col>
          </Row>

          <Row justify="center" style={{ marginBottom: 32 }}>
            <Select
              allowClear
              showSearch
              placeholder="Lọc theo bác sĩ"
              style={{
                width: 320,
                fontWeight: 600,
                background: "#f6fafd",
                borderRadius: 8,
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={(value) => setSelectedDoctorId(value)}
              value={selectedDoctorId}
            >
              {doctors.map((doc) => (
                <Option key={doc?.user?.id} value={doc?.user?.id}>
                  {doc?.user?.fullname}
                </Option>
              ))}
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
                  Tạo lịch mẫu cho bác sĩ
                </h2>
                <Form
                  layout="vertical"
                  form={bulkForm}
                  onFinish={onFinishBulk}
                  scrollToFirstError
                >
                  <Form.Item
                    name="doctorIds"
                    label="Bác sĩ"
                    rules={[{ required: true, message: "Vui lòng chọn bác sĩ." }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Chọn bác sĩ"
                      onChange={(value) => {
                        if (value.includes("all")) {
                          const allIds = doctors.map((n) => n.user?.id);
                          bulkForm.setFieldsValue({ doctorIds: allIds });
                        }
                      }}
                      style={{ borderRadius: 8 }}
                    >
                      <Option key="all" value="all">
                        Tất cả
                      </Option>
                      {doctors.map((doc) => (
                        <Option key={doc?.user?.id} value={doc?.user?.id}>
                          {doc?.user?.fullname}
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
                  ref={calendarRef}
                  eventContent={renderEventContent}
                  datesSet={handleDatesSet}
                  headerToolbar={{
                    start: "prev,next today",
                    center: "title",
                    end: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  locale="vi"
                  events={events}
                  height={600}
                  eventClick={handleEventClick}
                  eventDidMount={eventColor}
                  dateClick={(info) => onAddShift(info.dateStr)}
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
                />
              </div>
            </Col>
          </Row>

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
                    name="doctorId"
                    label="Bác sĩ"
                    rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}
                  >
                    <Select placeholder="Chọn bác sĩ" style={{ borderRadius: 8 }}>
                      {doctors.map((doc) => (
                        <Option key={doc?.user?.id} value={doc?.user?.id}>
                          {doc?.user?.fullname}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="nurseId"
                    label="Y tá"
                    rules={[{ required: true, message: "Vui lòng chọn y tá" }]}
                  >
                    <Select placeholder="Chọn Y tá" style={{ borderRadius: 8 }}>
                      {doctors.map((doc) => (
                        <Option key={doc?.user?.id} value={doc?.user?.id}>
                          {doc?.user?.fullname}
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
                <Col span={12}>
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

          <Modal
            open={modalDetail}
            onCancel={() => setModalDetail(false)}
            footer={[
              <Button
                key="edit"
                type="primary"
                disabled={isShiftDisabled(selectedEvent)}
                onClick={() => {
                  setEditingShift(selectedEvent);
                  form.setFieldsValue({
                    doctorId: selectedEvent.extendedProps?.doctorId || selectedDoctorId, // nếu có
                    workDate: selectedEvent.start ? dayjs(selectedEvent.start) : null,
                    startTime: selectedEvent.start ? dayjs(selectedEvent.start) : null,
                    endTime: selectedEvent.end ? dayjs(selectedEvent.end) : null,
                    roomName: selectedEvent.extendedProps?.room || "",
                    departmentName: selectedEvent.extendedProps?.department || "",

                  });
                  setModalVisible(true);
                  setModalDetail(false);
                }}
                style={{ borderRadius: 8 }}
              >
                Sửa
              </Button>,
              <Button
                key="delete"
                danger
                disabled={isShiftDisabled(selectedEvent)}
                onClick={() => onDeleteShift(selectedEvent.id)}
                style={{ borderRadius: 8 }}
              >
                Xoá
              </Button>,
              <Button
                key="close"
                onClick={() => setModalDetail(false)}
                style={{ borderRadius: 8 }}
              >
                Đóng
              </Button>,
            ]}
            centered
            bodyStyle={{ maxHeight: "50vh", overflowY: "auto", paddingRight: 12 }}
            title={selectedEvent ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 20 }}>
                  {selectedEvent.title}
                </span>
                {selectedEvent.extendedProps?.department && (
                  <span style={{ fontSize: 15, color: "#1a73e8" }}>
                    {selectedEvent.extendedProps.department} - {selectedEvent.extendedProps.room}
                  </span>
                )}
              </div>
            ) : null}
            width={600}
          >
            {selectedEvent ? (
              <>
                <p><b>🕒 Thời gian:</b> {dayjs(selectedEvent.start).format("HH:mm")} - {dayjs(selectedEvent.end).format("HH:mm")}</p>
                <p><b>👥 Số bệnh nhân:</b> {selectedEvent.extendedProps?.patients?.length || 0}</p>
                <p><b>📌 Trạng thái:</b> {selectedEvent.extendedProps?.status || "Không rõ"}</p>

                <List
                  dataSource={selectedEvent.extendedProps?.patients || []}
                  renderItem={(p) => (
                    <List.Item key={p.id}>
                      <List.Item.Meta
                        title={<b>{p.name}</b>}
                        description={`Tuổi: ${p.age} | Giới tính: ${p.gender} | Dịch vụ: ${p.service} | Ghi chú: ${p.note || "Không có"}`}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: "Chưa có bệnh nhân nào." }}
                  style={{ marginTop: 16 }}
                />
              </>
            ) : (
              <div>Không có dữ liệu lịch làm việc.</div>
            )}
          </Modal>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AdminDoctorShiftManagement;
