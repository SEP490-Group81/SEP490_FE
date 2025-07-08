import React, { useState } from "react";
import {
  Table, Button, Modal, Form, Input, Select,
  Space, message, ConfigProvider, Row, Col, Card
} from "antd";
import {
  PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, MedicineBoxOutlined
} from "@ant-design/icons";
import viVN from "antd/es/locale/vi_VN";

const { Option } = Select;

const MedicalServiceManagement = () => {
  const [services, setServices] = useState([
    { id: 1, name: "Khám tổng quát", price: 300000, status: "active" },
    { id: 2, name: "Xét nghiệm máu", price: 150000, status: "inactive" },
    { id: 3, name: "Siêu âm bụng", price: 250000, status: "active" }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const showAddModal = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      status: record.status
    });
    setModalVisible(true);
  };

  const showDeleteModal = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa dịch vụ?",
      content: `Bạn có chắc muốn xóa "${record.name}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        setServices(prev => prev.filter(s => s.id !== record.id));
        message.success("Đã xóa thành công");
      }
    });
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const { name, price, status } = values;
      if (editing) {
        setServices(prev =>
          prev.map(s =>
            s.id === editing.id ? { ...s, name, price, status } : s
          )
        );
        message.success("Cập nhật dịch vụ thành công");
      } else {
        const newService = {
          id: Date.now(),
          name,
          price: parseInt(price, 10),
          status
        };
        setServices(prev => [...prev, newService]);
        message.success("Thêm dịch vụ thành công");
      }
      setModalVisible(false);
    });
  };

  const filteredData = services.filter(s =>
    s.name.toLowerCase().includes(searchText.toLowerCase()) &&
    (statusFilter === "" || s.status === statusFilter)
  );

  const columns = [
    {
      title: (
        <div>
          Tên dịch vụ
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
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} đ`
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
        <span style={{ color: record.status === "active" ? "green" : "red" }}>
          {record.status === "active" ? "Đang hoạt động" : "Ngưng hoạt động"}
        </span>
      )
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
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
      <div className="medical-service-container">
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Row justify="space-between" align="middle">
              <Col>
                <h2><MedicineBoxOutlined style={{ marginRight: 8 }} />Danh sách dịch vụ y tế</h2>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showAddModal}
                  size="large"
                >
                  Thêm dịch vụ
                </Button>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Card>
              <Table
                dataSource={filteredData}
                rowKey="id"
                columns={columns}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>

        <Modal
          title={editing ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSubmit}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên dịch vụ"
              rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá tiền (VND)"
              rules={[
                { required: true, message: "Vui lòng nhập giá tiền" },
                { pattern: /^[0-9]+$/, message: "Giá tiền phải là số" }
              ]}
            >
              <Input />
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

export default MedicalServiceManagement;
