
import { Button, Col, Flex, Row, Tooltip } from "antd";
import { Input, Space } from 'antd';
import "./style.scss";

const { Search } = Input;

function Home() {
    const onSearch = (value, _e, info) =>
        console.log(info === null || info === void 0 ? void 0 : info.source, value);
    return <>
        <Row justify="center" style={{ marginBottom: 20 , marginTop : 50}}>
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
    </>
}
export default Home;