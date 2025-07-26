import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Space,
  Modal,
  message,
  Spin,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { cancelAppointment, changeAppointmentStatus } from '../../../../services/paymentService';



const formatCurrency = (value) =>
  value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '';

const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh',
  });
};

function NursePaymentConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  // Modal quản lý
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const [modalType, setModalType] = useState(''); // 'confirmPayment' | 'cancelBooking'

  useEffect(() => {
    if (location.state && typeof location.state === 'object') {
      setBooking(location.state);
    } else {
      message.warning('Không tìm thấy dữ liệu đặt khám, đang chuyển hướng về trang danh sách.');
      navigate('/nurse/unpaid-bookings', { replace: true });
    }
  }, [location.state, navigate]);

  const openModal = (type) => {
    if (type === 'confirmPayment') {
      setModalTitle('Xác nhận thanh toán');
      setModalContent('Bạn có chắc chắn đã nhận được thanh toán từ bệnh nhân không?');
    } else if (type === 'cancelBooking') {
      setModalTitle('Hủy lịch khám');
      setModalContent('Bạn có chắc chắn muốn hủy lịch khám này không?');
    }
    setModalType(type);
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    setModalLoading(true);
    try {
      if (modalType === 'confirmPayment') {
        console.log('Confirming payment for booking:', booking);
        await changeAppointmentStatus(booking.id, '2');
        message.success('Xác nhận thanh toán thành công!');
        setBooking(prev => ({ ...prev, paymentStatus: 'PAID', status: 2 }));
      } else if (modalType === 'cancelBooking') {
        console.log('Cancelling booking:', booking);
        await cancelAppointment(booking.id);
        message.success('Đã hủy lịch khám.');
        navigate('/nurse/unpaid-bookings', { replace: true });
      }
      setModalVisible(false);
    } catch (error) {
      message.error(modalType === 'confirmPayment' ? 'Có lỗi khi xác nhận thanh toán!' : 'Hủy lịch thất bại!');
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  if (!booking) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Spin size="large" tip="Đang tải thông tin đặt khám..." />
      </div>
    );
  }

  return (
    <>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Xác nhận thanh toán tại viện</span>
            <Button
              type="default"
              onClick={() => navigate(-1)}
              icon={<ArrowLeftOutlined />}
              style={{
                backgroundColor: '#e6f7ff',
                borderColor: '#91d5ff',
                color: '#1890ff',
                fontWeight: '600',
                borderRadius: 6,
                padding: '0 16px',
              }}
            >
              Quay lại
            </Button>
          </div>
        }
        bordered={false}
        style={{ maxWidth: 700, margin: '40px auto' }}
      >
        <Descriptions
          bordered
          column={1}
          size="middle"
          style={{ borderRadius: 8, overflow: 'hidden' }}
          labelStyle={{ fontWeight: '600' }}
        >
          <Descriptions.Item label="Mã đặt khám">{booking.id}</Descriptions.Item>
          <Descriptions.Item label="Họ tên bệnh nhân">{booking.patientName}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{booking.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Dịch vụ khám">{booking.serviceName}</Descriptions.Item>
          <Descriptions.Item label="Bác sĩ">{booking.doctorName || '—'}</Descriptions.Item>
          <Descriptions.Item label="Thời gian khám">{formatDateTime(booking.appointmentTime)}</Descriptions.Item>
          {booking.createdOn && (
            <Descriptions.Item label="Ngày tạo">{formatDateTime(booking.createdOn)}</Descriptions.Item>
          )}
          <Descriptions.Item label="Phương thức thanh toán">{booking.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">{formatCurrency(booking.amount)}</Descriptions.Item>
          {booking.insuranceClaimInfo != null && (
            <Descriptions.Item label="Thông tin bảo hiểm">{booking.insuranceClaimInfo || '—'}</Descriptions.Item>
          )}
          <Descriptions.Item label="Trạng thái thanh toán">
            {booking.paymentStatus === 'PAID' ? (
              <Tag color="green">Đã thanh toán</Tag>
            ) : (
              <Tag color="red">Chưa thanh toán</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
          }}
        >
          <Button
            type="primary"
            onClick={() => openModal('confirmPayment')}
            disabled={booking.paymentStatus === 'PAID'}
            style={{ borderRadius: 6, padding: '0 24px' }}
          >
            Xác nhận đã thanh toán
          </Button>
          <Button
            danger
            onClick={() => openModal('cancelBooking')}
            style={{ borderRadius: 6, padding: '0 24px' }}
          >
            Hủy lịch khám
          </Button>
        </div>
      </Card>

      {/* Modal confirm nằm cùng cấp render */}
      <Modal
        visible={modalVisible}
        title={modalTitle}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={modalLoading}
        maskClosable={false}
        destroyOnClose
      >
        {modalContent}
      </Modal>
    </>
  );
}

export default NursePaymentConfirmation;
