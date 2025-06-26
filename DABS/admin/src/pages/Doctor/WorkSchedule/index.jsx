import React, { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, List, ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";

const localizer = dayjsLocalizer(dayjs);
dayjs.locale("vi");

const events = [
    {
        id: 1,
        title: "Khám sáng - Nội tổng hợp",
        start: new Date(2025, 5, 25, 8, 0),
        end: new Date(2025, 5, 25, 11, 0),
        resource: {
            time: "Sáng",
            room: "201",
            department: "Nội tổng hợp",
            patientCount: 8,
            status: "Đang khám",
            patients: [
                { id: 1, name: "Nguyễn Văn A", age: 30, note: "Khám tổng quát" },
                { id: 2, name: "Trần Thị B", age: 25, note: "Khám tim mạch" },
                { id: 1, name: "Nguyễn Văn A", age: 30, note: "Khám tổng quát" },
                { id: 2, name: "Trần Thị B", age: 25, note: "Khám tim mạch" },
                { id: 1, name: "Nguyễn Văn A", age: 30, note: "Khám tổng quát" },
                { id: 2, name: "Trần Thị B", age: 25, note: "Khám tim mạch" },
                { id: 1, name: "Nguyễn Văn A", age: 30, note: "Khám tổng quát" },
                { id: 2, name: "Trần Thị B", age: 25, note: "Khám tim mạch" }
            ]
        }
    },
    {
        id: 2,
        title: "Khám chiều - Nội tiết",
        start: new Date(2025, 5, 25, 13, 30),
        end: new Date(2025, 5, 25, 16, 0),
        resource: {
            time: "Chiều",
            room: "202",
            department: "Nội tiết",
            patientCount: 5,
            status: "Chưa bắt đầu",
            patients: [
                { id: 3, name: "Lê Văn C", age: 40, note: "" }
            ]
        }
    },
    {
        id: 3,
        title: "Khám sáng - Ngoại tổng hợp",
        start: new Date(2025, 5, 26, 8, 0),
        end: new Date(2025, 5, 26, 11, 0),
        resource: {
            time: "Sáng",
            room: "301",
            department: "Ngoại tổng hợp",
            patientCount: 7,
            status: "Đã kết thúc",
            patients: [
                { id: 4, name: "Phạm Thị D", age: 29, note: "Tái khám" }
            ]
        }
    }
];

const getEventStyle = (event) => {
    let bgColor = "#bfbfbf";
    if (event.resource.status === "Đang khám") bgColor = "#52c41a";
    else if (event.resource.status === "Chưa bắt đầu") bgColor = "#faad14";
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
        }
    };
};

const WorkSchedule = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setModalOpen(true);
    };

    return (
        <ConfigProvider locale={viVN}>
            <div style={{ maxWidth: "objectFit", margin: "0 auto", padding: 24 }}>
                <div
                    style={{
                        background: "#E8F2F7",
                        padding: "16px 0",
                        textAlign: "center",
                        borderBottom: "2px solid #E8F2F7",
                        borderRadius: 8,
                        marginBottom: 24
                    }}
                >
                    <h2
                        style={{
                            fontWeight: 700,
                            fontSize: 28,
                            margin: 0
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
                        noEventsInRange: "Không có ca làm việc trong tuần này."
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
                                <b>Thời gian:</b> {dayjs(selectedEvent.start).format("HH:mm")} - {dayjs(selectedEvent.end).format("HH:mm")}<br />
                                <b>Số bệnh nhân:</b> {selectedEvent.resource.patientCount}<br />
                                <b>Trạng thái:</b> {selectedEvent.resource.status}
                            </div>
                            <List style={{ maxHeight: 300, overflowY: "auto" }}
                                dataSource={selectedEvent.resource.patients || []}
                                renderItem={patient => (
                                    <List.Item>
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
