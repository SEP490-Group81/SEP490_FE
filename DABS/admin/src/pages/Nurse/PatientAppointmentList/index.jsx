import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Badge,
  Tabs,
  ConfigProvider,
  Typography,
  Button,
  message,
  Select,
  Modal,
  Descriptions,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import viVN from "antd/es/locale/vi_VN";
import { useSelector } from "react-redux";
import {
  getAppointmentsByUserId,
} from "../../../services/appointmentService";
import { getAllPatients } from "../../../services/userService";
import dayjs from "dayjs";

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const statusMap = {
  1: { text: "Chưa xác nhận", color: "gold" },
  2: { text: "Đã xác nhận", color: "green" },
  3: { text: "Đã hủy", color: "grey" },
  4: { text: "Hoàn thành", color: "blue" },
};

const PatientAppointmentList = () => {
  const user = useSelector((state) => state.user.user || null);

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [appointmentList, setAppointmentList] = useState([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllPatients();
        setPatients(data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bệnh nhân", error);
        setPatients([]);
      }
    })();
  }, []);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  // Lấy data lịch hẹn theo selectedPatientId
  useEffect(() => {
    if (!selectedPatientId) {
      setAppointmentList([]);
      return;
    }
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const appointments = await getAppointmentsByUserId(selectedPatientId);
        // Format dữ liệu theo yêu cầu
        const formatted = (appointments || []).map((item) => {
          const workDate = item.doctorSchedule.workDate?.split("T")[0] || "";
          const startTimeStr = `${workDate}T${item.doctorSchedule.startTime}`;
          const endTimeStr = `${workDate}T${item.doctorSchedule.endTime || ""}`;

          return {
            id: String(item.id),
            patientName: patients.find((p) => p.id === item.patientId)?.fullname || "",
            phoneNumber: "", // Nếu có phone bạn map thêm
            doctorName: item.doctorSchedule.doctorProfile?.description || "Không rõ",
            specializationName: item.doctorSchedule.specialization?.name || "",
            appointmentTime: formatDateTime(item.appointmentTime),
            workDate,
            startTime: formatDateTime(startTimeStr),
            endTime: dayjs(endTimeStr).format("HH:mm"),
            status: item.status,
            note: item.note || "",
            roomName: item.doctorSchedule.room?.name || "",
            serviceName: item.serviceName || item.service?.name || "",
            rawData: item, // lưu toàn bộ để xem modal tiện
          };
        });
        setAppointmentList(formatted);
      } catch (error) {
        message.error("Lỗi khi tải danh sách lịch hẹn");
        setAppointmentList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [selectedPatientId, patients]);

  // Tính đếm trạng thái
  const statusCounts = useMemo(() => {
    const counts = { all: 0 };
    Object.keys(statusMap).forEach((k) => (counts[k] = 0));

    appointmentList.forEach((item) => {
      counts.all += 1;
      if (item.status in counts) {
        counts[item.status] += 1;
      }
    });
    return counts;
  }, [appointmentList]);

  // Lọc theo tab và search
  const filteredAppointments = useMemo(() => {
    const lowerSearch = searchText.toLowerCase();
    return appointmentList.filter((item) => {
      const statusMatch = activeTab === "all" || String(item.status) === activeTab;
      const searchMatch =
        item.patientName.toLowerCase().includes(lowerSearch) ||
        item.doctorName.toLowerCase().includes(lowerSearch) ||
        item.serviceName.toLowerCase().includes(lowerSearch) ||
        item.roomName.toLowerCase().includes(lowerSearch) ||
        item.id.toLowerCase().includes(lowerSearch);
      return statusMatch && searchMatch;
    });
  }, [appointmentList, searchText, activeTab]);

  // Các cột table
  const columns = [
    { title: "Mã lịch hẹn", dataIndex: "id", key: "id" },
    { title: "Bệnh nhân", dataIndex: "patientName", key: "patientName" },

    {
      title: "Thời gian khám",
      key: "appointmentTime",
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    { title: "Phòng", dataIndex: "roomName", key: "roomName" },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const st = statusMap[record.status];
        return st ? <Tag color={st.color}>{st.text}</Tag> : <Tag color="default">Không rõ</Tag>;
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedAppointment(record.rawData);
            setModalOpen(true);
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <ConfigProvider locale={viVN}>
      <div style={{ maxWidth: 1200, margin: "20px auto" }}>
        <Row gutter={[16, 24]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              showSearch
              allowClear
              placeholder="Chọn bệnh nhân"
              optionFilterProp="children"
              value={selectedPatientId}
              onChange={setSelectedPatientId}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: "100%" }}
            >
              {patients.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.fullname || `Bệnh nhân #${p.id}`}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
        </Row>

        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
          <TabPane key="all" tab={<span>Tất cả <Badge count={statusCounts.all} /></span>} />
          {Object.entries(statusMap).map(([key, val]) => (
            <TabPane
              key={key}
              tab={
                <span>
                  {val.text} <Badge count={statusCounts[key]} style={{ backgroundColor: val.color }} />
                </span>
              }
            />
          ))}
        </Tabs>

        <Card bordered={false} style={{ borderRadius: 12 }}>
          <Table
            columns={columns}
            dataSource={filteredAppointments}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </Card>

        {/* Modal xem chi tiết */}
        <Modal
          visible={modalOpen}
          title="Chi tiết lịch hẹn"
          footer={<Button onClick={() => setModalOpen(false)}>Đóng</Button>}
          onCancel={() => setModalOpen(false)}
          width={700}
          centered
        >
          {selectedAppointment ? (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Mã lịch hẹn">{selectedAppointment.id}</Descriptions.Item>
              <Descriptions.Item label="Dịch vụ">{selectedAppointment.serviceName}</Descriptions.Item>
              <Descriptions.Item label="Thời gian hẹn">
                {formatDateTime(selectedAppointment.appointmentTime)}
              </Descriptions.Item>
              <Descriptions.Item label="Bác sĩ">
                {selectedAppointment.doctorProfile?.description || selectedAppointment.doctorName || "Không rõ"}
              </Descriptions.Item>
              <Descriptions.Item label="Chuyên khoa">
                {selectedAppointment.doctorSchedule?.specialization?.name || selectedAppointment.specializationName || "Không rõ"}
              </Descriptions.Item>
              <Descriptions.Item label="Phòng">
                {selectedAppointment.doctorSchedule?.room?.name || selectedAppointment.roomName || "Không rõ"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {statusMap[selectedAppointment.status]?.text || "Không rõ"}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{selectedAppointment.note || "Không có"}</Descriptions.Item>
            </Descriptions>
          ) : (
            <p>Không có dữ liệu</p>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default PatientAppointmentList;
