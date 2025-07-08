import React from "react";
import { Card, Row, Col, Button, List, Avatar, Typography } from "antd";
import { CalendarOutlined, UserOutlined, NotificationOutlined } from "@ant-design/icons";

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

const DoctorHome = () => {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <Title style={{ display: "flex", textAlign: "center" }} level={2}>Chào bác sĩ Nguyễn Văn A</Title>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="Lịch làm việc hôm nay" extra={<Button type="link">Xem chi tiết</Button>}>
            <List
              itemLayout="horizontal"
              dataSource={fakeTodaySchedule}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<CalendarOutlined style={{ fontSize: 24, color: item.status === "Đang khám" ? "#52c41a" : "#faad14" }} />}
                    title={`${item.time} - ${item.specialization}`}
                    description={`Phòng: ${item.room} | Bệnh nhân: ${item.patientCount} | Trạng thái: ${item.status}`}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card
            title="Tin tức y khoa mới nhất"
            style={{ marginTop: 24 }}
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
          <Card title="Thông tin cá nhân" style={{ textAlign: "center" }}>
            <Avatar size={100} icon={<UserOutlined />} />
            <Title level={4} style={{ marginTop: 16 }}>
              Nguyễn Văn A
            </Title>
            <Text>Chuyên môn: Nội Tiêu Hoá</Text>
            <br />
            <Text>Kinh nghiệm: 10 năm</Text>
            <br />
            <Button type="primary" style={{ marginTop: 16 }}>
              Cập nhật hồ sơ
            </Button>
          </Card>

          <Card
            title="Thông báo phòng khám"
            style={{ marginTop: 24 }}
            extra={<Button type="link">Xem tất cả</Button>}
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
