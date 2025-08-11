import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Spin, notification, Row, Col } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { updateDepartment, getDepartmentById } from '../../../services/departmentService';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const EditDepartment = ({ visible, record, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [spinning, setSpinning] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy thông tin user và hospitalId từ Redux
  const user = useSelector((state) => state.user?.user);
  const hospitalId = user?.hospitals?.[0]?.id;

  useEffect(() => {
    if (visible && record?.id) {
      fetchDepartmentDetails(record.id);
    }
  }, [visible, record]);

  const fetchDepartmentDetails = async (departmentId) => {
    setLoading(true);
    try {
      const departmentData = await getDepartmentById(departmentId);
      if (departmentData) {
        form.setFieldsValue({
          name: departmentData.name || '',
          description: departmentData.description || '',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải thông tin khoa. Vui lòng thử lại.',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = () => {
    notification.success({
      message: 'Thành công',
      description: 'Cập nhật khoa thành công!',
      placement: 'topRight',
      duration: 3,
    });
  };

  const showError = (errorMsg) => {
    notification.error({
      message: 'Lỗi',
      description: errorMsg || 'Không thể cập nhật khoa. Vui lòng thử lại.',
      placement: 'topRight',
      duration: 5,
    });
  };

  const getErrorMessage = (err) => {
    if (!err.response) {
      return err.code === 'NETWORK_ERROR' 
        ? 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.' 
        : err.message || 'Lỗi không xác định.';
    }

    const { status, data } = err.response;
    const statusMessages = {
      400: 'Dữ liệu không hợp lệ (400). Kiểm tra id và hospitalId phải là số.',
      404: 'Không tìm thấy khoa (404). Khoa có thể đã bị xóa.',
      415: 'Lỗi định dạng dữ liệu (415). Server không chấp nhận Content-Type này.',
      500: 'Lỗi server (500). Vui lòng thử lại sau.',
    };

    let errorMessage = statusMessages[status] || `Lỗi HTTP ${status}. Vui lòng thử lại.`;

    if (data) {
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data.message || data.title) {
        errorMessage = data.message || data.title;
      } else if (data.errors) {
        const validationErrors = [];
        Object.entries(data.errors).forEach(([field, messages]) => {
          const msgs = Array.isArray(messages) ? messages : [messages];
          msgs.forEach(msg => validationErrors.push(`${field}: ${msg}`));
        });
        if (validationErrors.length > 0) {
          errorMessage = validationErrors.join(', ');
        }
      }
    }

    return errorMessage;
  };

  const isSuccessResponse = (response) => {
    if (response === true) return true;
    if (!response || typeof response !== 'object') return false;
    
    return response.success === true ||
           (response.status >= 200 && response.status < 300) ||
           (response.message && response.message.toLowerCase().includes('success')) ||
           (!response.error && response.success !== false);
  };

  const handleSubmit = async (values) => {
    // ✅ Validation
    if (!hospitalId) {
      showError('Không tìm thấy ID bệnh viện. Vui lòng đăng nhập lại.');
      return;
    }

    if (!record?.id) {
      showError('Không tìm thấy ID khoa. Vui lòng thử lại.');
      return;
    }

    if (!values.name?.trim() || !values.description?.trim()) {
      showError('Tên khoa và mô tả không được để trống.');
      return;
    }

    setSpinning(true);
    
    try {
      // ✅ Tạo payload theo format yêu cầu
      const updatePayload = {
        id: Number(record.id),
        hospitalId: Number(hospitalId),
        name: values.name.trim(),
        description: values.description.trim()
      };

      console.log('📤 Payload gửi đi:', updatePayload);
      
      const response = await updateDepartment(updatePayload);
      
      if (isSuccessResponse(response)) {
        showSuccess();
        setTimeout(() => onSuccess(), 1000);
      } else {
        const errorMessage = response?.message || response?.error || response?.title || 'Cập nhật khoa thất bại.';
        showError(errorMessage);
      }
    } catch (err) {
      console.error('💥 Lỗi cập nhật khoa:', err);
      showError(getErrorMessage(err));
    } finally {
      setSpinning(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlined style={{ color: '#1890ff', marginRight: 8, fontSize: '18px' }} />
          <span style={{ fontSize: '16px', fontWeight: 600 }}>
            Chỉnh sửa Khoa: {record?.name || 'Không rõ'}
          </span>
          {user?.hospitals?.[0] && (
            <span style={{
              fontSize: '12px',
              color: '#666',
              marginLeft: '8px',
              fontWeight: 'normal'
            }}>
              - {user.hospitals[0].name}
            </span>
          )}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
      maskClosable={false}
      centered
    >
      <Spin spinning={spinning || loading} tip={loading ? "Đang tải dữ liệu..." : "Đang cập nhật..."}>
        <div style={{ padding: '16px 0' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            preserve={false}
            validateTrigger={['onChange', 'onBlur']}
          >
            {/* ✅ Thông tin cơ bản */}
            <div style={{
              marginBottom: 24,
              padding: '20px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e8e8e8'
            }}>
              <h3 style={{
                color: '#1890ff',
                marginBottom: 16,
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center'
              }}>
                📋 Thông tin cơ bản
              </h3>

              <Form.Item
                name="name"
                label="Tên khoa"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên khoa' },
                  { min: 2, message: 'Tên khoa phải có ít nhất 2 ký tự' },
                  { max: 100, message: 'Tên khoa không được quá 100 ký tự' },
                  { 
                    validator: (_, value) => {
                      if (value && value.trim().length === 0) {
                        return Promise.reject(new Error('Tên khoa không được chỉ chứa khoảng trắng'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
                hasFeedback
              >
                <Input 
                  placeholder="Ví dụ: Khoa Tim mạch, Khoa Cấp cứu..." 
                  style={{ fontSize: '14px' }}
                  showCount
                  maxLength={100}
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Mô tả khoa"
                rules={[
                  { required: true, message: 'Vui lòng nhập mô tả khoa' },
                  { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự' },
                  { max: 500, message: 'Mô tả không được quá 500 ký tự' },
                  { 
                    validator: (_, value) => {
                      if (value && value.trim().length < 10) {
                        return Promise.reject(new Error('Mô tả sau khi loại bỏ khoảng trắng phải có ít nhất 10 ký tự'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
                hasFeedback
              >
                <TextArea 
                  placeholder="Mô tả chi tiết về chức năng, dịch vụ và chuyên môn của khoa..." 
                  rows={4}
                  style={{ fontSize: '14px' }}
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </div>

            {/* ✅ Thông tin chỉ đọc */}
            <div style={{
              marginBottom: 24,
              padding: '16px',
              background: '#f0f0f0',
              borderRadius: '6px',
              border: '1px solid #d9d9d9'
            }}>
              <h4 style={{
                color: '#666',
                marginBottom: 12,
                fontSize: '13px',
                fontWeight: 500
              }}>
                📊 Thông tin khác (Chỉ đọc)
              </h4>
              
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <div style={{ fontSize: '12px', marginBottom: 8 }}>
                    <strong>ID Khoa:</strong> <code>{record?.id || 'Không rõ'}</code>
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: 8 }}>
                    <strong>ID Bệnh viện:</strong> <code>{hospitalId || 'Không rõ'}</code>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div style={{ fontSize: '12px', marginBottom: 8 }}>
                    <strong>Bệnh viện:</strong> {user?.hospitals?.[0]?.name || 'Không rõ'}
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: 8 }}>
                    <strong>Ngày tạo:</strong> {record?.createdAt ? new Date(record.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                  </div>
                </Col>
              </Row>
            </div>

            {/* ✅ Ghi chú API */}
            <div style={{
              marginBottom: 24,
              padding: '12px 16px',
              background: '#e6f7ff',
              borderRadius: '6px',
              border: '1px solid #91d5ff',
              fontSize: '12px'
            }}>
              <div style={{ color: '#1890ff', fontWeight: 500, marginBottom: 4 }}>
                📡 Payload sẽ được gửi:
              </div>
              <div style={{ color: '#666', lineHeight: '1.4' }}>
                <code style={{
                  display: 'block',
                  background: '#f5f5f5',
                  padding: '8px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11px'
                }}>
                  {JSON.stringify({
                    id: record?.id ? Number(record.id) : 'N/A',
                    hospitalId: hospitalId ? Number(hospitalId) : 'N/A',
                    name: "string (từ form)",
                    description: "string (từ form)"
                  }, null, 2)}
                </code>
                • <strong>Endpoint:</strong> updateDepartment(payload)<br />
                • <strong>Content-Type:</strong> application/json<br />
                • Tất cả 4 fields đều là required
              </div>
            </div>

            {/* ✅ Nút hành động */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              paddingTop: 16,
              borderTop: '1px solid #f0f0f0'
            }}>
              <Button 
                onClick={handleCancel} 
                size="large"
                disabled={spinning}
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={spinning}
                size="large"
                disabled={loading}
              >
                {spinning ? 'Đang cập nhật...' : 'Cập nhật Khoa'}
              </Button>
            </div>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default EditDepartment;