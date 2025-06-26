import { Badge, Card, Col, Rate, Row } from "antd";

function RoomGrid(props) {
    const { rooms } = props;
    return (
        <>
            <Row gutter={[20, 20]}>

                {rooms.map(item => (
                    <Col span={12} key={item.id}>
                        <Badge.Ribbon text={item.status ? "VIP" : "Thường"} color={item.status ? "volcano" : ""} >
                            <Card title={item.nameroom}>
                                <p>Số giường <strong>{item.quantityBed}</strong></p>
                                <p>Số người <strong>{item.quantityPeople}</strong></p>
                                <p>description <strong>{item.description}</strong></p>
                                {item.status ? (<Badge status="success" text="Còn phòng"></Badge>) :
                                    (<Badge status="error" text="Hết phòng"></Badge>)
                                }
                                <p><Rate allowHalf defaultValue={3.5} onChange={(e)=> console.log(e)}/></p>   
                            </Card>
                        </Badge.Ribbon>
                    </Col>
                ))}


            </Row></>
    )
}

export default RoomGrid;