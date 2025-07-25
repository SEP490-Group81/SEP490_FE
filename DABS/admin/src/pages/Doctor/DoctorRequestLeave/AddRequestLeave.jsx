import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, Spin, notification, Row, Col } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Option } = Select;

const DoctorLeaveRequestForm = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);

  const success = () => {
    notification.success({
      message: 'Thành công',
      description: 'Đơn xin nghỉ phép đã được gửi thành công!',
      placement: 'topRight',
    });
  };

  const error = () => {
    notification.error({
      message: 'Lỗi',
      description: 'Gửi đơn xin nghỉ phép thất bại. Vui lòng thử lại.',
      placement: 'topRight',
    });
  };

  const handleSubmit = async (values) => {
    setSpinning(true);
    try {
      // await sendLeaveRequest(values);
      setSpinning(false);
      form.resetFields();
      success();
      onSuccess();
    } catch (err) {
      setSpinning(false);
      error();
      console.error("Error submitting leave request:", err);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Đơn Xin Nghỉ Phép Bác Sĩ
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
          initialValues={{ reason: 'Nghỉ phép' }}
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
      
          </Row>

     

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
              Gửi đơn
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default DoctorLeaveRequestForm;
