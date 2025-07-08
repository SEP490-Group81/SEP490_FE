import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Table,
  Tag,
  Typography,
  Space,
  Divider,
} from "antd";
import { Line, Column, Bar } from "@ant-design/charts";
import moment from "moment";

const { Title } = Typography;

const HospitalStatisticPage = () => {
  const [dateRange, setDateRange] = useState([
    moment().startOf("month"),
    moment().endOf("month"),
  ]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = () => {
    setLoading(true);
    setTimeout(() => {
      setStats({
        appointments: 650,
        operations: 54,
        newPatients: 129,
        earnings: 20125,
        totalAppointments: 128,
        revenueToday: 4589,
        revenueTrend: [3, 6, 4, 7, 5, 8, 4],
        surveyChart: [
          { date: "Jan", new: 40, old: 30 },
          { date: "Feb", new: 35, old: 28 },
          { date: "Mar", new: 45, old: 34 },
          { date: "Apr", new: 55, old: 33 },
          { date: "May", new: 70, old: 40 },
          { date: "Jun", new: 80, old: 42 },
        ],
        appointmentsTable: [
          {
            key: 1,
            patient: "Nguyen Van A",
            doctor: "Dr. Binh",
            date: "2025-07-08",
            disease: "Sốt siêu vi",
          },
          {
            key: 2,
            patient: "Tran Thi B",
            doctor: "Dr. An",
            date: "2025-07-09",
            disease: "Viêm họng",
          },
        ],
        doctorStatus: [
          { key: 1, name: "Dr. Binh", status: "Available" },
          { key: 2, name: "Dr. An", status: "In Surgery" },
        ],
      });
      setLoading(false);
    }, 800);
  };

  const revenueBarConfig = {
    data: stats.revenueTrend?.map((r, i) => ({ day: `D${i + 1}`, revenue: r })) || [],
    xField: "day",
    yField: "revenue",
    height: 100,
    color: "#9254de",
    xAxis: { label: { autoRotate: false } },
    yAxis: { visible: false },
    legend: false,
  };

  const surveyConfig = {
    data: stats.surveyChart?.flatMap(({ date, new: n, old }) => [
      { type: "New Patients", date, value: n },
      { type: "Old Patients", date, value: old },
    ]) || [],
    xField: "date",
    yField: "value",
    seriesField: "type",
    height: 220,
    color: ["#52c41a", "#fa8c16"],
    smooth: true,
  };

  return (
    <div style={{ padding: 24, backgroundColor: "#f0f2f5" }}>
      <Title level={3} style={{ color: "#1890ff" }}>🏥 Thống kê bệnh viện</Title>

      {/* Top Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card style={{ backgroundColor: "#f9f0ff" }}><Statistic title="Appointments" value={stats.appointments} valueStyle={{ color: "#722ed1" }} /></Card></Col>
        <Col span={6}><Card style={{ backgroundColor: "#fff2e8" }}><Statistic title="Operations" value={stats.operations} valueStyle={{ color: "#fa541c" }} /></Card></Col>
        <Col span={6}><Card style={{ backgroundColor: "#f6ffed" }}><Statistic title="New Patients" value={stats.newPatients} valueStyle={{ color: "#389e0d" }} /></Card></Col>
        <Col span={6}><Card style={{ backgroundColor: "#e6f7ff" }}><Statistic title="Earnings" prefix="$" value={stats.earnings} valueStyle={{ color: "#096dd9" }} /></Card></Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card
            title={<span style={{ color: "#722ed1" }}>📊 Hospital Survey</span>}
            extra={<DatePicker.RangePicker value={dateRange} onChange={setDateRange} />}
          >
            <Line {...surveyConfig} />
          </Card>
        </Col>

        <Col span={8}>
          <Card>
            <Statistic title="Total Appointments" value={stats.totalAppointments} valueStyle={{ color: "#fa8c16" }} />
            <Divider style={{ margin: '12px 0' }} />
            <Statistic title="Revenue Today" prefix="$" value={stats.revenueToday} valueStyle={{ color: "#1890ff" }} />
            <div style={{ marginTop: 16 }}>
              <Column {...revenueBarConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title={<span style={{ color: "#13c2c2" }}>📅 Appointments</span>}>
            <Table
              size="small"
              pagination={false}
              dataSource={stats.appointmentsTable}
              columns={[
                { title: "Patient Name", dataIndex: "patient" },
                { title: "Assigned Doctor", dataIndex: "doctor" },
                { title: "Date", dataIndex: "date" },
                { title: "Disease", dataIndex: "disease" },
              ]}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<span style={{ color: "#fa541c" }}>👨‍⚕️ Doctor Status</span>}>
            <Table
              size="small"
              pagination={false}
              dataSource={stats.doctorStatus}
              columns={[
                { title: "Doctor Name", dataIndex: "name" },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (text) => (
                    <Tag color={text === "Available" ? "green" : "orange"}>{text}</Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HospitalStatisticPage;
