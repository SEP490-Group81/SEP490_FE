import { Button, Form, Input, InputNumber, message, Modal, notification, Select, Spin, Switch } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { updateRoom } from "../../services/roomService";
function EditRoom(props) {
    const { record,onReload } = props;
    const { Option } = Select;
    const [form] = Form.useForm();
    const [notiApi, contextHolder] = notification.useNotification();
    // const [messageApi, contextHolder] = message.useMessage();
    const[spinning, setSpinning] = useState(false);
    const handleSubmit = async (e) => {
        setSpinning(true);
        setTimeout(()=>{
            if (response) {
                setSpinning(false);
                form.resetFields();
                success();
                setShowModal(false);
                onReload();
            } else error();
    
        },3000)
        const response = await updateRoom(record.id, e);
      

        console.log(response);
    }

    const success = () => {
        notiApi.open({
            message: 'Cập nhập thành công!',
            description: `Bạn đã cập nhập thành công ${record.nameroom}.`
        });
    };

    const error = () => {
        notiApi.error({
            message: 'Cập nhập thất bại!',
            description: `Bạn đã cập nhập thất bại ${record.nameroom}.`
        });
    };

    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCancel = () => {
        setShowModal(false);
        form.resetFields();
    }



    const options = [
        {
            value: 'zhejiang',
            label: 'Zhejiang',
        },
        {
            value: 'jiangsu',
            label: 'Jiangsu',
        },
    ];
    return (
        <>
        {contextHolder}
            <Button onClick={handleShowModal} type="primary" icon={<EditOutlined />}></Button>
            <Modal footer={null} title="Chỉnh sửa phòng" open={showModal} onCancel={handleCancel} >
                <Spin spinning={spinning} tip="Đang cập nhập ...">
                <Form form={form} name="create-room" onFinish={handleSubmit} initialValues={record}>
                    <Form.Item
                        label="Tên phòng"
                        name="nameroom"
                        rules={[{ required: true, message: 'Please input your username!' }]}

                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng giường"
                        name="quantityBed"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <InputNumber min={1} max={10} />
                    </Form.Item>

                    <Form.Item
                        label="Số người tối đa"
                        name="quantityPeople"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <InputNumber min={1} max={10} />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="Address" name="address">

                        <Select defaultValue="Zhejiang" options={options} />

                    </Form.Item>
                    <Form.Item name="utils" label="Tiện ích">
                        <Select style={
                            {
                                width: "100%"
                            }
                        }
                            mode="multiple"
                            allowClear
                        >
                            <Option value="wifi">Wifi</Option>
                            <Option value="dh">Điều hoà</Option>
                            <Option value="TV">TV</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="status" valuePropName="checked" label="Trạng thái">
                        <Switch checkedChildren="Còn phòng" unCheckedChildren="Hết phòng" defaultChecked />
                    </Form.Item>


                    <Form.Item name="submit">
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                </Spin>
            </Modal>


        </>
    )
}

export default EditRoom;