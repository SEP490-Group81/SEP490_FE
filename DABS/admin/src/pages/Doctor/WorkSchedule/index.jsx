import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { Modal, List, ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "./style.scss";
dayjs.locale("vi");

const workShiftsTest = [
  {
    id: "shift-1",
    title: "Ca làm việc",
    start: "2025-07-03T08:00:00",
    end: "2025-07-03T12:00:00",
    extendedProps: {
      type: "shift",
      department: "Khoa Nội",
      room: "Phòng 101",
      status: "Đang khám",
      patients: [
        { id: 1, name: "Nguyễn Văn A", age: 30, note: "Khám tổng quát" },
        { id: 2, name: "Trần Thị B", age: 25, note: "Khám tim mạch" },
      ],
    },
  },
  {
    id: "shift-2",
    title: "Ca làm việc",
    start: "2025-07-04T08:00:00",
    end: "2025-07-04T12:00:00",
  },
  {
    id: "shift-3",
    title: "Ca làm việc",
    start: "2025-07-05T08:00:00",
    end: "2025-07-05T12:00:00",
    extendedProps: {
      type: "shift",
      department: "Khoa Nội",
      room: "Phòng 101",
      status: "Chưa bắt đầu",
      patients: [
        { id: 1, name: "Nguyễn Văn A", age: 30, note: "Khám tổng quát" },
        { id: 2, name: "Trần Thị B", age: 25, note: "Khám tim mạch" },
      ],
    },
  },
];

const LegendColor = () => (
  <div style={{ marginBottom: 24, display: "flex", justifyContent:"center", gap: 8 }}>
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {[
        { color: "#4caf50", border: "#388e3c", label: "Đang khám" },
        { color: "#ffd54f", border: "#ffa000", label: "Chưa bắt đầu" },
        { color: "#ffb3b3", border: "#ff7875", label: "Ca đặt lịch (booking)" },
        { color: "#64b5f6", border: "#1976d2", label: "Ca làm việc khác" },
      ].map(({ color, border, label }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 16,
            height: 16,
            backgroundColor: color,
            border: `1px solid ${border}`,
            borderRadius: 4,
           
          }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  </div>
);

const WorkSchedule = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setEvents([...workShiftsTest]);
  }, []);

  const handleEventClick = ({ event }) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };



  const eventColor = (info) => {
    const { type, status } = info.event.extendedProps;
    if (type === "booking") {
      return {
        backgroundColor: "#ffb3b3",
        color: "black",
        borderRadius: "8px",
        border: "1px solid #ff7875",
        boxShadow: "0 2px 8px rgba(255,120,117,0.12)",
      };
    }
    if (status === "Đang khám") {
      return {
        backgroundColor: "#4caf50",
        color: "black",
        borderRadius: "8px",
        border: "1px solid #388e3c",
        boxShadow: "0 2px 8px rgba(76,175,80,0.12)",
      };
    }
    if (status === "Chưa bắt đầu") {
      return {
        backgroundColor: "#ffd54f",
        color: "black",
        borderRadius: "8px",
        border: "1px solid #ffa000",
        boxShadow: "0 2px 8px rgba(255,213,79,0.12)",
      };
    }
    return {
      backgroundColor: "#64b5f6",
      color: "black",
      borderRadius: "8px",
      border: "1px solid #1976d2",
      boxShadow: "0 2px 8px rgba(100,181,246,0.12)",
    };
  };

  return (
    <ConfigProvider locale={viVN}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 5,
          background: "#f9fafb",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: 32,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 1,
            color: "#1a237e",
            userSelect: "none",
          }}
        >
          Lịch làm việc của tôi
        </h2>
  <LegendColor />
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={viLocale}
          events={events}
          height={600}
          // eventContent={eventContent}
          eventClick={handleEventClick}
          eventDidMount={(info) => {
            Object.assign(info.el.style, eventColor(info));
          }}
          nowIndicator={true}
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
            selectedEvent.extendedProps?.type === "booking" ? (
              <div>
                <p><b>🕒 Thời gian:</b> {dayjs(selectedEvent.start).format("HH:mm")} - {dayjs(selectedEvent.end).format("HH:mm")}</p>
                <p><b>👤 Bệnh nhân:</b> {selectedEvent.extendedProps.patientName}</p>
                <p><b>📝 Ghi chú:</b> {selectedEvent.extendedProps.note || "Không có"}</p>
              </div>
            ) : (
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
                        description={`Tuổi: ${p.age} | Ghi chú: ${p.note || "Không có"}`}
                      />
                    </List.Item>
                  )}
                  locale={{ emptyText: "Chưa có bệnh nhân nào." }}
                  style={{ marginTop: 16 }}
                />
              </>
            )
          ) : (
            <div>Không có dữ liệu lịch làm việc.</div>
          )}
        </Modal>

      </div>
    </ConfigProvider>
  );
};

export default WorkSchedule;
