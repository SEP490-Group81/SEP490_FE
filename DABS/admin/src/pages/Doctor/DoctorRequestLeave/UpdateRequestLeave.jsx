import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Spin, notification, Row, Col } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const UpdateRequestLeave = ({ visible, onCancel, onSuccess, initialValues }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        startDate: initialValues.startDate ? moment(initialValues.startDate) : null,
        endDate: initialValues.endDate ? moment(initialValues.endDate) : null,
      });
    }
  }, [initialValues, form]);

  const success = () => {
    notification.success({
      message: 'Thành công',
      description: 'Cập nhật đơn xin nghỉ phép thành công!',
      placement: 'topRight',
    });
  };

  const error = () => {
    notification.error({
      message: 'Lỗi',
      description: 'Cập nhật đơn thất bại. Vui lòng thử lại.',
      placement: 'topRight',
    });
  };

  const handleSubmit = async (values) => {
    setSpinning(true);
    try {
      setSpinning(false);
      success();
      onSuccess({ ...initialValues, ...values, startDate: values.startDate.format('YYYY-MM-DD'), endDate: values.endDate.format('YYYY-MM-DD') });
      form.resetFields();
    } catch (err) {
      setSpinning(false);
      error();
      console.error("Error updating leave request:", err);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Cập nhật đơn xin nghỉ phép
        </div>
      }
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      className="custom-modal"
    >
      <Spin spinning={spinning}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input placeholder="Nhập họ và tên bác sĩ" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="position"
                label="Chức vụ"
                rules={[{ required: true, message: 'Vui lòng nhập chức vụ' }]}
              >
                <Input placeholder="Nhập chức vụ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="department"
            label="Phòng ban công tác"
            rules={[{ required: true, message: 'Vui lòng nhập phòng ban' }]}
          >
            <Input placeholder="Nhập phòng ban công tác" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu nghỉ"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu nghỉ' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="endDate"
                label="Ngày kết thúc nghỉ"
                rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc nghỉ' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="reason"
            label="Lý do nghỉ"
            rules={[{ required: true, message: 'Vui lòng chọn lý do nghỉ' }]}
          >
            <Select placeholder="Chọn lý do nghỉ">
              <Option value="Nghỉ phép">Nghỉ phép</Option>
              <Option value="Nghỉ ốm">Nghỉ ốm</Option>
              <Option value="Đi công tác">Đi công tác</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="handover"
            label="Người bàn giao công việc"
            rules={[{ required: true, message: 'Vui lòng nhập người bàn giao công việc' }]}
          >
            <Input placeholder="Nhập tên người bàn giao công việc" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú / Cam kết"
          >
            <Input.TextArea rows={3} placeholder="Nhập ghi chú hoặc cam kết (nếu có)" />
          </Form.Item>

          <Form.Item className="button-group" style={{ textAlign: 'right' }}>
            <Button type="default" onClick={onCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default UpdateRequestLeave;
