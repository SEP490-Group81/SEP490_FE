import { Button, Card, Col, Empty, Input, Pagination, Rate, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled, EnvironmentOutlined, HomeOutlined, SearchOutlined } from "@ant-design/icons";
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
    console.log("hospital is : " + hospital);
    useEffect(() => {
        const fetchApi = async () => {
            const result = await getHospitalList();
            if (result) {
                setHospital(result);
                setOriginalHospitalList(result);
                setSelectedHospital(result[1] || null);
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
    };

    return (
        <div>

            <div style={{ textAlign: 'center', marginTop: 20, marginBottom: 20 }}>
                <h1
                    style={{
                        color: '#00b5f1',
                        fontWeight: 700,
                        fontSize: '39px',
                        marginBottom: '8px',
                        lineHeight: '48px',
                        fontFamily: 'Montserrat, sans-serif',
                    }}
                >
                    Cơ sở y tế
                </h1>
                <div
                    style={{
                        fontSize: '16px',
                        fontWeight: 400,
                        lineHeight: '18.75px',
                        textAlign: 'center',
                        color: '#003553',
                    }}
                >
                    Với những cơ sở Y Tế hàng đầu sẽ giúp trải nghiệm khám, chữa bệnh của bạn tốt hơn
                </div>
                <Input.Search
                    placeholder="Tìm kiếm cơ sở y tế..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    style={{
                        width: '100%',
                        maxWidth: 600,
                        borderRadius: 24,

                        fontSize: 18,
                        padding: '8px 24px',
                        marginTop: 30
                    }}
                    onChange={onChange}
                />
            </div>
            <div style={{
                display: 'flex', justifyContent: 'center', background: '#E8F4FD', borderRadius: 12,
                boxShadow: '0 4px 16px 0 rgba(24, 144, 255, 0.12)',
                padding: 24,
                marginBottom: 20,
                marginTop: 0,
            }}>
                <Row gutter={24} align="top">
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                        {pagedData.length > 0 ? (
                            pagedData.map((item, idx) => (

                                <Card key={idx}
                                    onClick={() => setSelectedHospital(item)}
                                    hoverable
                                    style={{
                                        borderRadius: 16,
                                        boxShadow: '0 4px 16px 0 rgba(24, 144, 255, 0.08)',
                                        background: '#f5fbff',
                                        width: 500,
                                        margin: '0 auto',
                                        marginBottom: 32,
                                        cursor: 'pointer'
                                    }}
                                    className="hospital-card"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                            <img
                                                src={item.image || imgErrorHospital}
                                                alt="Hình bệnh viện"
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    border: '2px solid #e6f7ff'
                                                }}
                                            />
                                        </div>
                                        <div style={{
                                            marginLeft: 50
                                        }}>
                                            <h3 style={{
                                                fontWeight: 600,
                                                fontSize: 16,
                                                marginBottom: 8,
                                                whiteSpace: 'normal',
                                                wordBreak: 'break-word'
                                            }}>
                                                {item.name || "Cơ sở y tế"}

                                                <CheckCircleFilled style={{ color: '#1890ff', marginLeft: 6 }} />
                                            </h3>
                                            <p style={{
                                                color: '#666',
                                                marginBottom: 12,
                                                whiteSpace: 'normal',
                                                wordBreak: 'break-word'
                                            }}>
                                                <EnvironmentOutlined /> {item.address || "Địa chỉ không xác định"}
                                            </p>
                                            <div style={{ marginBottom: 12 }}>
                                                <span style={{ marginRight: 6, color: '#1890ff', fontWeight: 500 }}>
                                                    ({5})
                                                </span>
                                                <Rate defaultValue={5} disabled style={{ fontSize: 12 }} />
                                            </div>
                                        </div>

                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
                                        <Button type="primary" block style={{ borderRadius: 8 }} size="small">
                                            Đặt khám ngay
                                        </Button>
                                        <Button type="default" block style={{ borderRadius: 8 }} size="small"  onClick={() => navigate(`/hospital-detail/${item.id}`)}>
                                            Xem chi tiết
                                        </Button>
                                    </div>

                                </Card>

                            ))
                        ) : (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description="Không có dữ liệu"
                                style={{ margin: '40px 0' }}
                            />
                        )}
                        {pagedData.length > 0 ? (
                            <div style={{ textAlign: 'center', marginTop: 24 }}>
                                <Pagination
                                    style={{ display: 'flex', justifyContent: 'center' }}
                                    current={currentPage}
                                    pageSize={pageSize}
                                    total={hospital.length}
                                    onChange={page => setCurrentPage(page)}
                                    showSizeChanger={false}
                                />
                            </div>
                        ) : (
                           <></>
                        )}
                    </Col>
                    <Col xs={0} sm={0} md={0} lg={0} xl={10} xxl={10}>
                        {selectedHospital && (
                            <Card
                                style={{
                                    borderRadius: 16,
                                    boxShadow: '0 4px 16px 0 rgba(24, 144, 255, 0.08)',
                                    background: '#f5fbff',
                                    padding: 24,
                                    marginBottom: 32,
                                    width: 500,
                                }}
                            >
                                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                    <img src={selectedHospital.image || imgErrorHospital} alt="Logo" style={{ height: 80 }} />
                                    <h2 style={{ color: '#1890ff', marginTop: 8 }}>{selectedHospital.name || "Bệnh viện"}</h2>
                                </div>

                                <p style={{ color: '#333', marginBottom: 16 }}>{"Chưa có mô tả"}</p>

                                {/* Bản đồ nhúng */}
                                <div><h2 style={{
                                    fontWeight: 500,
                                    fontSize: 20,
                                    color: '#003553'
                                }}>Bản đồ</h2></div>
                                <div style={{ marginBottom: 16 }}>
                                    <iframe
                                        src={selectedHospital.googleMapUri}
                                        width="100%"
                                        height="250"
                                        style={{ border: 0, borderRadius: 12 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Bản đồ bệnh viện"
                                    ></iframe>
                                </div>

                            </Card>
                        )}
                    </Col>

                </Row>

            </div>



        </div >
    );
}

export default HospitalList;