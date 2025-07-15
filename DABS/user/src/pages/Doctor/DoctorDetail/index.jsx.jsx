import { Row, Col, Card, Avatar, Button, Typography, List } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function DoctorDetailPage() {
const { Title, Text, Paragraph } = Typography;


const doctorsSameFacility = [
  {
    name: "BS. Nguyễn Văn B",
    specialty: "Nội tổng quát",
    photoUrl: "https://example.com/doctor1.jpg",
    description: "Chuyên gia nội tổng quát, hơn 10 năm kinh nghiệm.",
  },
  {
    name: "BS. Trần Thị C",
    specialty: "Nhi khoa",
    photoUrl: "https://example.com/doctor2.jpg",
    description: "Bác sĩ nhi khoa, tận tâm với trẻ em.",
  },
];


  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh", padding: "32px 0" }}>
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={24} align="middle">
            <Col xs={24} md={4} style={{ textAlign: "center" }}>
              <Avatar size={90} src="https://example.com/avatar.jpg" icon={<UserOutlined />} />
            </Col>
            <Col xs={24} md={16}>
              <Title level={3} style={{ marginBottom: 0 }}>Ths BS. Lê Hoàng Thiên</Title>
              <Text strong>Chuyên khoa:</Text> Tổng Quát<br />
              <Text strong>Chuyên trị:</Text> Nội tổng quát<br />
              <Text strong>Giá khám:</Text> 149.000đ<br />
              <Text strong>Lịch khám:</Text> Hẹn khám
            </Col>
            <Col xs={24} md={4} style={{ textAlign: "center" }}>
              <Button type="primary" size="large">Đặt khám ngay</Button>
            </Col>
          </Row>
        </Card>

        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Card title="Giới thiệu" style={{ marginBottom: 16 }}>
              <Paragraph>
                Bác sĩ Lê Hoàng Thiên tốt nghiệp Thạc sĩ y khoa chuyên ngành nội khoa tại Đại học Y Dược TP.HCM...
              </Paragraph>
            </Card>
            <Card title="Quá trình đào tạo" style={{ marginBottom: 16 }}>
              <ul>
                <li>2013 – 2019: Sinh viên chuyên ngành Y Đa khoa</li>
                <li>2019 – 2022: Học nội soi siêu hóa bệnh viện</li>
              </ul>
            </Card>
            <Card title="Kinh nghiệm" style={{ marginBottom: 16 }}>
              <ul>
                <li>2023 – nay: Làm việc tại Bệnh viện An Bình</li>
              </ul>
            </Card>
            <Card title="Giải thưởng & Công trình nghiên cứu">
              <ul>
                <li>2022: Bằng khen Đại học Y Dược TP.HCM</li>
              </ul>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Bài viết liên quan">
              <List
                itemLayout="vertical"
                dataSource={[
                  { title: "Địa chỉ điều trị suy giãn tĩnh mạch...", date: "25/06/2025" },
                  { title: "Nâng mông ở đâu đẹp nhất TPHCM", date: "25/06/2025" },
                ]}
                renderItem={item => (
                  <List.Item>
                    <Text>{item.title}</Text><br />
                    <Text type="secondary" style={{ fontSize: 12 }}>{item.date}</Text>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* <Title level={4} style={{ margin: "32px 0 16px", textAlign: "center", color: "#00a3e0" }}>
          Bác sĩ cùng cơ sở y tế
        </Title>
        <Row gutter={[24, 24]} justify="center">
          {doctorsSameFacility.map((doc, idx) => (
            <Col xs={24} sm={12} md={8} key={idx}>
              <Card hoverable>
                <Row align="middle">
                  <Col span={8}>
                    <Avatar size={64} src={doc.photoUrl} icon={<UserOutlined />} />
                  </Col>
                  <Col span={16}>
                    <Text strong>{doc.name}</Text><br />
                    <Text type="secondary">{doc.specialty}</Text>
                    <Paragraph ellipsis={{ rows: 2 }}>{doc.description}</Paragraph>
                    <Button type="link" size="small">Xem chi tiết</Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row> */}
      </div>
    </div>
  );
}
