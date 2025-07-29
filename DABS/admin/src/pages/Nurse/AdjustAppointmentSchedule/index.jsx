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
} from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { getDoctorByHospitalId } from "../../../services/doctorService";
import { getSpecializationsByHospitalId } from "../../../services/specializationService";
import { getAppointmentsByUserId } from "../../../services/appointmentService";
import { getHospitalSpecializationSchedule } from "../../../services/scheduleService";
import { getAllPatients } from "../../../services/userService";
import { useSelector } from "react-redux";

const { Option } = Select;

const AdjustAppointmentSchedule = () => {
  const hospitalId = useSelector((state) => state.user.user?.hospitals?.[0]?.id);

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(null);

  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [currentRange, setCurrentRange] = useState({ start: null, end: null });

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
        setDoctors([]);
        message.error("Lấy danh sách bác sĩ thất bại");
      }

      try {
        const specs = await getSpecializationsByHospitalId(hospitalId);
        setSpecializations(specs || []);

      } catch {
        setSpecializations([]);
        message.error("Lấy danh sách chuyên khoa thất bại");
      }
    })();
  }, [hospitalId]);

  const fetchAppointments = async (patientId, start, end) => {
    if (!patientId) {
      setAppointments([]);
      return;
    }
    try {
      const list = await getAppointmentsByUserId(patientId, start.toISOString(), end.toISOString());
      console.log("getAppointmentsByUserId:", list);
      setSelectedDoctor(list[0]?.doctorSchedule?.doctorProfile?.id || null);
      setSelectedSpec(list[0]?.doctorSchedule?.specialization?.id || null);
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
            department: item.doctorSchedule.department,
            note: item.note,
            status:
              item.status === 1
                ? "Chưa xác nhận"
                : item.status === 2
                  ? "Đã xác nhận"
                  : "Không rõ",
            room: item.doctorSchedule.room?.name,
            serviceName: item.service?.name,
            appointmentId: item.id,
          },
          backgroundColor: "#389e0d",
          borderColor: "#237804",
          editable: true,
        };
      });
      setAppointments(events);
    } catch {
      message.error("Lấy lịch hẹn thất bại");
      setAppointments([]);
    }
  };

  
  const fetchSchedules = async (hospitalId, doctorId, specializationId, start, end) => {
    if (!hospitalId) {
      setSchedules([]);
      return;
    }
    try {
      const payload = {
        hospitalId,
        doctorIds: doctorId ? [doctorId] : [],
        specializationId: specializationId || null,
        dateFrom: start.format("YYYY-MM-DD"),
        dateTo: end.format("YYYY-MM-DD"),
      };
      console.log("Payload gọi getHospitalSpecializationSchedule:", payload);
      const result = await getHospitalSpecializationSchedule(payload);
      console.log("Kết quả getHospitalSpecializationSchedule:", result);

      const scheduleEvents = (result.schedules || []).map((item) => {
        const dateStr = item.workDate.split("T")[0];
        const startDT = dayjs(`${dateStr}T${item.startTime}`).toISOString();
        const endDT = dayjs(`${dateStr}T${item.endTime}`).toISOString();

        const doctorId = item.doctorProfile?.id || null;
        const specIds = item.specializationIds || [];

        return {
          id: `schedule-${item.id}`,
          title: item.timeShift === 1 ? "Ca sáng" : "Ca chiều",
          start: startDT,
          end: endDT,
          extendedProps: {
            type: "schedule",
            doctorId,
            specializationIds: specIds,
            room: item.room?.name,
            status: item.isAvailable ? "Đang làm" : "Không làm",
          },
          backgroundColor: "#1890ff",
          borderColor: "#096dd9",
          textColor: "white",
          editable: false,
          overlap: true,
          display: "block",
        };
      });
      setSchedules(scheduleEvents);
    } catch {
      message.error("Lấy lịch làm việc thất bại");
      setSchedules([]);
    }
  };

  const handleDatesSet = (arg) => {
    setCurrentRange({ start: dayjs(arg.start), end: dayjs(arg.end) });
  };

  
  useEffect(() => {
    if (!selectedPatientId || !currentRange.start || !currentRange.end) return;
    fetchAppointments(selectedPatientId, currentRange.start, currentRange.end);
  }, [selectedPatientId, currentRange, patients]);


  useEffect(() => {
    if (!hospitalId || !currentRange.start || !currentRange.end) {
      setSchedules([]);
      return;
    }
    fetchSchedules(hospitalId, selectedDoctor, selectedSpec, currentRange.start, currentRange.end);
  }, [hospitalId, selectedDoctor, selectedSpec, currentRange]);

  
  const handleEventDrop = (info) => {
    const event = info.event;

    if (event.extendedProps.type !== "appointment") {
      message.error("Chỉ có thể điều chỉnh lịch hẹn");
      info.revert();
      return;
    }

    const newStart = dayjs(event.start);
    const newEnd = event.end ? dayjs(event.end) : newStart.add(30, "minutes");


    const matchSchedule = schedules.find((sch) => {
      const schStart = dayjs(sch.start);
      const schEnd = dayjs(sch.end);

      const inSchedule = newStart.isSameOrAfter(schStart) && newEnd.isSameOrBefore(schEnd);
      const doctorOk =
        !selectedDoctor || sch.extendedProps.doctorId === event.extendedProps.doctorId;

      return inSchedule && doctorOk;
    });

    if (!matchSchedule) {
      message.error("Lịch hẹn phải nằm trong ca làm việc khả dụng.");
      info.revert();
      return;
    }

    setAppointments((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
            ...e,
            start: event.start.toISOString(),
            end: event.end ? event.end.toISOString() : null,
          }
          : e
      )
    );

    message.success("Đã cập nhật lịch hẹn!");

  };

  const handleEventClick = ({ event }) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const renderEventContent = (eventInfo) => {
    const { title, extendedProps } = eventInfo.event;;
    console.log("renderEventContent:", eventInfo.event);
    if (extendedProps.type === "schedule") {
      return (
        <div style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
          {title} - {extendedProps.room || ""}
        </div>
      );
    }

    return (
      <div>
        <b>{title}</b>
        <div style={{ fontSize: 10 }}>
          {extendedProps.patientName || ""}
          <br />
          Phòng: {extendedProps.room || ""}
        </div>
      </div>
    );
  };

  return (
    <ConfigProvider locale={viVN}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          Quản lý lịch hẹn & ca làm việc
        </h2>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Select
              showSearch
              allowClear
              placeholder="Chọn bệnh nhân"
              style={{ width: "100%" }}
              onChange={(val) => setSelectedPatientId(val)}
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

          <Col span={8}>
            <Select
              allowClear
              placeholder="Chọn bác sĩ"
              style={{ width: "100%" }}
              value={selectedDoctor}
              onChange={setSelectedDoctor}
              optionFilterProp="children"
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

          <Col span={8}>
            <Select
              allowClear
              placeholder="Chọn chuyên khoa"
              style={{ width: "100%" }}
              value={selectedSpec}
              onChange={setSelectedSpec}
              optionFilterProp="label"
            >
              {specializations.map((spec) => (
                <Option key={spec.id} value={spec.id} label={spec.name}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={spec.image}
                      alt={spec.name}
                      style={{ width: 24, height: 24, marginRight: 8 }}
                    />
                    {spec.name}
                  </div>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={viLocale}
          editable={true}
          events={[...appointments, ...schedules]}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventDurationEditable={false}
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
          title={selectedEvent?.title || "Chi tiết"}
        >
          {selectedEvent ? (
            <>
              <p>
                <b>Thời gian: </b>
                {dayjs(selectedEvent.start).format("HH:mm")} -{" "}
                {dayjs(selectedEvent.end).format("HH:mm")}
              </p>
              <p>
                <b>Phòng: </b> {selectedEvent.extendedProps.room || "Không rõ"}
              </p>
              {selectedEvent.extendedProps.type === "appointment" && (
                <>
                  <p>
                    <b>Bệnh nhân: </b>
                    {selectedEvent.extendedProps.patientName}
                  </p>
                  <p>
                    <b>Chuyên khoa: </b>
                    {selectedEvent.extendedProps.department || "Không rõ"}
                  </p>
                  <p>
                    <b>Trạng thái: </b>
                    {selectedEvent.extendedProps.status}
                  </p>
                  <p>
                    <b>Ghi chú: </b>
                    {selectedEvent.extendedProps.note || "Không có"}
                  </p>
                  {selectedEvent.extendedProps.serviceName && (
                    <p>
                      <b>Dịch vụ: </b> {selectedEvent.extendedProps.serviceName}
                    </p>
                  )}
                </>
              )}
              {selectedEvent.extendedProps.type === "schedule" && (
                <p>
                  <b>Trạng thái ca: </b>
                  {selectedEvent.extendedProps.status}
                </p>
              )}
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
