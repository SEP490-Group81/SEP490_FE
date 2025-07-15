import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { Modal, List, ConfigProvider, Select, Row, Col, DatePicker, message } from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const { Option } = Select;

const fakeAppointments = [
  {
    id: "1",
    title: "Hẹn khám: Nguyễn Văn A",
    start: "2025-07-10T08:00:00",
    end: "2025-07-10T09:00:00",
    extendedProps: {
      doctorId: "bs001",
      department: "Nội",
      patientName: "Nguyễn Văn A",
      note: "Khám tổng quát",
    },
  },
  {
    id: "2",
    title: "Hẹn khám: Trần Thị B",
    start: "2025-07-10T10:00:00",
    end: "2025-07-10T11:00:00",
    extendedProps: {
      doctorId: "bs002",
      department: "Tim mạch",
      patientName: "Trần Thị B",
      note: "Khám theo dõi định kỳ",
    },
  },
];

const doctors = [
  { id: "bs001", name: "BS. Nguyễn Văn A" },
  { id: "bs002", name: "BS. Trần Thị B" },
];

const AdjustAppointmentSchedule = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({ doctorId: null, department: null, date: null });

  useEffect(() => {
    setEvents(fakeAppointments);
  }, []);

  useEffect(() => {
    let filtered = events;
    if (filters.doctorId) filtered = filtered.filter(e => e.extendedProps.doctorId === filters.doctorId);
    if (filters.department) filtered = filtered.filter(e => e.extendedProps.department === filters.department);
    if (filters.date) {
      const selectedDate = dayjs(filters.date).format("YYYY-MM-DD");
      filtered = filtered.filter(e => dayjs(e.start).format("YYYY-MM-DD") === selectedDate);
    }
    setFilteredEvents(filtered);
  }, [events, filters]);

  const handleEventClick = ({ event }) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleEventDrop = (info) => {
    const updated = events.map(e =>
      e.id === info.event.id
        ? {
            ...e,
            start: info.event.start,
            end: info.event.end,
          }
        : e
    );
    setEvents(updated);
    message.success("Đã chuyển lịch thành công!");
  };

  return (
    <ConfigProvider locale={viVN}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Điều chỉnh lịch hẹn bệnh nhân</h2>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Select
              showSearch
              allowClear
              placeholder="Chọn bác sĩ"
              style={{ width: "100%" }}
              onChange={(value) => setFilters(prev => ({ ...prev, doctorId: value }))}
              filterOption={(input, option) => option?.children.toLowerCase().includes(input.toLowerCase())}
            >
              {doctors.map(doc => (
                <Option key={doc.id} value={doc.id}>{doc.name}</Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              allowClear
              showSearch
              placeholder="Chuyên khoa"
              style={{ width: "100%" }}
              onChange={(value) => setFilters(prev => ({ ...prev, department: value }))}
              filterOption={(input, option) => option?.children.toLowerCase().includes(input.toLowerCase())}
            >
              <Option value="Nội">Nội</Option>
              <Option value="Tim mạch">Tim mạch</Option>
            </Select>
          </Col>
          <Col span={8}>
            <DatePicker
              placeholder="Chọn ngày"
              style={{ width: "100%" }}
              onChange={(date) => setFilters(prev => ({ ...prev, date }))}
            />
          </Col>
        </Row>

        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={viLocale}
          editable={true}
          events={filteredEvents}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
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
        />

        <Modal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
          centered
          title={selectedEvent?.title}
        >
          {selectedEvent ? (
            <>
              <p><b>🕒 Thời gian:</b> {dayjs(selectedEvent.start).format("HH:mm")} - {dayjs(selectedEvent.end).format("HH:mm")}</p>
              <p><b>👨‍⚕️ Bác sĩ:</b> {doctors.find(d => d.id === selectedEvent.extendedProps.doctorId)?.name}</p>
              <p><b>🏥 Chuyên khoa:</b> {selectedEvent.extendedProps.department}</p>
              <p><b>🧑‍🤝‍🧑 Bệnh nhân:</b> {selectedEvent.extendedProps.patientName}</p>
              <p><b>📝 Ghi chú:</b> {selectedEvent.extendedProps.note || "Không có"}</p>
            </>
          ) : <p>Không có dữ liệu</p>}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default AdjustAppointmentSchedule;
