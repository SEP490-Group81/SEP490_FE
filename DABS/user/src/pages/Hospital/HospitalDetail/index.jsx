import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Steps, Table, Menu, List, Avatar, Button, Spin, Typography, Skeleton } from 'antd';
import imgErrorHospital from "../../../assets/images/errorImgHospital.jpg";
import { CheckCircleFilled } from "@ant-design/icons";
import Slider from "react-slick";
import { useNavigate, useParams } from "react-router-dom";
import { getDoctorByHospitalId } from '../../../services/doctorService';
import { getHospitalDetail } from '../../../services/hospitalService';
import Title from 'antd/es/skeleton/Title';
function HospitalDetail() {
    const { Step } = Steps;
    const { hospitalId } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [hospital, setHospital] = useState();
    const [loadingHospital, setLoadingHospital] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchApi = async () => {
            const result = await getDoctorByHospitalId(hospitalId);
            setDoctors(result);
        }
        fetchApi();
    }, [hospitalId]);
    console.log("Doctors:", doctors);


    useEffect(() => {
        const fetchApi = async () => {
            const result = await getHospitalDetail(hospitalId);
            setHospital(result);
            setLoadingHospital(false);
        };
        fetchApi();
    }, [hospitalId]);
    console.log("hospital:", hospital);

    const columns = [
        { title: 'Dịch vụ', dataIndex: 'name', key: 'name' },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => price?.toLocaleString('vi-VN') + ' VNĐ',
        },
    ];


    const sliderSettings = {
        dots: false,
        infinite: hospital?.services.length > 4,
        speed: 400,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 600, settings: { slidesToShow: 2 } },
            { breakpoint: 400, settings: { slidesToShow: 1 } }
        ]
    };


    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <Row gutter={32} align="top">
                <Col xs={24} md={16}>
                    <Spin spinning={loadingHospital}>
                        {hospital ? (
                            <Card
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                                        {hospital.image && (
                                            <img
                                                src={hospital.image}
                                                alt="Logo bệnh viện"
                                                style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        )}
                                        <Typography.Title level={4} style={{ margin: 0, color: "#00bfff", }}>
                                            {hospital?.name || "Chưa có thông tin"}
                                        </Typography.Title>
                                    </div>
                                }
                                style={{ borderRadius: 12, boxShadow: '0 2px 8px #e6f4ff' }}
                            >
                                <p><strong>Địa chỉ:</strong> {hospital?.address || "Chưa có thông tin"}</p>
                                <p><strong>Giờ mở cửa:</strong> {hospital?.openTime ? new Date(hospital.openTime).toLocaleTimeString() : "Chưa có"}</p>
                                <p><strong>Giờ đóng cửa:</strong> {hospital?.closeTime ? new Date(hospital.closeTime).toLocaleTimeString() : "Chưa có"}</p>
                                <p><strong>Email:</strong> {hospital?.email || "Chưa có thông tin"}</p>
                                <p><strong>Số điện thoại:</strong> {hospital?.phoneNumber || "Chưa có thông tin"}</p>

                                <div style={{ textAlign: 'center', marginTop: 16 }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        shape="round"
                                        style={{
                                            padding: '6px 24px',
                                            fontSize: 16,
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                                        }}
                                   

                                          onClick={() =>   navigate(`/appointment?hospitalId=${hospital.id}`)}
                                    >
                                        Đặt khám ngay
                                    </Button>
                                </div>
                            </Card>


                        ) : (
                            <Card title="Thông tin cơ sở y tế">
                                <Skeleton active paragraph={{ rows: 4 }} />
                            </Card>
                        )}
                    </Spin>
                    {/* <div style={{ marginBottom: 50 }}>
                        <h2 style={{ margin: '15px 0 20px', fontSize: '16px' }}>Dịch vụ</h2>
                        <Slider {...sliderSettings}>
                            {hospital?.services.map((item) => (
                                <div key={item.key} style={{ padding: 8 }}>
                                    <Card
                                        hoverable
                                        style={{
                                            borderRadius: 12,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                            textAlign: 'center',
                                            padding: 16,
                                            minHeight: 200,
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                    >
                                        <img
                                            src={item.image || imgErrorHospital}
                                            alt={item.label}
                                            style={{
                                                width: 80,
                                                height: 80,
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                                marginBottom: 12,
                                                background: '#f5f5f5'
                                            }}
                                        />
                                        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, whiteSpace: 'normal', wordBreak: 'break-word', color: '#222' }}>
                                            {item.name}
                                            <CheckCircleFilled style={{ color: '#1890ff', marginLeft: 6, fontSize: 16 }} />
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </Slider>
                    </div> */}


                    <Card title="Bảng giá dịch vụ" style={{marginTop: 50, marginBottom:40}}>
                        <Table
                            columns={columns}
                            dataSource={hospital?.services?.map((s) => ({ ...s, key: s.id })) || []}
                            pagination={false}
                            size="small"
                            scroll={{ y: 200 }}
                        />
                    </Card>

                </Col>

                <Col xs={24} md={8}>
                    <Card title="Bác sĩ" style={{ marginBottom: 24 }}>
                        <div style={{ maxHeight: 350, overflowY: 'auto', paddingRight: 8 }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={doctors}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.user.avatarUrl} />}
                                            title={item.user.fullname}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Card>
                    <div
                        style={{
                            position: 'sticky',
                            top: 90,
                            zIndex: 10,
                        }}
                    >
                        <Card title="Vị trí trên bản đồ">
                            <iframe
                                title="Google Map"
                                width="100%"
                                height="300"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={hospital?.googleMapUri || ""}
                                allowFullScreen=""
                                aria-hidden="false"
                                tabIndex="0"
                            />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default HospitalDetail;
