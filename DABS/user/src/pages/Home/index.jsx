
import { Button, Col, Flex, Row, Tooltip } from "antd";
import { Input, Space } from 'antd';
import "./style.scss";
import { message } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { clearMessage } from "../../redux/slices/messageSlice";
const { Search } = Input;

function Home() {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const messageState = useSelector((state) => state.message)
    useEffect(() => {
        if (messageState) {
            messageApi.open({
                type: messageState.type,
                content: messageState.content,
                
            });
            dispatch(clearMessage());
        }
    }, [messageState, dispatch]);
    const onSearch = (value, _e, info) =>
        console.log(info === null || info === void 0 ? void 0 : info.source, value);
    return <>
        {contextHolder}
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
    </>
}
export default Home;