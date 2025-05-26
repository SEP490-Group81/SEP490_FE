import { Col, Collapse, Row } from 'antd';
import CardItem from "./CardItem";
import Panel from 'antd/es/splitter/Panel';
function Admin() {
    return (
        <>
        
     
            <Row gutter={[16, 16]}>
                <Col xl={6} lg={12} md={24} xs={24}>
                    <CardItem title="Box-1" />
                </Col>
                <Col xl={6} lg={12} md={24} xs={24}>
                    <CardItem title="Box-2" />
                </Col >
                <Col xl={6} lg={12} md={24} xs={24}>
                    <CardItem title="Box-3" />
                </Col>
                <Col xl={6} lg={12} md={24} xs={24}>
                    <CardItem title="Box-4" />
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-20">
                <Col xl={17} lg={24} md={24} xs={24}>
                    <CardItem title="Box-1" />
                </Col>
                <Col xl={7} lg={24} md={24} xs={24}>
                    <CardItem title="Box-2" />
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-20">

                <Col xl={7} lg={24} md={24} xs={24}>
                    <CardItem title="Box-1" />
                </Col>
                <Col xl={17} lg={24} md={24} xs={24}>
                    <CardItem title="Box-2" />
                </Col>
            </Row>

            <Row gutter={[16, 16]} className="mt-20">
                <Col xl={8} lg={24} md={24} xs={24}>
                    <CardItem title="Box-1" />
                </Col>
                <Col xl={8} lg={24} md={24} xs={24}>
                    <CardItem title="Box-2" />
                </Col>
                <Col xl={8} lg={24} md={24} xs={24}>
                    <CardItem title="Box-3" />
                </Col>
            </Row>

        </>
    )
}

export default Admin;