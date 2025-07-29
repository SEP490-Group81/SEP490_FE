import React, { useState } from "react";
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
        Đang làm
      </Tag>
    </Col>
    <Col>
      <Tag color="#ffd54f" style={{ borderRadius: 8, color: "#4e342e" }}>
        Chưa bắt đầu
      </Tag>
    </Col>
    <Col>
      <Tag color="#bdbdbd" style={{ borderRadius: 8 }}>
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

const StaffWorkSchedule = () => {
  const user = useSelector((state) => state.user.user);
  const hospitalId = user?.hospitals?.[0]?.id;
  const userId = user?.id;

  const [events, setEvents] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);

  const handleDatesSet = async (arg) => {
    if (!userId || !hospitalId) {
      setEvents([]);
      return;
    }

    try {
      const from = dayjs(arg.start).toISOString();
      const to = dayjs(arg.end).toISOString();

      const data = await getScheduleByStaffNurseId(userId, from, to, hospitalId);
      const schedules = data?.schedules || [];

      const now = dayjs();

      const eventsFormatted = schedules
        .filter(item => {
         
          return true; 
        })
        .map((item) => {
          const dateStr = item.workDate.split("T")[0];
          const start = dayjs(`${dateStr}T${item.startTime}`).toISOString();
          const end = dayjs(`${dateStr}T${item.endTime}`).toISOString();

          let status = "Không có ca";
          const hasAppointments = (item.appointment?.length || 0) > 0;

          if (hasAppointments) {
            if (now.isAfter(dayjs(end))) status = "Đã khám";
            else if (now.isBefore(dayjs(start))) status = "Chưa bắt đầu";
            else status = "Đang làm";
          } else {
            if (now.isAfter(dayjs(end))) status = "Không có ca (đã qua)";
            else if (now.isBefore(dayjs(start))) status = "Không có ca (sắp tới)";
            else status = "Không có ca (đang chờ)";
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
              status,
              room: item.room?.name || "Không rõ",
              patients,
             
              type: "shift",
            },
          };
        });

      setEvents(eventsFormatted);
    } catch (error) {
      console.error("Lỗi khi tải lịch làm việc nhân viên:", error);
      setEvents([]);
    }
  };

  const handleEventClick = ({ event }) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const eventColor = (info) => {
    const { status } = info.event.extendedProps;
    let backgroundColor = "#bdbdbd";
    let borderColor = "#9e9e9e";
    let textColor = "#212121";

    if (status === "Đang làm") {
      backgroundColor = "#4caf50";
      borderColor = "#388e3c";
      textColor = "#fff";
    } else if (status === "Chưa bắt đầu") {
      backgroundColor = "#ffd54f";
      borderColor = "#ffa000";
      textColor = "#4e342e";
    } else if (status.includes("Không có ca")) {
      backgroundColor = "#bdbdbd";
      borderColor = "#9e9e9e";
      textColor = "#212121";
    } else if (status === "Đã khám") {
      backgroundColor = "#43a047";
      borderColor = "#2e7d32";
      textColor = "#fff";
    } else {
      backgroundColor = "#2196f3";
      borderColor = "#1976d2";
      textColor = "#fff";
    }

    Object.assign(info.el.style, {
      backgroundColor,
      border: `1px solid ${borderColor}`,
      color: textColor,
      borderRadius: 8,
      fontWeight: "600",
      boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
    });
  };

  
  const renderEventContent = (eventInfo) => {
    const { title, extendedProps } = eventInfo.event;

    return (
      <div style={{ padding: "4px 6px", lineHeight: 1.2 }}>
        <div style={{ fontWeight: "bold", fontSize: 13 }}>{title}</div>
        {extendedProps.room && (
          <div style={{ fontSize: 11, color: "#eee", marginTop: 2 }}>
            🏥 {extendedProps.room}
          </div>
        )}
        {extendedProps.patients && extendedProps.patients.length > 0 && (
          <div style={{ fontSize: 11, color: "#eee" }}>
            👥 {extendedProps.patients.length} bệnh nhân
          </div>
        )}
      </div>
    );
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
          Lịch làm việc của tôi
        </h2>

        <LegendColor />

        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={viLocale}
          events={events}
          height={600}
          eventClick={handleEventClick}
          eventDidMount={eventColor}
          eventContent={renderEventContent}
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
                <span style={{ fontWeight: 700, fontSize: 20 }}>
                  {selectedEvent.title}
                </span>
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
                <b>👥 Bệnh nhân:</b>{" "}
                {selectedEvent.extendedProps?.patients?.length || 0}
              </p>

              <List
                dataSource={selectedEvent.extendedProps?.patients || []}
                renderItem={(patient) => (
                  <List.Item key={patient.id}>
                    <List.Item.Meta
                      title={<b>{patient.name}</b>}
                      description={`Tuổi: ${patient.age} | Ghi chú: ${
                        patient.note || "Không có"
                      }`}
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
    </ConfigProvider>
  );
};

export default StaffWorkSchedule;
