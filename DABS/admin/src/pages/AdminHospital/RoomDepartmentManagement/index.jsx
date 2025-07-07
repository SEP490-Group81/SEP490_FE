import React, { useState } from "react";
import {
  Table, Button, Modal, Form, Input, Select,
  Space, message, ConfigProvider, Switch, Row, Col, Card
} from "antd";
import {
  PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, ApartmentOutlined
} from "@ant-design/icons";
import viVN from "antd/es/locale/vi_VN";

const { Option } = Select;

const ManageRoomDepartment = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Khoa Nội", status: "active" },
    { id: 2, name: "Khoa Ngoại", status: "inactive" },
    { id: 3, name: "Khoa Nhi", status: "active" },
    { id: 4, name: "Phòng Cấp cứu", status: "active" }
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
    form.setFieldsValue({ name: record.name, status: record.status });
    setModalVisible(true);
  };

  const showDeleteModal = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa khoa/phòng?",
      content: `Bạn có chắc muốn xóa "${record.name}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        setDepartments(prev => prev.filter(dep => dep.id !== record.id));
        message.success("Đã xóa thành công");
      }
    });
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const { name, status } = values;
      if (editing) {
        setDepartments(prev =>
          prev.map(dep =>
            dep.id === editing.id ? { ...dep, name, status } : dep
          )
        );
        message.success("Cập nhật thành công");
      } else {
        const newDepartment = {
          id: Date.now(),
          name,
          status
        };
        setDepartments(prev => [...prev, newDepartment]);
        message.success("Thêm mới thành công");
      }
      setModalVisible(false);
    });
  };

  const handleToggleStatus = (checked, record) => {
    Modal.confirm({
      title: `Xác nhận ${checked ? "kích hoạt" : "ngưng hoạt động"}?`,
      content: `Bạn có chắc muốn chuyển trạng thái của "${record.name}"?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        setDepartments(prev =>
          prev.map(dep =>
            dep.id === record.id
              ? { ...dep, status: checked ? "active" : "inactive" }
              : dep
          )
        );
        message.success("Cập nhật trạng thái thành công");
      }
    });
  };

  const filteredData = departments.filter(dep =>
    dep.name.toLowerCase().includes(searchText.toLowerCase()) &&
    (statusFilter === "" || dep.status === statusFilter)
  );

  const columns = [
    {
      title: (
        <div>
          Tên khoa/phòng
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
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
          checkedChildren="Hoạt động"
          unCheckedChildren="Ngưng"
          onChange={(checked) => handleToggleStatus(checked, record)}
        />
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
      <div className="room-department-container">
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Row justify="space-between" align="middle">
              <Col>
                <h2><ApartmentOutlined style={{ marginRight: 8 }} />Quản lý khoa/phòng</h2>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showAddModal}
                  size="large"
                >
                  Thêm khoa/phòng
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
          title={editing ? "Chỉnh sửa khoa/phòng" : "Thêm khoa/phòng mới"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSubmit}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên khoa/phòng"
              rules={[{ required: true, message: "Vui lòng nhập tên khoa/phòng" }]}
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

export default ManageRoomDepartment;
