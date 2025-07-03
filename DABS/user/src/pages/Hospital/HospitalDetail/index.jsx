import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Steps, Table, Menu, List, Avatar, Button } from 'antd';
import imgErrorHospital from "../../../assets/images/errorImgHospital.jpg";
import { CheckCircleFilled } from "@ant-design/icons";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import { getDoctorByHospitalId } from '../../../services/doctorService';
function HospitalDetail() {
    const { Step } = Steps;
    const { hospitalId } = useParams();
    const [doctors, setDoctors] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const result = await getDoctorByHospitalId(hospitalId);
            setDoctors(result);
        }
        fetchApi();
    }, [hospitalId]);
    console.log("Doctors:", doctors);
    const priceData = [
        { key: 1, service: 'Khám tổng quát', price: '300,000 VNĐ' },
        { key: 2, service: 'Xét nghiệm máu', price: '150,000 VNĐ' },
        { key: 3, service: 'Khám tổng quát', price: '300,000 VNĐ' },
        { key: 4, service: 'Xét nghiệm máu', price: '150,000 VNĐ' },
        { key: 5, service: 'Khám tổng quát', price: '300,000 VNĐ' },
        { key: 6, service: 'Xét nghiệm máu', price: '150,000 VNĐ' },


    ];

    const columns = [
        { title: 'Dịch vụ', dataIndex: 'service', key: 'service' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
    ];
    const departments = [
        { key: '1', label: 'Nội soi' },
        { key: '2', label: 'Tiêu hóa' },
        { key: '3', label: 'Ung bướu' },
        { key: '4', label: 'Hô hấp' },
        { key: '5', label: 'Nhi khoa' },
        { key: '6', label: 'Tim mạch' },
        { key: '7', label: 'Thần kinh' },
    ];


    const sliderSettings = {
        dots: false,
        infinite: departments.length > 4,
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
    const steps = [
        { title: 'Chọn dịch vụ', description: 'Chọn loại dịch vụ cần khám.' },
        { title: 'Đặt lịch', description: 'Chọn ngày giờ và xác nhận.' },
        { title: 'Thanh toán', description: 'Thanh toán trực tuyến hoặc tại quầy.' },
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
            <Row gutter={32} align="top">
                <Col xs={24} md={16}>
                    <Card title="Thông tin cơ sở y tế" style={{ marginBottom: 24 }}>
                        <p>Địa chỉ: 123 Đường Lớn, Quận 1, TP.HCM</p>
                        <p>Điện thoại: 0909 123 456</p>
                    </Card>
                    <h2 style={{ margin: '15px 0 8px', fontSize: '16px' }}>Dịch vụ</h2>
                    <Slider {...sliderSettings}>
                        {departments.map((item) => (
                            <div key={item.key} style={{ padding: 8 }}>
                                <Card
                                    hoverable
                                    style={{
                                        borderRadius: 12,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                        textAlign: 'center',
                                        padding: 16,
                                        minHeight: 220,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
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
                                        {item.label}
                                        <CheckCircleFilled style={{ color: '#1890ff', marginLeft: 6, fontSize: 16 }} />
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </Slider>
                    <Card title="Quy trình đặt khám tổng quát" style={{ marginBottom: 24, marginTop: 20 }}>
                        <Steps direction="vertical" size="small" current={2}>
                            <Step title="Chọn dịch vụ" description="Chọn loại dịch vụ cần khám." />
                            <Step title="Đặt lịch" description="Chọn ngày giờ và xác nhận." />
                            <Step title="Thanh toán" description="Thanh toán trực tuyến hoặc tại quầy." />
                        </Steps>
                    </Card>
                    <Card title="Quy trình đặt khám" style={{ marginBottom: 24, marginTop: 20 }}>
                        <Steps direction="vertical" size="small" current={2}>
                            <Step title="Chọn dịch vụ" description="Chọn loại dịch vụ cần khám." />
                            <Step title="Chọn chuyên khoa (Dành cho dịch vụ khám chuyên gia)" description="Chọn bác sĩ phù hợp." />
                            <Step title="Chọn bác sĩ (Dành cho dịch vụ chọn bác sĩ và khám chuyên gia)" description="Chọn bác sĩ phù hợp." />
                            <Step title="Đặt lịch" description="Chọn ngày giờ và xác nhận." />
                            <Step title="Thanh toán" description="Thanh toán trực tuyến hoặc tại quầy." />
                        </Steps>
                    </Card>

                    <Card title="Bảng giá dịch vụ">

                        <Table
                            columns={columns}
                            dataSource={priceData}
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
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502519360122!2d106.70042431533454!3d10.77688989232259!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3c1f6a5b3b%3A0x7d6f4d7c9c9b0f2c!2zMTIzIMSQxrDhu51uZyBM4bujaSwgUGjGsOG7nW5nIDEsIFF14bqtbiAxLCBUaOG7pyBC4bqvYywgSOG7kyBDaMOidSwgVmlldG5hbQ!5e0!3m2!1svi!2s!4v1622471123456!5m2!1svi!2s"
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
