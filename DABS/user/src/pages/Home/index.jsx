
import { Button, Col, Flex, Row, Tooltip, Card, Carousel, Rate } from "antd";
import { Input, Space } from 'antd';
import { CheckCircleFilled, EnvironmentOutlined } from "@ant-design/icons";
import "./style.scss";
const { Search } = Input;

function Home() {


    const onSearch = (value, _e, info) =>
        console.log(info === null || info === void 0 ? void 0 : info.source, value);
    return <>
        <div className="background-img">

            <Row justify="center" style={{ marginBottom: 20, marginTop: 50 }}>
                <Col className="gutter-row" span={12} style={{ textAlign: 'center' }}>
                    <h1>Kết nối Người Dân với Cơ sở & Dịch vụ Y tế hàng đầu</h1>
                </Col>
            </Row>
            <Row justify="center">
                <Col className="gutter-row" span={12} style={{ textAlign: 'center' }}>

                    <Search
                        placeholder="Tìm kiếm bác sĩ, gói khám, cơ sở khám, ..."
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={onSearch}

                    />

                </Col>
            </Row>
            <Row justify="center" style={{ marginTop: 20 }}>
                <Col span={20}>
                    <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                        <Card className="facility-card" hoverable style={{ width: 300 }}>
                            yasuo
                        </Card>
                        <Card className="facility-card" hoverable style={{ width: 300 }}>
                            yasuo
                        </Card>
                        <Card className="facility-card" hoverable style={{ width: 300 }}>
                            yasuo
                        </Card>
                        <Card className="facility-card" hoverable style={{ width: 300 }}>
                            yasuo
                        </Card>

                    </Flex>
                </Col>
            </Row>
            <Row justify="center" style={{ marginBottom: 20, marginTop: 50 }}>
                <Col className="gutter-row" span={12} style={{ textAlign: 'center' }}>
                    <h1>Được Tin tưởng bởi ...</h1>
                </Col>
            </Row>
            <Row justify="center" style={{ marginTop: 20 }}>
                <Col span={20}>
                    <Carousel
                        autoplay
                        effect="fade"
                        dots={true}
                        dotPosition="bottom"
                        autoplaySpeed={4000}
                    >
                        <div>
                            <div style={{
                                height: '300px',
                                background: '#e6f7ff',
                                borderRadius: '8px',
                                textAlign: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src="https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2022/04/tuong-quoc-dan-yasuo-tiep-tuc-co-trang-phuc-moi-trong-ban-cap-nhat-12.8-7.jpg"
                                    alt="Banner 1"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    left: '50px',
                                    top: '50px',
                                    color: 'white',
                                    textAlign: 'left'
                                }}>
                                    <h2>Nhà thuốc An Khang</h2>
                                    <p>Đã có mặt trên DABS</p>
                                    <Button type="primary" size="large">MUA THUỐC NGAY</Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{
                                height: '300px',
                                background: '#e6f7ff',
                                borderRadius: '8px',
                                textAlign: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src="https://cdn.gametv.vn/news_media/image/ys_0x0_1704962406.png"
                                    alt="Banner 1"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    left: '50px',
                                    top: '50px',
                                    color: 'white',
                                    textAlign: 'left'
                                }}>
                                    <h2>Nhà thuốc An Khang</h2>
                                    <p>Đã có mặt trên DABS</p>
                                    <Button type="primary" size="large">MUA THUỐC NGAY</Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{
                                height: '300px',
                                background: '#e6f7ff',
                                borderRadius: '8px',
                                textAlign: 'center',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <img
                                    src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg"
                                    alt="Banner 1"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    left: '50px',
                                    top: '50px',
                                    color: 'white',
                                    textAlign: 'left'
                                }}>
                                    <h2>Nhà thuốc An Khang</h2>
                                    <p>Đã có mặt trên DABS</p>
                                    <Button type="primary" size="large">MUA THUỐC NGAY</Button>
                                </div>
                            </div>
                        </div>

                    </Carousel>



                </Col>
            </Row>
            <Row justify="center" style={{ marginBottom: 20, marginTop: 50 }}>
                <Col className="gutter-row" span={12} style={{ textAlign: 'center' }}>
                    <h1>Cơ sở y tế đặt khám được yêu thích</h1>
                </Col>
            </Row>
            <Row justify="center">
                <Col span={20}>
                    <div className="medical-facilities">
                        <Card className="facility-card" hoverable>
                            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                <img
                                    src="https://images2.thanhnien.vn/zoom/686_429/Uploaded/vietthong/2020_09_09/thumb_BDTP.jpg"
                                    alt="Doctor Check"
                                    style={{ width: 120, height: 120, objectFit: 'cover' }}
                                />
                            </div>
                            <div>
                                <h3>
                                    DABS1
                                    <CheckCircleFilled style={{ color: '#1890ff', marginLeft: 5 }} />
                                </h3>
                                <p>
                                    <EnvironmentOutlined /> FPTU
                                </p>
                                <div style={{ marginBottom: 10 }}>
                                    <span>(5) </span>
                                    <Rate defaultValue={5} disabled style={{ fontSize: 16 }} />
                                </div>
                                <Button type="primary" block>
                                    Đặt khám ngay
                                </Button>
                            </div>
                        </Card>

                        <Card className="facility-card" hoverable>
                            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                <img
                                    src="https://genk.mediacdn.vn/2018/6/22/photo-1-15296435656571415043313.jpg"
                                    alt="Bệnh viện Da Liễu"
                                    style={{ width: 120, height: 120, objectFit: 'contain' }}
                                />
                            </div>
                            <div>
                                <h3>
                                    DABS2
                                    <CheckCircleFilled style={{ color: '#1890ff', marginLeft: 5 }} />
                                </h3>
                                <p>
                                    <EnvironmentOutlined /> FPTU
                                </p>
                                <div style={{ marginBottom: 10 }}>
                                    <span>(4.5) </span>
                                    <Rate defaultValue={4.5} disabled style={{ fontSize: 16 }} allowHalf />
                                </div>
                                <Button type="primary" block>
                                    Đặt khám ngay
                                </Button>
                            </div>
                        </Card>

                        <Card className="facility-card" hoverable>
                            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                <img
                                    src="https://turbosmurfs.gg/storage/splash/Lucian_31.jpg"
                                    alt="Bệnh viện Đại học Y Dược"
                                    style={{ width: 120, height: 120, objectFit: 'cover' }}
                                />
                            </div>
                            <div>
                                <h3>
                                    DABS3
                                    <CheckCircleFilled style={{ color: '#1890ff', marginLeft: 5 }} />
                                </h3>
                                <p>
                                    <EnvironmentOutlined /> FPTU
                                </p>
                                <div style={{ marginBottom: 10 }}>
                                    <span>(4.7) </span>
                                    <Rate defaultValue={4.7} disabled style={{ fontSize: 16 }} allowHalf />
                                </div>
                                <Button type="primary" block>
                                    Đặt khám ngay
                                </Button>
                            </div>
                        </Card>

                        <Card className="facility-card" hoverable>
                            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                <img
                                    src="https://images.1v9.gg/Heartseeker%20Lucian-9ae8eff7fb08.webp"
                                    alt="Phòng khám Hàng Xanh"
                                    style={{ width: 120, height: 120, objectFit: 'cover' }}
                                />
                            </div>
                            <div>
                                <h3>
                                    DABS4
                                    <CheckCircleFilled style={{ color: '#1890ff', marginLeft: 5 }} />
                                </h3>
                                <p>
                                    <EnvironmentOutlined /> FPTU
                                </p>
                                <div style={{ marginBottom: 10 }}>
                                    <span>(4) </span>
                                    <Rate defaultValue={4} disabled style={{ fontSize: 16 }} />
                                </div>
                                <Button type="primary" block>
                                    Đặt khám ngay
                                </Button>
                            </div>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    </>
}
export default Home;