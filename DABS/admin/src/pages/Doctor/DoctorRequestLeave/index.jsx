import React, { useState, useEffect } from 'react';
import { Tabs, Button, Input, Row, Col, Card, Badge, Table, Typography, message } from 'antd';
import { PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import AddUser from './AddRequestLeave';
import UpdateRequestLeave from './UpdateRequestLeave';
import './styles.scss';
import { useSelector } from 'react-redux';
import { getRequestsByHospital, createRequest, updateRequest } from '../../../services/requestService';

const DoctorRequestLeave = () => {
  const { Title, Text } = Typography;
  const user = useSelector((state) => state.user.user);
  const hospitalId = user?.hospitals?.[0]?.id;
  const doctorUserId = user?.id;

  const [dataSource, setDataSource] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Load dữ liệu thực tế từ API
  useEffect(() => {
    const fetchRequests = async () => {
      if (!hospitalId || !doctorUserId) return;
      try {
        const allRequests = await getRequestsByHospital(hospitalId, doctorUserId);
        // Lọc lấy đúng các request bác sĩ (roleName "Doctor")
        const doctorRequests = allRequests.filter(r => r.roleName?.toLowerCase() === 'doctor');
        
        // Map data API về định dạng bạn đang dùng (thêm key)
        const mappedData = doctorRequests.map((item) => ({
          key: item.id.toString(),
          fullName: item.requesterName,
          position: 'Bác sĩ chuyên khoa', // Có thể lấy từ API nếu có trường tương ứng
          department: item.department || '', // Nếu backend có dữ liệu phòng ban
          startDate: item.startDate ? item.startDate.split('T')[0] : '',
          endDate: item.endDate ? item.endDate.split('T')[0] : '',
          status: item.status === 1 ? 'pending' : item.status === 2 ? 'approved' : item.status === 3 ? 'completed' : 'unknown',
          rawData: item, // lưu lại dữ liệu gốc nếu cần cho update
        }));
        setDataSource(mappedData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu cầu nghỉ của bác sĩ:", error);
        message.error('Lỗi khi tải danh sách yêu cầu nghỉ');
      }
    };
    fetchRequests();
  }, [hospitalId, doctorUserId]);

  const filteredData = dataSource.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowUpdateModal(true);
  };

  
  const handleAddUserSuccess = (newRequest) => {
    setShowAddModal(false);
    message.success("Thêm đơn nghỉ phép thành công");
  };
  const handleUpdateSuccess = (updatedRecord) => {
    setShowUpdateModal(false);
    setEditingRecord(null);
    message.success("Cập nhật đơn nghỉ phép thành công");
  };

  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let text = '';

        switch (status) {
          case 'pending':
            color = 'gold';
            text = 'Đang chờ';
            break;
          case 'approved':
            color = 'green';
            text = 'Đã chấp nhận';
            break;
          case 'completed':
            color = 'gray';
            text = 'Đã kết thúc';
            break;
          default:
            color = 'default';
            text = status;
        }

        return <Badge color={color} text={text} />;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <>
          <Button
            type="link"
            disabled={record.status !== 'pending'}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            disabled={record.status !== 'pending'}
            onClick={() => {
              // TODO: Thêm xử lý xóa request gọi API nếu cần
              message.info("Chức năng xóa chưa được triển khai");
            }}
          >
            Xoá
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="user-management-container">
      <Row gutter={24} style={{ marginBottom: 24, justifyContent: 'space-between' }}>
        <Col xs={24}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>
                <UserOutlined style={{ marginRight: 12 }} />
                Đơn xin nghỉ phép của bác sĩ
              </Title>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddUser}
                size="large"
              >
                Tạo đơn xin nghỉ phép
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginBottom: 24, justifyContent: 'space-between' }}>
        <Col xs={24} sm={8}>
          <Card style={{ textAlign: 'center' }}>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              {/* Bạn có thể tính toán số ngày nghỉ từ API hoặc update sau */}
              8/15
            </Title>
            <Text style={{ fontFamily: "Roboto", fontSize: 20, fontWeight: 500 }}>Số ngày đã nghỉ</Text>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card style={{ textAlign: 'center' }}>
            <Title level={2} style={{ margin: 0, color: '#faad14' }}>
              0/3
            </Title>
            <Text style={{ fontFamily: "Roboto", fontSize: 20, fontWeight: 500 }}>Số ngày nghỉ lễ</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Card>
            <Row className="actions-row" gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6} className="search-container">
                <Input.Search
                  placeholder="Tìm theo họ tên..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  enterButton={<SearchOutlined />}
                  size="middle"
                  allowClear
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            rowKey="key"
            style={{ marginTop: 24 }}
          />
        </Col>
      </Row>

      {showAddModal && (
        <AddUser
          visible={showAddModal}
          onCancel={() => setShowAddModal(false)}
          onSuccess={(newRequestRaw) => {
            // Map lại dữ liệu mới tương tự
            const newMapped = {
              key: newRequestRaw.id.toString(),
              fullName: newRequestRaw.requesterName,
              position: 'Bác sĩ chuyên khoa',
              department: newRequestRaw.department || '',
              startDate: newRequestRaw.startDate ? newRequestRaw.startDate.split('T')[0] : '',
              endDate: newRequestRaw.endDate ? newRequestRaw.endDate.split('T')[0] : '',
              status: newRequestRaw.status === 1 ? 'pending' : newRequestRaw.status === 2 ? 'approved' : 'completed',
              rawData: newRequestRaw,
            };
            handleAddUserSuccess(newMapped);
          }}
          userId={doctorUserId}
          hospitalId={hospitalId}
        />
      )}

      {showUpdateModal && editingRecord && (
        <UpdateRequestLeave
          visible={showUpdateModal}
          onCancel={() => {
            setShowUpdateModal(false);
            setEditingRecord(null);
          }}
          onSuccess={(updatedRequestRaw) => {
            const updatedMapped = {
              key: updatedRequestRaw.id.toString(),
              fullName: updatedRequestRaw.requesterName,
              position: 'Bác sĩ chuyên khoa',
              department: updatedRequestRaw.department || '',
              startDate: updatedRequestRaw.startDate ? updatedRequestRaw.startDate.split('T')[0] : '',
              endDate: updatedRequestRaw.endDate ? updatedRequestRaw.endDate.split('T')[0] : '',
              status: updatedRequestRaw.status === 1 ? 'pending' : updatedRequestRaw.status === 2 ? 'approved' : 'completed',
              rawData: updatedRequestRaw,
            };
            handleUpdateSuccess(updatedMapped);
          }}
          initialValues={editingRecord.rawData}
          hospitalId={hospitalId}
          userId={doctorUserId}
        />
      )}
    </div>
  );
};

export default DoctorRequestLeave;
