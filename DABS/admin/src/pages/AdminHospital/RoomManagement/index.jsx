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

const ManageRoom = () => {
  const [specialties] = useState([
    "Nội tổng quát",
    "Ngoại tổng quát",
    "Nhi khoa",
    "Da liễu",
    "Tai Mũi Họng",
    "Tim mạch"
  ]);

  const [departments, setDepartments] = useState([
    { id: 1, name: "Phòng Nội 1", specialty: "Nội tổng quát" },
    { id: 2, name: "Phòng Ngoại A", specialty: "Ngoại tổng quát" },
    { id: 3, name: "Phòng Nhi 2", specialty: "Nhi khoa" }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const showAddModal = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      specialty: record.specialty,
    });
    setModalVisible(true);
  };

  const showDeleteModal = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa phòng?",
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
      const { name, specialty } = values;
      if (editing) {
        setDepartments(prev =>
          prev.map(dep =>
            dep.id === editing.id ? { ...dep, name, specialty } : dep
          )
        );
        message.success("Cập nhật thành công");
      } else {
        const newDepartment = {
          id: Date.now(),
          name,
          specialty,
        };
        setDepartments(prev => [...prev, newDepartment]);
        message.success("Thêm mới thành công");
      }
      setModalVisible(false);
    });
  };


  const filteredData = departments.filter(dep =>
    dep.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) =>
        id ? <span style={{ color: "gray" }}>{id}</span> : <span style={{ color: "gray" }}>Không có ID</span>,
      sorter: (a, b) => a.id - b.id
    },
    {
      title: (
        <div>
          Tên phòng khám
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
      width: 450,
      key: "name"
    },
    {
      title: "Mô tả",
      width: 300,
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Chuyên khoa",
      dataIndex: "specialty",
      key: "specialty"
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
                <h2><ApartmentOutlined style={{ marginRight: 8 }} />Quản lý phòng khám</h2>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showAddModal}
                  size="large"
                >
                  Thêm phòng khám
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
          title={editing ? "Chỉnh sửa phòng khám" : "Thêm phòng khám mới"}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSubmit}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Tên phòng khám"
              rules={[{ required: true, message: "Vui lòng nhập tên phòng khám" }]}
            >
              <Input placeholder="Tên phòng khám" />
            </Form.Item>

            <Form.Item 
              name="specialty"
              label="Chuyên khoa"
              rules={[{ required: true, message: "Vui lòng chọn chuyên khoa" }]}
            >
              <Select placeholder="Chọn chuyên khoa">
                {specialties.map(spe => (
                  <Option key={spe} value={spe}>{spe}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
            >
              <Input  placeholder="Mô tả"/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ManageRoom;
