import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Row, Col, Card, Avatar, Typography, List, Tag, Space, Divider
} from "antd";
import {
  UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined,
  ManOutlined, WomanOutlined
} from "@ant-design/icons";
import { getDoctorDetail } from "../../../services/doctorService";
import imgErrorDoctor from "../../../assets/images/errorImgHospital.jpg";

const { Title, Text, Paragraph } = Typography;

export default function DoctorDetailPage() {
  const { doctorId } = useParams();
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctorData() {
      try {
        const response = await getDoctorDetail(doctorId);
        if (response) setDoctorDetail(response);
      } catch (error) {
        console.error("Failed to fetch doctor detail:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctorData();
  }, [doctorId]);

  if (loading) return <div style={{ padding: 60, textAlign: "center" }}>Đang tải thông tin bác sĩ...</div>;
  if (!doctorDetail) return <div style={{ padding: 60, textAlign: "center", color: "red" }}>Không tìm thấy thông tin bác sĩ.</div>;

  const {
    user,
    description,
    practicingFrom,
    specializations,
    qualification,
    hospitalAffiliations,
  } = doctorDetail;

  const genderIcon = user.gender ? <ManOutlined /> : <WomanOutlined />;
  const dobFormatted = user.dob ? new Date(user.dob).toLocaleDateString("vi-VN") : "Chưa cập nhật";

  return (
    <div style={{ background: "#f0f2f5", padding: "48px 16px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header Info */}
        <Card style={{ borderRadius: 16, padding: 24, marginBottom: 32 }}>
          <Row gutter={24} align="middle">
            <Col xs={24} md={8} style={{ textAlign: "center" }}>
              <Avatar
                size={120}
                src={user.avatarUrl || imgErrorDoctor}
                icon={!user.avatarUrl && <UserOutlined />}
                style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)", marginBottom: 12 }}
              />
              <Tag
                icon={genderIcon}
                color={user.gender ? "#40a9ff" : "#f759ab"}
                style={{ fontSize: 16, marginTop: 8 }}
              >
                {user.gender ? "Nam" : "Nữ"}
              </Tag>
            </Col>

            <Col xs={24} md={16}>
              <Title level={3}>{user.fullname}</Title>
              <Space direction="vertical" size="small" style={{ fontSize: 16 }}>
                <Text><MailOutlined /> {user.email || "Chưa cập nhật"}</Text>
                <Text><PhoneOutlined /> {user.phoneNumber || "Chưa cập nhật"}</Text>
                <Text><HomeOutlined /> {`${user.streetAddress || ""}, ${user.ward || ""}, ${user.province || ""}`}</Text>
                <Text>Ngày sinh: <Text strong>{dobFormatted}</Text></Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Section: Giới thiệu */}
        <Card title="Giới thiệu" style={{ borderRadius: 16, marginBottom: 28 }}>
          <Paragraph style={{ fontSize: 16 }}>
            {description || "Chưa có thông tin giới thiệu."}
          </Paragraph>
          <Text type="secondary">Hành nghề từ: {practicingFrom ? new Date(practicingFrom).getFullYear() : "Chưa cập nhật"}</Text>
        </Card>

        {/* Section: Chuyên khoa */}
        <Card title="Chuyên khoa" style={{ borderRadius: 16, marginBottom: 28 }}>
          {specializations.length > 0 ? (
            <Row gutter={[16, 16]}>
              {specializations.map(spec => (
                <Col xs={12} sm={8} md={6} key={spec.id}>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center"
                  }}>
                    <div style={{
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      background: "#fff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      marginBottom: 10
                    }}>
                      <img
                        src={spec.image}
                        alt={spec.name}
                        style={{ maxWidth: "90%", maxHeight: "90%" }}
                      />
                    </div>
                    <Text strong>{spec.name}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          ) : <Text>Chưa cập nhật chuyên khoa</Text>}
        </Card>

        {/* Section: Quá trình đào tạo */}
        <Card title="Quá trình đào tạo" style={{ borderRadius: 16, marginBottom: 28 }}>
          {qualification.length > 0 ? (
            <List
              dataSource={qualification}
              renderItem={item => (
                <List.Item>
                  <Text>{item.qualificationName} - {item.instituteName} ({item.procurementYear})</Text>
                </List.Item>
              )}
            />
          ) : <Text>Chưa cập nhật bằng cấp</Text>}
        </Card>

        {/* Section: Cơ sở công tác */}
        <Card title="Công tác tại cơ sở y tế" style={{ borderRadius: 16 }}>
          {hospitalAffiliations.length > 0 ? hospitalAffiliations.map(affil => (
            <Card
              key={affil.id}
              type="inner"
              style={{
                marginBottom: 20,
                borderRadius: 12,
                backgroundColor: "#fafcff",
                border: "1px solid #e6f7ff"
              }}
            >
              <Title level={5} style={{ color: "#1890ff" }}>{affil.hospital.name}</Title>
              <Paragraph>{affil.hospital.address}</Paragraph>
              <Text><b>Phòng ban:</b> {affil.departmentName || "Chưa có thông tin"}</Text><br />
              <Text><b>Vị trí:</b> {affil.position || "Chưa có thông tin"}</Text><br />
              <Text><b>Hợp đồng:</b> {new Date(affil.contractStart).toLocaleDateString()} - {new Date(affil.contractEnd).toLocaleDateString()}</Text>
            </Card>
          )) : <Text>Chưa có thông tin về cơ sở y tế công tác</Text>}
        </Card>
      </div>
    </div>
  );
}
