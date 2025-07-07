import React from "react";
import { Card, Row, Col, Statistic, List, Button, Typography, Progress } from "antd";
import { UserOutlined, TeamOutlined, CalendarOutlined, NotificationOutlined } from "@ant-design/icons";
const AdminHospitalHome = () => {
const { Title, Text } = Typography;

const statsData = [
  { title: "Tổng bác sĩ", value: 45, icon: <UserOutlined style={{ color: "#1890ff" }} /> },
  { title: "Nhân viên y tế", value: 120, icon: <TeamOutlined style={{ color: "#52c41a" }} /> },
  { title: "Ca khám hôm nay", value: 78, icon: <CalendarOutlined style={{ color: "#faad14" }} /> },
  { title: "Bệnh nhân đang điều trị", value: 150, icon: <UserOutlined style={{ color: "#eb2f96" }} /> },
];

const notifications = [
  { id: 1, content: "Yêu cầu duyệt lịch nghỉ phép từ nhân viên Nguyễn Văn A", date: "28/06/2025" },
  { id: 2, content: "Cập nhật quy trình phòng chống dịch Covid-19", date: "27/06/2025" },
  { id: 3, content: "Lịch họp ban giám đốc ngày 30/06/2025", date: "26/06/2025" },
];


  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Title level={2}>Chào Admin Nguyễn Văn B</Title>

      <Row gutter={24}>
        {statsData.map((stat) => (
          <Col span={6} key={stat.title}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: "#3f8600", fontWeight: "bold" }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="Quản lý nhanh">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Button type="primary" block>
                  Quản lý bác sĩ
                </Button>
              </Col>
              <Col span={8}>
                <Button type="primary" block>
                  Quản lý nhân viên
                </Button>
              </Col>
              <Col span={8}>
                <Button type="primary" block>
                  Quản lý lịch làm việc
                </Button>
              </Col>
              <Col span={8}>
                <Button type="primary" block>
                  Quản lý phòng khám
                </Button>
              </Col>
              <Col span={8}>
                <Button type="primary" block>
                  Duyệt lịch hẹn
                </Button>
              </Col>
              <Col span={8}>
                <Button type="primary" block>
                  Báo cáo & Thống kê
                </Button>
              </Col>
            </Row>
          </Card>

          <Card title="Thông báo nội bộ" style={{ marginTop: 24 }}>
            <List
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item>
                  <NotificationOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                  <Text>{item.content}</Text> <Text type="secondary">({item.date})</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Hiệu suất làm việc" style={{ textAlign: "center" }}>
            <Text strong>Hiệu suất sử dụng phòng khám</Text>
            <Progress percent={75} status="active" />
            <Text strong style={{ marginTop: 16, display: "block" }}>
              Tỷ lệ đặt lịch thành công
            </Text>
            <Progress percent={85} status="success" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHospitalHome;
