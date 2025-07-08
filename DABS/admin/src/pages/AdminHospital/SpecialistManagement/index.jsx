import React, { useEffect, useState } from "react";
import {
    Table, Button, Modal, Form, Input, Select, Space, message,
    Row, Col, ConfigProvider, Card, Switch
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
    AppstoreOutlined,
    UploadOutlined
} from "@ant-design/icons";
import * as XLSX from 'xlsx';
import viVN from "antd/es/locale/vi_VN";
import { useRef } from "react";
import { getSpecializationList, updateSpecialization } from "../../../services/specializationService";

const { Option } = Select;

const ManageSpecialist = () => {

    const [specialists, setSpecialists] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const result = await getSpecializationList();
            if (result) {
                setSpecialists(result);
            } else {
                console.error("No hospital data found");
            }
        };
        fetchApi();
    }, []);
    const [searchText, setSearchText] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState(null);
    const [form] = Form.useForm();

    const showAddModal = () => {
        setEditing(null);
        form.resetFields();
        setModalVisible(true);
    };

    const showEditModal = (record) => {
        setEditing(record);
        form.setFieldsValue({
            id: record.id,
            name: record.name,
            description: record.description,
            status: record.status,
            image: record.image
        });
        setModalVisible(true);
    };

    const showDeleteModal = (record) => {
        setDeletingRecord(record);
        setDeleteModalVisible(true);
    };

    const handleDelete = () => {
        setSpecialists(prev => prev.filter(s => s.id !== deletingRecord.id));
        message.success(`Đã xóa chuyên khoa "${deletingRecord.name}"`);
        setDeleteModalVisible(false);
        setDeletingRecord(null);
    };


    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const { id, name,description, status, image } = values;
            console.log("Updating attribute specialist:", id, name,description, status, image);
            if (id) {
                // Update case
                const updated = { id, name,description, image };
                console.log("Updating specialist:", updated);
                 await updateSpecialization(updated);

                setSpecialists(prev =>
                    prev.map(s => s.id === id ? { ...s, ...updated } : s)
                );
                message.success("Cập nhật thành công");
            } else {
                const newSpecialist = {
                    id: Date.now(), // temporary local ID
                    name,
                    description,
                    status,
                    image
                };
                setSpecialists(prev => [...prev, newSpecialist]);
                message.success("Thêm mới thành công");
            }

            setModalVisible(false);
        } catch (error) {
            message.error("Lỗi xử lý thông tin chuyên khoa");
            console.error(error);
        }
    };
    const fileInputRef = useRef();
    const handleToggleStatus = (checked, record) => {
        Modal.confirm({
            title: `Xác nhận ${checked ? "kích hoạt" : "ngưng"} chuyên khoa?`,
            content: `Bạn có chắc muốn thay đổi trạng thái "${record.name}"?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: () => {
                setSpecialists(prev =>
                    prev.map(s =>
                        s.id === record.id
                            ? { ...s, status: checked ? "active" : "inactive" }
                            : s
                    )
                );
                message.success("Cập nhật trạng thái thành công");
            }
        });
    };



    const handleExcelUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);

            const newItems = json.map((row, index) => ({
                id: Date.now() + index,
                name: row.name || '',
                status: row.status === 'inactive' ? 'inactive' : 'active',
                img: row.img || ''
            }));

            const validItems = newItems.filter(i => i.name);
            setSpecialists(prev => [...prev, ...validItems]);
            message.success(`Đã nhập ${validItems.length} dòng từ Excel`);
        };
        reader.readAsArrayBuffer(file);
    };

    const filteredData = specialists.filter((s) => {
        const keyword = searchText.toLowerCase();
        return (
            s.name.toLowerCase().includes(keyword) &&
            (statusFilter === "" || s.status === statusFilter)
        );
    });
    const columns = [
        {
            title: "#",
            dataIndex: "id",
            key: "id",
            width: 80,
            render: (id) =>
                id ? <span style={{ color: "gray" }}>{id}</span> : <span style={{ color: "gray" }}>Không có ID</span>
        },
        {
            title: (
                <div>
                    Tên chuyên khoa
                    <Input.Search
                        placeholder="Tìm kiếm..."
                        enterButton={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ marginTop: 8 }}
                        allowClear
                    />
                </div>
            ),
            width: 380,
            dataIndex: "name",
            key: "name"
        },
{
            title: "Mô tả",
            width: 300,
            dataIndex: "description",
            key: "description"
        },
        {
            title: "Ảnh",
            dataIndex: "image",
            key: "img",
            render: (image) =>
                image ? <img src={image} alt="Ảnh" width={60} height={60} style={{ objectFit: "cover", borderRadius: 6 }} />
                    : <span style={{ color: "gray" }}>Không có ảnh</span>
        },
        {
            title: (
                <div>
                    Trạng thái
                    <Select
                        style={{ width: "100%", marginTop: 8 }}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        allowClear
                        placeholder="Lọc theo trạng thái"
                    >
                        <Option value="">Tất cả</Option>
                        <Option value="active">Đang hoạt động</Option>
                        <Option value="inactive">Ngưng hoạt động</Option>
                    </Select>
                </div>
            ),
            key: "status",
            render: (_, record) => (
                <Switch
                    checked={record.status === "active"}
                    checkedChildren="Đang hoạt động"
                    unCheckedChildren="Ngưng hoạt động"
                    onChange={(checked) => handleToggleStatus(checked, record)}
                />
            )
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showEditModal(record)}>
                        Sửa
                    </Button>
                    <Button icon={<DeleteOutlined />} danger onClick={() => showDeleteModal(record)}>
                        Xóa
                    </Button>
                </Space>
            )
        }
    ];
    return (
        <ConfigProvider locale={viVN}>
            <div style={{ padding: 20, background: '#fff' }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
                    <Col>
                        <h2><AppstoreOutlined style={{ marginRight: 8 }} />Quản lý chuyên khoa</h2>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} style={{ marginRight: 8 }}>
                            Thêm chuyên khoa
                        </Button>
                        <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>
                            Nhập từ Excel
                        </Button>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            ref={fileInputRef}
                            onChange={handleExcelUpload}
                            style={{ display: "none" }}
                        />
                    </Col>
                </Row>

                <Card>
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                    />
                </Card>

                <Modal
                    title="Xác nhận xóa chuyên khoa"
                    open={deleteModalVisible}
                    onCancel={() => setDeleteModalVisible(false)}
                    onOk={handleDelete}
                    okText="Xóa"
                    cancelText="Hủy"
                    okType="danger"
                >
                    {deletingRecord && (
                        <div>
                            <p>Bạn có chắc chắn muốn xóa chuyên khoa sau?</p>
                            <p><strong>Tên chuyên khoa:</strong> {deletingRecord.name}</p>
                        </div>
                    )}
                </Modal>

                <Modal
                    title={editing ? "Chỉnh sửa chuyên khoa" : "Thêm chuyên khoa mới"}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onOk={handleSubmit}
                    okText="Lưu"
                    cancelText="Hủy"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="id" hidden>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Tên chuyên khoa"
                            rules={[{ required: true, message: "Vui lòng nhập tên chuyên khoa" }]}
                        >
                            <Input />
                        </Form.Item>
                         <Form.Item
                            name="description"
                            label="Mô tả"
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="Link ảnh chuyên khoa"
                        >
                            <Input placeholder="https://example.com/image.png" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[{ required: true, message: "Chọn trạng thái" }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="active">Đang hoạt động</Option>
                                <Option value="inactive">Ngưng hoạt động</Option>
                            </Select>
                        </Form.Item>
                    </Form>

                </Modal>
            </div>
        </ConfigProvider>
    );
};


export default ManageSpecialist;
