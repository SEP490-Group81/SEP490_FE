import React from "react";
import { Row, Col, Card, Statistic, Typography } from "antd";
import { UserOutlined, TeamOutlined, CalendarOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";

const { Title } = Typography;

const statsData = [
  { title: "Tổng bác sĩ", value: 45, icon: <UserOutlined style={{ color: "#1890ff" }} /> },
  { title: "Nhân viên y tế", value: 120, icon: <TeamOutlined style={{ color: "#52c41a" }} /> },
  { title: "Ca khám hôm nay", value: 78, icon: <CalendarOutlined style={{ color: "#faad14" }} /> },
  { title: "Bệnh nhân đang điều trị", value: 150, icon: <FileDoneOutlined style={{ color: "#eb2f96" }} /> },
];

const chartData = [
  { khoa: "Nội", soCa: 40 },
  { khoa: "Ngoại", soCa: 30 },
  { khoa: "Sản", soCa: 20 },
  { khoa: "Nhi", soCa: 15 },
  { khoa: "Tai Mũi Họng", soCa: 10 },
];

const config = {
  data: chartData,
  xField: "khoa",
  yField: "soCa",
  label: {
    style: {
      fill: "#FFFFFF",
      opacity: 0.6,
    },
  },
  xAxis: {
    label: {
      autoHide: true,
      autoRotate: false,
    },
  },
  meta: {
    khoa: { alias: "Khoa" },
    soCa: { alias: "Số ca khám" },
  },
  color: "#1890ff",
};

const AdminSystemHomePage = () => (
  <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
    <Title level={2} style={{ marginBottom: 24 }}>
      Dashboard Thống kê Bệnh viện
    </Title>

    <Row gutter={24}>
      {statsData.map((stat) => (
        <Col xs={24} sm={12} md={6} key={stat.title}>
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

    <Card title="Số ca khám theo khoa" style={{ marginTop: 32 }}>
      <Column {...config} />
    </Card>
  </div>
);

export default AdminSystemHomePage;
