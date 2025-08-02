import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import {
  Modal,
  ConfigProvider,
  Select,
  Row,
  Col,
  message,
  Button,
  Typography,
  List,
} from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useSelector } from "react-redux";

import { getDoctorByHospitalId } from "../../../services/doctorService";
import { getSpecializationsByHospitalId } from "../../../services/specializationService";

import { getHospitalSpecializationSchedule } from "../../../services/scheduleService";
import { getAllPatients } from "../../../services/userService";
import { changeAppointmentStatus, changeAppointmentTime, getAppointmentsByUserId } from "../../../services/appointmentService";

const { Option } = Select;
const { Title, Text } = Typography;

const AdjustAppointmentSchedule = () => {
  const hospitalId = useSelector((state) => state.user.user?.hospitals?.[0]?.id);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [currentRange, setCurrentRange] = useState({ start: null, end: null });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [filterDoctorId, setFilterDoctorId] = useState(null);
  const [filterSpecId, setFilterSpecId] = useState(null);
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllPatients();
        setPatients(data || []);
      } catch {
        message.error("Lấy danh sách bệnh nhân thất bại");
      }
    })();
  }, []);

  useEffect(() => {
    if (!hospitalId) return;
    (async () => {
      try {
        const docs = await getDoctorByHospitalId(hospitalId);
        setDoctors(docs || []);
      } catch {
        message.error("Lấy danh sách bác sĩ thất bại");
        setDoctors([]);
      }
      try {
        const specs = await getSpecializationsByHospitalId(hospitalId);
        setSpecializations(specs || []);
      } catch {
        message.error("Lấy danh sách chuyên khoa thất bại");
        setSpecializations([]);
      }
    })();
  }, [hospitalId]);

  useEffect(() => {
    if (!selectedPatientId || !currentRange.start || !currentRange.end) {
      setAppointments([]);
      return;
    }
    (async () => {
      try {
        const payload = {
          userId: selectedPatientId,
          dateFrom: currentRange.start.format("YYYY-MM-DD"),
          dateTo: currentRange.end.format("YYYY-MM-DD"),  
        }
        console.log("payload in adjust appointment :", payload);
        const list = await getAppointmentsByUserId(
          selectedPatientId,
          currentRange.start.toISOString(),
          currentRange.end.toISOString()
        );
        console.log("Appointments list:", JSON.stringify(list));
        const events = list.map((item) => {
          const workDateStr = item.doctorSchedule.workDate.split("T")[0];
          const startDT = dayjs(`${workDateStr}T${item.doctorSchedule.startTime}`).toISOString();
          const endDT = dayjs(`${workDateStr}T${item.doctorSchedule.endTime}`).toISOString();
          const patient = patients.find((p) => p.id === item.patientId);
          return {
            id: `appointment-${item.id}`,
            title: `Hẹn khám: ${patient?.fullname || "Bệnh nhân"}`,
            start: startDT,
            end: endDT,
            extendedProps: {
              type: "appointment",
              patientId: item.patientId,
              patientName: patient?.fullname || "Không rõ",
              doctorId: item.doctorSchedule.doctorProfile?.id,
              doctorName: item.doctorSchedule.doctorProfile?.user?.fullname || "Không rõ",
              specializationId: item.doctorSchedule.specialization?.id,
              specializationName: item.doctorSchedule.specialization?.name,
              department: item.doctorSchedule.department,
              note: item.note,
              status:
                item.status === 1
                  ? "Chưa xác nhận"
                  : item.status === 2
                  ? "Đã xác nhận"
                  : item.status === 3
                  ? "Đã hủy"
                  : "Không rõ",
              room: item.doctorSchedule.room?.name,
              serviceName: item.service?.name,
              appointmentId: item.id,
            },
          };
        });
        setAppointments(events);
      } catch {
        message.error("Lấy lịch hẹn thất bại");
        setAppointments([]);
      }
    })();
  }, [selectedPatientId, currentRange, patients]);

  const openModal = (event) => {
    setSelectedEvent(event);
    setFilterDoctorId(event.extendedProps.doctorId || null);
    setFilterSpecId(event.extendedProps.specializationId || null);
    setAvailableSchedules([]);
    setSelectedScheduleId(null);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!hospitalId) return;
    if (!filterDoctorId && !filterSpecId) {
      setAvailableSchedules([]);
      return;
    }
    (async () => {
      try {
        const payload = {
          hospitalId,
          doctorIds: filterDoctorId ? [filterDoctorId] : [],
          specializationId: filterSpecId || null,
          dateFrom: currentRange.start.format("YYYY-MM-DD"),
          dateTo: currentRange.end.format("YYYY-MM-DD"),
        };
        const result = await getHospitalSpecializationSchedule(payload);
        const schedules = (result.schedules || []).filter((item) => item.isAvailable);
        setAvailableSchedules(schedules);
      } catch {
        message.error("Lấy ca làm việc khả dụng thất bại");
        setAvailableSchedules([]);
      }
    })();
  }, [hospitalId, filterDoctorId, filterSpecId, currentRange]);

  const handleDatesSet = (arg) => {
    setCurrentRange({ start: dayjs(arg.start), end: dayjs(arg.end) });
  };

  const handleChangeTime = async () => {
    if (!selectedEvent) {
      message.error("Chưa chọn lịch hẹn");
      return;
    }
    if (!selectedScheduleId) {
      message.error("Vui lòng chọn ca làm việc mới");
      return;
    }
    try {
      await changeAppointmentTime(selectedEvent.extendedProps.appointmentId, selectedScheduleId);
      message.success("Đã đổi thời gian lịch hẹn");
      setModalOpen(false);
      if (selectedPatientId && currentRange.start && currentRange.end) {
        const list = await getAppointmentsByUserId(
          selectedPatientId,
          currentRange.start.toISOString(),
          currentRange.end.toISOString()
        );
        const events = list.map((item) => {
          const workDateStr = item.doctorSchedule.workDate.split("T")[0];
          const startDT = dayjs(`${workDateStr}T${item.doctorSchedule.startTime}`).toISOString();
          const endDT = dayjs(`${workDateStr}T${item.doctorSchedule.endTime}`).toISOString();
          const patient = patients.find((p) => p.id === item.patientId);
          return {
            id: `appointment-${item.id}`,
            title: `Hẹn khám: ${patient?.fullname || "Bệnh nhân"}`,
            start: startDT,
            end: endDT,
            extendedProps: {
              type: "appointment",
              patientId: item.patientId,
              patientName: patient?.fullname || "Không rõ",
              doctorId: item.doctorSchedule.doctorProfile?.id,
              doctorName: item.doctorSchedule.doctorProfile?.user?.fullname || "Không rõ",
              specializationId: item.doctorSchedule.specialization?.id,
              specializationName: item.doctorSchedule.specialization?.name,
              department: item.doctorSchedule.department,
              note: item.note,
              status:
                item.status === 1
                  ? "Chưa xác nhận"
                  : item.status === 2
                  ? "Đã xác nhận"
                  : item.status === 3
                  ? "Đã hủy"
                  : "Không rõ",
              room: item.doctorSchedule.room?.name,
              serviceName: item.service?.name,
              appointmentId: item.id,
            },
          };
        });
        setAppointments(events);
      }
    } catch {
      message.error("Đổi thời gian không thành công");
    }
  };

  const handleChangeStatus = async () => {
    if (!selectedEvent) return;
    const appointmentId = selectedEvent.extendedProps.appointmentId;
    const currentStatusText = selectedEvent.extendedProps.status;

    const statusMap = {
      "Chưa xác nhận": 1,
      "Đã xác nhận": 2,
      "Đã hủy": 3,
      "Không rõ": 1,
    };

    const currentStatus = statusMap[currentStatusText] || 1;
    let newStatus;

    if (currentStatus === 3) {
      message.warning("Lịch đã hủy, không thể đổi trạng thái khác");
      return;
    }

    newStatus = currentStatus === 1 ? 2 : 1;

    try {
      await changeAppointmentStatus(appointmentId, newStatus);
      message.success("Đã đổi trạng thái lịch hẹn");
      setModalOpen(false);
      setSelectedPatientId((id) => id); 
    } catch {
      message.error("Đổi trạng thái không thành công");
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedEvent) return;
    const appointmentId = selectedEvent.extendedProps.appointmentId;

    const currentStatusText = selectedEvent.extendedProps.status;
    if (currentStatusText === "Đã hủy") {
      message.warning("Lịch hẹn đã được hủy trước đó");
      return;
    }

    try {
      await changeAppointmentStatus(appointmentId, 3);
      message.success("Đã hủy lịch hẹn");
      setModalOpen(false);
      setSelectedPatientId((id) => id); 
    } catch {
      message.error("Hủy lịch không thành công");
    }
  };

  const renderEventContent = (eventInfo) => {
    const { title, extendedProps } = eventInfo.event;
    return (
      <div>
        <b>{title}</b>
        <br />
        <small>{extendedProps.room || ""}</small>
      </div>
    );
  };

  return (
    <ConfigProvider locale={viVN}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Quản lý lịch hẹn & ca làm việc
        </Title>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Select
              showSearch
              allowClear
              placeholder="Chọn bệnh nhân"
              style={{ width: "100%" }}
              onChange={setSelectedPatientId}
              value={selectedPatientId}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              }
              optionLabelProp="children"
            >
              {patients.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.fullname || `Bệnh nhân #${p.id}`}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={viLocale}
          editable={false}
          events={appointments}
          eventContent={renderEventContent}
          eventClick={({ event }) => openModal(event)}
          height={600}
          nowIndicator
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          allDaySlot={false}
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          datesSet={handleDatesSet}
        />

        <Modal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
          centered
          title={
            selectedEvent?.title ? `Chi tiết: ${selectedEvent.title}` : "Chi tiết"
          }
          width={700}
        >
          {selectedEvent ? (
            <>
              <p>
                <b>Thời gian:</b>{" "}
                {dayjs(selectedEvent.start).format("DD/MM/YYYY HH:mm")} -{" "}
                {dayjs(selectedEvent.end).format("HH:mm")}
              </p>
              <p>
                <b>Bệnh nhân:</b> {selectedEvent.extendedProps.patientName}
              </p>
              <p>
                <b>Bác sĩ hiện tại:</b> {selectedEvent.extendedProps.doctorName || "Không rõ"}
              </p>
              <p>
                <b>Chuyên khoa hiện tại:</b>{" "}
                {selectedEvent.extendedProps.specializationName || "Không rõ"}
              </p>
              <p>
                <b>Phòng:</b> {selectedEvent.extendedProps.room || "Không rõ"}
              </p>
              <p>
                <b>Trạng thái:</b> {selectedEvent.extendedProps.status}
              </p>
              <p>
                <b>Ghi chú:</b> {selectedEvent.extendedProps.note || "Không có"}
              </p>

              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <label>Bác sĩ (lọc ca khả dụng):</label>
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    value={filterDoctorId}
                    onChange={setFilterDoctorId}
                    placeholder="Chọn bác sĩ"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {doctors.map((doc) => (
                      <Option key={doc.id} value={doc.id}>
                        {doc.user?.fullname || doc.description || `Bác sĩ #${doc.id}`}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={12}>
                  <label>Chuyên khoa (lọc ca khả dụng):</label>
                  <Select
                    allowClear
                    style={{ width: "100%" }}
                    value={filterSpecId}
                    onChange={setFilterSpecId}
                    placeholder="Chọn chuyên khoa"
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {specializations.map((spec) => (
                      <Option key={spec.id} value={spec.id}>
                        {spec.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>

              <div style={{ marginTop: 20 }}>
                <label>Chọn ca làm việc khả dụng để đổi lịch:</label>
                {availableSchedules.length === 0 ? (
                  <Text type="secondary">
                    Vui lòng chọn bác sĩ hoặc chuyên khoa để hiển thị ca làm việc khả dụng
                  </Text>
                ) : (
                  <List
                    bordered
                    dataSource={availableSchedules}
                    renderItem={(item) => {
                      const workDate = dayjs(item.workDate).format("DD/MM/YYYY");
                      return (
                        <List.Item
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedScheduleId === item.id ? "#bae7ff" : "transparent",
                          }}
                          onClick={() => setSelectedScheduleId(item.id)}
                        >
                          <Text strong>
                            Ca {item.timeShift === 1 ? "Sáng" : "Chiều"} - {workDate}
                          </Text>
                          <br />
                          <Text>
                            {item.startTime} - {item.endTime} - Phòng {item.room?.name || "Không rõ"}
                          </Text>
                        </List.Item>
                      );
                    }}
                    style={{ maxHeight: 200, overflowY: "auto", marginBottom: 16 }}
                  />
                )}
              </div>

              <div style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  disabled={!selectedScheduleId}
                  onClick={handleChangeTime}
                  style={{ marginRight: 8 }}
                >
                  Đổi lịch hẹn
                </Button>
                <Button onClick={handleChangeStatus} style={{ marginRight: 8 }}>
                  Đổi trạng thái
                </Button>
                <Button danger onClick={handleCancelAppointment}>
                  Hủy lịch hẹn
                </Button>
              </div>
            </>
          ) : (
            <p>Không có dữ liệu</p>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default AdjustAppointmentSchedule;
