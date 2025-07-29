import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import viLocale from "@fullcalendar/core/locales/vi";
import { Modal, List, ConfigProvider, Tag, Row, Col } from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getScheduleByStaffNurseId } from "../../../services/scheduleService"; // API call
import "dayjs/locale/vi";

dayjs.locale("vi");

const LegendColor = () => (
  <Row justify="center" gutter={16} style={{ marginBottom: 24 }}>
    <Col>
      <Tag color="#4caf50" style={{ borderRadius: 8 }}>
        Đang khám
      </Tag>
    </Col>
    <Col>
      <Tag color="#ffd54f" style={{ borderRadius: 8, color: "#4e342e" }}>
        Chưa bắt đầu
      </Tag>
    </Col>
    <Col>
      <Tag color="#ffb3b3" style={{ borderRadius: 8 }}>
        Ca đặt lịch (booking)
      </Tag>
    </Col>
    <Col>
      <Tag color="#64b5f6" style={{ borderRadius: 8 }}>
        Ca làm việc khác
      </Tag>
    </Col>
  </Row>
);

const WorkScheduleNurse = () => {
  const user = useSelector((state) => state.user.user);
  const hospitalId = user?.hospitals?.[0]?.id;
  const userId = user?.id;

  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Load lịch theo ngày hiển thị (datesSet)
  const handleDatesSet = async (arg) => {
    if (!userId || !hospitalId) {
      setEvents([]);
      return;
    }

    try {
      const from = dayjs(arg.start).toISOString();
      const to = dayjs(arg.end).toISOString();

      // Gọi API lấy lịch theo user đăng nhập và bệnh viện
      const data = await getScheduleByStaffNurseId(userId, from, to, hospitalId);
      const schedules = data?.schedules || [];

      const now = dayjs();

      // Format lịch thành sự kiện FullCalendar
      const eventsFormatted = schedules.map((item) => {
        const dateStr = item.workDate.split("T")[0];
        const start = dayjs(`${dateStr}T${item.startTime}`).toISOString();
        const end = dayjs(`${dateStr}T${item.endTime}`).toISOString();

        let status = "Ca làm việc khác";
        const hasAppointments = (item.appointment?.length || 0) > 0;

        if (hasAppointments) {
          if (now.isAfter(dayjs(end))) status = "Đã khám";
          else if (now.isBefore(dayjs(start))) status = "Chưa bắt đầu";
          else status = "Đang khám";
        } else {
          if (now.isAfter(dayjs(end))) status = "Ca rỗng (đã qua)";
          else if (now.isBefore(dayjs(start))) status = "Ca rỗng (sắp tới)";
          else status = "Ca rỗng (đang chờ)";
        }

        const patients = item.appointment?.map((appt) => ({
          id: appt.id,
          name: appt.patient.fullname,
          age: dayjs().diff(dayjs(appt.patient.dob), "year"),
          note: appt.note || "",
        })) || [];

        return {
          id: item.id,
          title: item.timeShift === 1 ? "Ca sáng" : "Ca chiều",
          start,
          end,
          extendedProps: {
            type: status.includes("rỗng") ? "shift" : "appointment",
            status,
            room: item.room?.name || "Không rõ",
            patients,
          },
        };
      });

      setEvents(eventsFormatted);
    } catch (error) {
      console.error("Lỗi khi tải lịch trực:", error);
      setEvents([]);
    }
  };

  const handleEventClick = ({ event }) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const renderEventContent = (eventInfo) => {
    const { title, extendedProps } = eventInfo.event;
    const { status, patients, department, room } = extendedProps;
    console.log("Event info:", eventInfo);
    console.log("Extended props:", extendedProps);

    return (
      <div
        style={{
          padding: 8,
          borderRadius: 6,
          backgroundColor: "#f9f9f9",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          lineHeight: 1.3,
        }}
      >
        {(department) && (
          <div
            style={{
              fontWeight: "600",
              color: "#2c3e50",
              marginBottom: 4,
            }}
          >
            {department}
          </div>
        )}
        {(room) && (
          <div
            style={{
              fontWeight: "600",
              color: "#2c3e50",
              marginBottom: 4,
            }}
          >
            {room}
          </div>
        )}
        <div
          style={{
            fontWeight: "700",
            fontSize: 14,
            color: "#34495e",
            marginBottom: 6,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={title}
        >
          {title.split(" - ")[0]}
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "6px 0" }} />

        <div
          style={{
            fontSize: 12,
            color: status === "Completed" ? "green" : "#e67e22",
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {status}
        </div>

        <div style={{ fontSize: 12, color: "#555" }}>
          👥 <strong>{patients.length}</strong> bệnh nhân
        </div>
      </div>
    );
  };

  const eventColor = (info) => {
    const { status } = info.event.extendedProps;

    let backgroundColor = "#90caf9";
    let borderColor = "#42a5f5";
    let color = "#000";

    switch (status) {
      case "Đang khám":
        backgroundColor = "#4caf50";
        borderColor = "#388e3c";
        color = "#fff";
        break;
      case "Chưa bắt đầu":
        backgroundColor = "#ffd54f";
        borderColor = "#ffa000";
        color = "#4e342e";
        break;
      case "Ca đặt lịch (booking)":
        backgroundColor = "#ffb3b3";
        borderColor = "#ff7875";
        color = "#000";
        break;
      case "Ca rỗng (đã qua)":
      case "Ca rỗng (sắp tới)":
      case "Ca rỗng (đang chờ)":
      default:
        backgroundColor = "#64b5f6";
        borderColor = "#1976d2";
        color = "#000";
        break;
    }

    Object.assign(info.el.style, {
      backgroundColor,
      border: `1px solid ${borderColor}`,
      color,
      borderRadius: 8,
      boxShadow: `0 2px 6px rgba(0, 0, 0, 0.15)`,
      fontWeight: "600",
    });
  };

  return (
    <ConfigProvider locale={viVN}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 24,
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
          Lịch trực của tôi
        </h2>

        <LegendColor />

        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={viLocale}
          events={events}
          height={600}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDidMount={eventColor}
          nowIndicator={true}
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
          width={600}
          title={
            selectedEvent ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  userSelect: "none",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 20 }}>{selectedEvent.title}</span>
                {selectedEvent.extendedProps?.room && (
                  <span style={{ fontSize: 15, color: "#1a73e8" }}>
                    Phòng: {selectedEvent.extendedProps.room}
                  </span>
                )}
              </div>
            ) : null
          }
        >
          {selectedEvent ? (
            <>
              <p>
                <b>🕒 Thời gian:</b> {dayjs(selectedEvent.start).format("HH:mm")} -{" "}
                {dayjs(selectedEvent.end).format("HH:mm")}
              </p>
              <p>
                <b>👥 Bệnh nhân:</b> {selectedEvent.extendedProps?.patients?.length || 0}
              </p>

              <List
                dataSource={selectedEvent.extendedProps?.patients || []}
                renderItem={(patient) => (
                  <List.Item key={patient.id}>
                    <List.Item.Meta
                      title={<b>{patient.name}</b>}
                      description={`Tuổi: ${patient.age} | Ghi chú: ${patient.note || "Không có"}`}
                    />
                  </List.Item>
                )}
                locale={{ emptyText: "Chưa có bệnh nhân nào." }}
                style={{ marginTop: 16 }}
              />
            </>
          ) : (
            <div>Không có dữ liệu lịch trực.</div>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default WorkScheduleNurse;
