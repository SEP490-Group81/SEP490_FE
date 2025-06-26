import { Button, Popconfirm } from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { deleteRoom } from "../../services/roomService";
function DeleteRoom(props) {
    const { record,onReload } = props;
    const handleDelete = async () => {
        console.log(record.id);
        const response = await deleteRoom(record.id);
        if(response) onReload();
    };
    return (
        <>
            <Popconfirm title="Bạn có chắc muốn xoá ?"
                onConfirm={handleDelete}>
                <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>

        </>
    )
}
export default DeleteRoom;