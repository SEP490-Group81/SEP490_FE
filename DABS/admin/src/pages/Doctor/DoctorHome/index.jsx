import React from "react";
import { Card, Row, Col, Button, List, Avatar, Typography, Tag, Divider } from "antd";
import { CalendarOutlined, UserOutlined, NotificationOutlined, EnvironmentOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const fakeTodaySchedule = [
  {
    id: 1,
    time: "08:00 - 11:00",
    room: "Phòng 10",
    specialization: "Nội Tiêu Hoá",
    status: "Đang khám",
    patientCount: 5,
  },
  {
    id: 2,
    time: "13:00 - 18:00",
    room: "Phòng 10",
    specialization: "Nội Tiêu Hoá",
    status: "Chưa bắt đầu",
    patientCount: 3,
  },
];

const fakeNews = [
  { id: 1, title: "Cập nhật phương pháp điều trị mới cho bệnh tiêu hóa", date: "27/06/2025" },
  { id: 2, title: "Lời khuyên chăm sóc sức khỏe mùa hè", date: "25/06/2025" },
];

const getStatusTag = (status) => {
  switch (status) {
    case "Đang khám":
      return <Tag color="green">{status}</Tag>;
    case "Chưa bắt đầu":
      return <Tag color="orange">{status}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};

const DoctorHome = () => {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: 24 }}>
      <Title style={{ textAlign: "center", color: "#1890ff" }} level={2}>Chào bác sĩ Nguyễn Văn A</Title>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title="🗓️ Lịch làm việc hôm nay"
            extra={<Button type="link">Xem chi tiết</Button>}
            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={fakeTodaySchedule}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <CalendarOutlined
                        style={{
                          fontSize: 24,
                          color: item.status === "Đang khám" ? "#52c41a" : "#faad14",
                        }}
                      />
                    }
                    title={
                      <span>
                        <strong>{item.time}</strong> - {item.specialization} {getStatusTag(item.status)}
                      </span>
                    }
                    description={
                      <Text>
                        Phòng: {item.room} | Bệnh nhân: {item.patientCount}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card
            title="📰 Tin tức y khoa mới nhất"
            style={{ marginTop: 24, borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            extra={<Button type="link">Xem tất cả</Button>}
          >
            <List
              dataSource={fakeNews}
              renderItem={(item) => (
                <List.Item>
                  <Text strong>{item.title}</Text> <Text type="secondary">({item.date})</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="👤 Thông tin cá nhân"
            style={{
              textAlign: "center",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: 24,
            }}
          >
            <Avatar size={100} icon={<UserOutlined />} />
            <Title level={4} style={{ marginTop: 16 }}>
              Nguyễn Văn A
            </Title>
            <Text>Chuyên môn: Nội Tiêu Hoá</Text>
            <br />
            <Text>Kinh nghiệm: 10 năm</Text>
            <br />
            <Divider />
            <EnvironmentOutlined style={{ color: "#1890ff", marginRight: 8 }} />
            <Text strong>Bệnh viện: Bệnh viện Đại học Y Dược TP.HCM</Text>
            <br />
            <Button type="primary" style={{ marginTop: 16 }}>
              Cập nhật hồ sơ
            </Button>
          </Card>

          <Card
            title="🔔 Thông báo phòng khám"
            extra={<Button type="link">Xem tất cả</Button>}
            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
          >
            <List>
              <List.Item>
                <NotificationOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                <Text>Thay đổi giờ làm việc từ 01/07/2025</Text>
              </List.Item>
              <List.Item>
                <NotificationOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                <Text>Yêu cầu cập nhật giấy phép hành nghề</Text>
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorHome;
