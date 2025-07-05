import React, { useState, useEffect } from 'react';
import { Tabs, Button, Input, Row, Col, Card, Badge, Select } from 'antd';
import { PlusOutlined, SearchOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import HospitalTable from './HospitalTable';
import AddHospital from './AddHospital';
import { getAllHospitals } from '../../services/hospitalService';
import './HospitalManagement.scss';

const { TabPane } = Tabs;
const { Option } = Select;

const HospitalManagement = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
  });

  const fetchHospitals = async (page = 1, pageSize = 10, search = '', status = 'all', type = 'all') => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
        search,
        status: status !== 'all' ? status : undefined,
        type: type !== 'all' ? type : undefined
      };

      const data = await getAllHospitals(params);
      if (data) {
        setHospitals(data.items || []);
        setPagination({
          ...pagination,
          current: page,
          pageSize,
          total: data.total || 0,
        });

        setCounts({
          all: data.total || 0,
          active: (data.items || []).filter(hospital => hospital.status === 'active').length,
          inactive: (data.items || []).filter(hospital => hospital.status === 'inactive').length,
        });
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals(pagination.current, pagination.pageSize, searchText, statusFilter, typeFilter);
  }, []);

  const handleTableChange = (pagination) => {
    fetchHospitals(pagination.current, pagination.pageSize, searchText, statusFilter, typeFilter);
  };

  const handleSearch = () => {
    fetchHospitals(1, pagination.pageSize, searchText, statusFilter, typeFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    fetchHospitals(1, pagination.pageSize, searchText, value, typeFilter);
  };

  const handleTypeFilter = (value) => {
    setTypeFilter(value);
    fetchHospitals(1, pagination.pageSize, searchText, statusFilter, value);
  };

  const handleAddHospital = () => {
    setShowAddModal(true);
  };

  const handleAddHospitalSuccess = () => {
    setShowAddModal(false);
    fetchHospitals(pagination.current, pagination.pageSize, searchText, statusFilter, typeFilter);
  };

  return (
    <div className="hospital-management-container">
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row justify="space-between" align="middle">
            <Col>
              <h2>
                <MedicineBoxOutlined style={{ marginRight: 12 }} />
                Hospital Management
              </h2>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddHospital}
                size="large"
              >
                Add Hospital
              </Button>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Card>
            <Row className="actions-row" gutter={16}>
              <Col xs={24} sm={12} md={8} lg={6} className="search-container">
                <Input.Search
                  placeholder="Search hospitals..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={handleSearch}
                  enterButton={<SearchOutlined />}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={6} md={4} lg={3}>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  style={{ width: '100%' }}
                  placeholder="Status"
                >
                  <Option value="all">All Status</Option>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Col>
              <Col xs={24} sm={6} md={4} lg={3}>
                <Select
                  value={typeFilter}
                  onChange={handleTypeFilter}
                  style={{ width: '100%' }}
                  placeholder="Type"
                >
                  <Option value="all">All Types</Option>
                  <Option value="General">General</Option>
                  <Option value="Specialized">Specialized</Option>
                  <Option value="Community">Community</Option>
                </Select>
              </Col>
            </Row>

            <Tabs defaultActiveKey="1" className="hospital-tabs">
              <TabPane
                tab={
                  <span>
                    All Hospitals <Badge count={counts.all} style={{ backgroundColor: '#1890ff' }} />
                  </span>
                }
                key="1"
              >
                <HospitalTable
                  hospitals={hospitals}
                  loading={loading}
                  pagination={pagination}
                  onChange={handleTableChange}
                  onReload={() => fetchHospitals(pagination.current, pagination.pageSize, searchText, statusFilter, typeFilter)}
                />
              </TabPane>

              <TabPane
                tab={
                  <span>
                    Active <Badge count={counts.active} style={{ backgroundColor: '#52c41a' }} />
                  </span>
                }
                key="2"
              >
                <HospitalTable
                  hospitals={hospitals.filter(hospital => hospital.status === 'active')}
                  loading={loading}
                  pagination={{ ...pagination, total: counts.active }}
                  onChange={handleTableChange}
                  onReload={() => fetchHospitals(pagination.current, pagination.pageSize, searchText, statusFilter, typeFilter)}
                />
              </TabPane>

              <TabPane
                tab={
                  <span>
                    Inactive <Badge count={counts.inactive} style={{ backgroundColor: '#ff4d4f' }} />
                  </span>
                }
                key="3"
              >
                <HospitalTable
                  hospitals={hospitals.filter(hospital => hospital.status === 'inactive')}
                  loading={loading}
                  pagination={{ ...pagination, total: counts.inactive }}
                  onChange={handleTableChange}
                  onReload={() => fetchHospitals(pagination.current, pagination.pageSize, searchText, statusFilter, typeFilter)}
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      {showAddModal && (
        <AddHospital
          visible={showAddModal}
          onCancel={() => setShowAddModal(false)}
          onSuccess={handleAddHospitalSuccess}
        />
      )}
    </div>
  );
};

export default HospitalManagement;