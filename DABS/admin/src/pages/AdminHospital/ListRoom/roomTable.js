import { Badge, Table, Tag, Tooltip } from "antd";
import DeleteRoom from "./DeleteRoom";
import EditRoom from "./EditRoom";

function RoomTable(props) {
    const { rooms, onReload } = props;
    const columns = [
        {
            title: 'Tên Phòng',
            dataIndex: 'nameroom',
            key: 'nameroom',
            width: 150,
        },
        {
            title: 'Số Giường',
            dataIndex: 'quantityBed',
            key: 'quantityBed',
            width: 150,
        },
        {
            title: 'Số Người',
            dataIndex: 'quantityPeople',
            key: 'quantityPeople',
        },
        {
            title: 'Tình Trạng Phòng',
            key: ' status',
            render: (__, record) => {
                return <>
                    {record.status ? (
                        <>
                            <Tooltip title="Phòng chuẩn 5 sao">
                                <Tag color="magenta">Special</Tag>
                            </Tooltip>

                            <Badge color="purple" text="Còn Phòng"></Badge>
                        </>
                    ) :
                        (
                            <>
                                <Badge color="gray" text="Hết Phòng"></Badge>
                            </>
                        )
                    }
                </>
            }
        },
        {
            title: 'Hành Động',
            key: ' actions',
            render: (__, record) => {
                return <>
                    <DeleteRoom record={record} onReload={onReload} />
                    <EditRoom record={record} onReload={onReload} />
                </>
            }
        }
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={rooms}
                rowKey="id"
            />
        </>
    )
}

export default RoomTable;