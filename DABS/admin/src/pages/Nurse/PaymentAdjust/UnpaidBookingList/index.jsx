import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Button,
  Badge,
  Tabs,
  ConfigProvider,
  Typography,
} from 'antd';
import { SearchOutlined, CreditCardOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import viVN from 'antd/es/locale/vi_VN';
import { getPayments } from '../../../../services/paymentService';


const { Title } = Typography;
const { TabPane } = Tabs;

const NurseUnpaidBookingList = () => {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [bookingList, setBookingList] = useState([]);
  const statusMap = {
    1: { text: 'Đang chờ', color: 'gold' },
    2: { text: 'Đã xác nhận', color: 'blue' },
    3: { text: 'Đã hủy', color: 'red' },
    4: { text: 'Hoàn thành', color: 'green' },
  };
  useEffect(() => {

    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await getPayments(105);
        const data = response?.result || [];
        const mapped = data.map(item => ({
          id: String(item.id),
          patientName: item.patientName,
          phoneNumber: item.patientPhone || '',
          serviceName: item.serviceName,
          amount: item.amount,             
          appointmentTime: item.appointmentTime || '',
          paymentMethod: item.method === 1 ? 'offline' : item.method === 2 ? 'online' : 'unknown',
          status: item.status,
          insuranceClaimInfo: item.insuranceClaimInfo,
        }));

        setBookingList(mapped);
      } catch (error) {
        console.error('Failed to load payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookingList.filter(
      (item) =>
        item.paymentMethod === 'offline' &&
        (activeTab === 'all' || String(item.status) === activeTab) &&
        (item.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.phoneNumber.includes(searchText) ||
          item.id.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [bookingList, searchText, activeTab]);

  const statusCounts = useMemo(() => {
    const counts = { all: 0 };
    Object.keys(statusMap).forEach(key => counts[key] = 0);

    bookingList.forEach(item => {
      if (item.paymentMethod !== 'offline') return;

      counts.all += 1;
      if (counts[item.status]) {
        counts[item.status] += 1;
      }
    });

    return counts;
  }, [bookingList]);

  const columns = [
    {
      title: 'Mã đặt khám',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (text) => {
        if (text === 'offline') return 'Thanh toán tại viện';
        if (text === 'online') return 'Thanh toán online';
        return 'Không rõ';
      },
    },
    {
      title: 'Giá tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) =>
        value ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '',
    },
    {
      title: 'Thời gian',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        const st = statusMap[record.status];
        return st ? (
          <Tag color={st.color}>{st.text}</Tag>
        ) : (
          <Tag color="default">Không rõ</Tag>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/nurse/payment-confirm/${record.id}`)}
        >
          Xác nhận
        </Button>
      ),
    },
  ];


  return (
    <ConfigProvider locale={viVN}>
      <div className="staff-payment-list">
        <Row gutter={[0, 24]}>
          <Col span={24}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={3}>
                  <CreditCardOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  Xác nhận thanh toán tại viện
                </Title>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Card bordered={false} style={{ borderRadius: 12 }}>
              <Row className="actions-row" style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Input.Search
                    placeholder="Tìm theo mã, tên, SĐT..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    enterButton
                    allowClear
                  />
                </Col>
              </Row>

              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane key="all" tab={<span>Tất cả <Badge count={statusCounts.all} /></span>} />
                <TabPane key="1" tab={<span>Đang chờ <Badge count={statusCounts[1]} style={{ backgroundColor: 'gold' }} /></span>} />
                <TabPane key="2" tab={<span>Đã xác nhận <Badge count={statusCounts[2]} style={{ backgroundColor: 'blue' }} /></span>} />
                <TabPane key="3" tab={<span>Đã hủy <Badge count={statusCounts[3]} style={{ backgroundColor: 'red' }} /></span>} />
                <TabPane key="4" tab={<span>Hoàn thành <Badge count={statusCounts[4]} style={{ backgroundColor: 'green' }} /></span>} />
              </Tabs>

              <Table
                columns={columns}
                dataSource={filteredBookings}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default NurseUnpaidBookingList;
