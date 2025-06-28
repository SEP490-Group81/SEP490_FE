import React, { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, List, ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";

const localizer = dayjsLocalizer(dayjs);
dayjs.locale("vi");

const apiData = {
  result: [
    {
      id: 25,
      doctorProfileId: 10,
      workDate: "2025-06-12T11:53:31.065",
      startTime: "05:00:00",
      endTime: "12:00:00",
      isAvailable: true,
      reasonOfUnavailability: null,
      room: {
        id: 10,
        name: "Room 10",
        roomCode: "R-010",
        description: "Room 10",
        department: {
          id: 15,
          name: "Khoa Khám bệnh",
          description:
            "Khám và tiếp nhận bệnh nhân ngoại trú, sàng lọc, chỉ định xét nghiệm và chẩn đoán ban đầu",
        },
        specialization: {
          id: 11,
          name: "Nội Tiêu Hoá",
          description: "Nội Tiêu Hoá",
          image:
            "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fmedpro-production%2Fdefault%2Favatar%2Fsubjects%2Ftieu_hoa.png&w=256&q=75",
        },
      },
      appointment: [],
    },
    {
      id: 26,
      doctorProfileId: 10,
      workDate: "2025-06-12T11:53:31.065",
      startTime: "13:00:00",
      endTime: "18:00:00",
      isAvailable: true,
      reasonOfUnavailability: null,
      room: {
        id: 10,
        name: "Room 10",
        roomCode: "R-010",
        description: "Room 10",
        department: {
          id: 15,
          name: "Khoa Khám bệnh",
          description:
            "Khám và tiếp nhận bệnh nhân ngoại trú, sàng lọc, chỉ định xét nghiệm và chẩn đoán ban đầu",
        },
        specialization: {
          id: 11,
          name: "Nội Tiêu Hoá",
          description: "Nội Tiêu Hoá",
          image:
            "https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn-pkh.longvan.net%2Fmedpro-production%2Fdefault%2Favatar%2Fsubjects%2Ftieu_hoa.png&w=256&q=75",
        },
      },
      appointment: [],
    },
  ],
  success: true,
  message: "Get data successfully",
};

const generateFakePatients = (count) => {
  const samplePatients = [
    { id: 1, name: "Nguyễn Văn A", age: 30, note: "Khám tổng quát" },
    { id: 2, name: "Trần Thị B", age: 25, note: "Khám tim mạch" },
    { id: 3, name: "Lê Văn C", age: 40, note: "Tái khám" },
    { id: 4, name: "Phạm Thị D", age: 29, note: "" },
  ];
  let patients = [];
  for (let i = 0; i < count; i++) {
    patients.push(samplePatients[i % samplePatients.length]);
  }
  return patients;
};

const mapApiDataToEvents = (data) => {
  return data.result.map((item) => {
    const dateStr = item.workDate.split("T")[0];
    const start = new Date(`${dateStr}T${item.startTime}`);
    const end = new Date(`${dateStr}T${item.endTime}`);

    const now = new Date();
    let status = "Chưa bắt đầu";
    if (now >= start && now <= end) status = "Đang khám";
    else if (now > end) status = "Đã kết thúc";

    const patientCount = Math.floor(Math.random() * 10);
    const patients = generateFakePatients(patientCount);

    return {
      id: item.id,
      title: `${item.room.specialization.name} - Phòng ${item.room.name}`,
      start,
      end,
      resource: {
        room: item.room.name,
        department: item.room.department.name,
        patientCount,
        status,
        patients,
      },
    };
  });
};

const getEventStyle = (event) => {
  let bgColor = "#bfbfbf";
 if (event.resource.status === "Đang khám") bgColor = "#52c41a"; // xanh lá đậm
else if (event.resource.status === "Chưa bắt đầu") bgColor = "#faad14"; // vàng cam
else if (event.resource.status === "Đã kết thúc") bgColor = "#69c0ff"; // xanh dương nhạt 
  return {
    style: {
      backgroundColor: bgColor,
      color: "#fff",
      borderRadius: 8,
      border: "none",
      fontWeight: 600,
      fontSize: 14,
      boxShadow: "0 2px 8px rgba(82,196,26,0.10)",
      padding: 8,
      cursor: "pointer",
    },
  };
};

const WorkSchedule = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Giả lập gọi API và map dữ liệu
    const mappedEvents = mapApiDataToEvents(apiData);
    setEvents(mappedEvents);
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <ConfigProvider locale={viVN}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
        <div
          style={{
            background: "#E8F2F7",
            padding: "16px 0",
            textAlign: "center",
            borderBottom: "2px solid #E8F2F7",
            borderRadius: 8,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontWeight: 700,
              fontSize: 28,
              margin: 0,
            }}
          >
            Lịch làm việc của tôi
          </h2>
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={["week", "day"]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, background: "#f6ffed", borderRadius: 12, padding: 8 }}
          messages={{
            week: "Tuần",
            day: "Ngày",
            today: "Hôm nay",
            previous: "Trước",
            next: "Sau",
            date: "Ngày",
            time: "Giờ",
            event: "Ca làm việc",
            noEventsInRange: "Không có ca làm việc trong tuần này.",
          }}
          eventPropGetter={getEventStyle}
          onSelectEvent={handleSelectEvent}
          popup
          culture="vi"
        />

        <Modal
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          title={
            selectedEvent && (
              <span>
                {selectedEvent.title} <br />
                <span style={{ fontSize: 14, color: "#52c41a" }}>
                  {selectedEvent.resource.department} - Phòng {selectedEvent.resource.room}
                </span>
              </span>
            )
          }
          footer={null}
          width={600}
        >
          {selectedEvent && (
            <>
              <div style={{ marginBottom: 12 }}>
                <b>Thời gian:</b> {dayjs(selectedEvent.start).format("HH:mm")} -{" "}
                {dayjs(selectedEvent.end).format("HH:mm")}
                <br />
                <b>Số bệnh nhân:</b> {selectedEvent.resource.patientCount}
                <br />
                <b>Trạng thái:</b> {selectedEvent.resource.status}
              </div>
              <List
                style={{ maxHeight: 300, overflowY: "auto" }}
                dataSource={selectedEvent.resource.patients || []}
                renderItem={(patient) => (
                  <List.Item key={patient.id}>
                    <List.Item.Meta
                      title={<span style={{ fontWeight: 500 }}>{patient.name}</span>}
                      description={
                        <span>
                          Tuổi: {patient.age} | Ghi chú: {patient.note || "Không có"}
                        </span>
                      }
                    />
                  </List.Item>
                )}
                locale={{ emptyText: "Chưa có bệnh nhân nào trong ca này." }}
              />
            </>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default WorkSchedule;
