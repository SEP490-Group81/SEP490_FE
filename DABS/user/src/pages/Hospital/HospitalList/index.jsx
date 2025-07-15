import { Button, Card, Col, Empty, Input, Pagination, Rate, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled, EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getHospitalList } from "../../../services/hospitalService";
import imgErrorHospital from "../../../assets/images/errorImgHospital.jpg";

function HospitalList() {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState([]);
  const [originalHospitalList, setOriginalHospitalList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pagedData = hospital.slice(startIdx, endIdx);
  const [selectedHospital, setSelectedHospital] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getHospitalList();
      if (result) {
        setHospital(result);
        setOriginalHospitalList(result);
        setSelectedHospital(result[0] || null);
      } else {
        console.error("No hospital data found");
      }
    };
    fetchApi();
  }, []);

  const onChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setHospital(originalHospitalList);
      return;
    }
    const filtered = originalHospitalList.filter(hospital =>
      (hospital.name || "").toLowerCase().includes(value.toLowerCase())
    );
    setHospital(filtered);
    setCurrentPage(1);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ textAlign: 'center', padding: '40px 16px 24px' }}>
        <h1 style={{
          color: '#1677ff',
          fontSize: '36px',
          fontWeight: 700,
          fontFamily: 'Montserrat, sans-serif',
          marginBottom: 12
        }}>
          Danh sách cơ sở y tế
        </h1>
        <p style={{
          fontSize: 16,
          color: '#555',
          maxWidth: 600,
          margin: '0 auto 30px'
        }}>
          Lựa chọn bệnh viện hàng đầu để có trải nghiệm chăm sóc sức khỏe tốt nhất
        </p>
        <Input.Search
          placeholder="Tìm kiếm tên bệnh viện..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onChange={onChange}
          style={{
            width: '100%',
            maxWidth: 500,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />
      </div>

      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} md={14}>
          {pagedData.length > 0 ? (
            pagedData.map((item, idx) => (
              <Card
                key={idx}
                onClick={() => setSelectedHospital(item)}
                hoverable
                style={{
                  marginBottom: 24,
                  borderRadius: 12,
                  background: '#f0f8ff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  cursor: 'pointer'
                }}
              >
                <Row gutter={16}>
                  <Col><img
                    src={item.image || imgErrorHospital}
                    alt="Ảnh bệnh viện"
                    style={{
                      width: 90,
                      height: 90,
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '2px solid #e6f7ff'
                    }}
                  /></Col>
                  <Col flex="auto">
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>{item.name} <CheckCircleFilled style={{ color: '#52c41a', marginLeft: 8 }} /></h3>
                    <p style={{ color: '#666' }}><EnvironmentOutlined /> {item.address || 'Chưa cập nhật'}</p>
                    <Rate disabled defaultValue={5} style={{ fontSize: 14 }} />
                    <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
                      <Button type="primary" size="small" style={{ borderRadius: 6 }}>Đặt khám</Button>
                      <Button size="small" onClick={() => navigate(`/hospital-detail/${item.id}`)}>Xem chi tiết</Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            ))
          ) : (
            <Empty description="Không có dữ liệu bệnh viện" style={{ margin: '40px 0' }} />
          )}

          {pagedData.length > 0 && (
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={hospital.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              style={{ marginTop: 24, textAlign: 'center' }}
            />
          )}
        </Col>

        <Col xs={0} md={10}>
          {selectedHospital && (
            <Card
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                background: '#ffffff',
                padding: 24
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <img src={selectedHospital.image || imgErrorHospital} alt="Logo" style={{ height: 80 }} />
                <h2 style={{ color: '#1677ff', marginTop: 12 }}>{selectedHospital.name}</h2>
              </div>
              <p style={{ color: '#444', marginBottom: 16 }}>
                {selectedHospital.description || 'Chưa có mô tả chi tiết'}
              </p>
              <h3 style={{ fontWeight: 600, color: '#003553' }}>Bản đồ</h3>
              <iframe
                src={selectedHospital.googleMapUri}
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: 8 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ bệnh viện"
              ></iframe>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default HospitalList;
