import React, { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Input, Select,
  Space, message, ConfigProvider, Row, Col, Card
} from "antd";
import {
  PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, MedicineBoxOutlined
} from "@ant-design/icons";
import viVN from "antd/es/locale/vi_VN";
import ServiceFlowModal from "./ServiceFlowModal";
import { createService, getServices, getSteps } from "../../../services/medicalServiceService";

const { Option } = Select;

const MedicalServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [flowModalVisible, setFlowModalVisible] = useState(false);
  const [editingFlow, setEditingFlow] = useState(null);
  const [steps, setSteps] = useState([]);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const fetchApi = async () => {
      const result = await getServices();
      console.log("result in medical service : " + result);
      if (result) {
        setServices(result);
      } else {
        console.error("No step data found");
      }
    };
    fetchApi();
  }, [flag]);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await getSteps();
      if (result) {
        setSteps(result);
      } else {
        console.error("No step data found");
      }
    };
    fetchApi();
  }, []);
  const showAddModal = () => {
    setEditing(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      price: record.price
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
    form.validateFields().then(async (values) => {
      const { name, price, description } = values;

      if (editing) {
        setServices(prev =>
          prev.map(s =>
            s.id === editing.id ? { ...s, name, price } : s
          )
        );
        message.success("Cập nhật dịch vụ thành công");
      } else {
        const newService = {
          name,
          description,
          price: parseInt(price, 10),
        };
        try {
          await createService(newService);
          setFlag(prev => !prev);
          message.success("Thêm dịch vụ thành công");
        } catch (error) {
          setModalVisible(false);
        }
      }
    });
  };

  const filteredData = services.filter(s =>
    s.name.toLowerCase().includes(searchText.toLowerCase())
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
      title: "Mô tả",
      width: 300,
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} đ`
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
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingFlow({
              id: record.id,
              name: record.name,
              flow: steps,
            });
            setFlowModalVisible(true);
          }}>
            Luồng
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
              name="description"
              label="Mô tả"
            >
              <Input placeholder="Mô tả" />
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

          </Form>
        </Modal>

        <ServiceFlowModal
          open={flowModalVisible}
          onCancel={() => setFlowModalVisible(false)}
          flowData={editingFlow}
          onSave={(updatedFlow) => {
            setServices(prev =>
              prev.map(s =>
                s.id === updatedFlow.id ? { ...s, ...updatedFlow } : s
              )
            );
            setFlowModalVisible(false);
            message.success("Cập nhật luồng thành công");
          }}
        />

      </div>
    </ConfigProvider>
  );
};

export default MedicalServiceManagement;
