import React, { useState, useEffect } from 'react';
import { Tabs, Button, Input, Row, Col, Card, Badge, Select } from 'antd';
import { PlusOutlined, SearchOutlined, BankOutlined } from '@ant-design/icons';
import DepartmentTable from './DepartmentTable';
import AddDepartment from './AddDepartment';
import { getAllDepartments } from '../../services/departmentService';
import './DepartmentManage.scss';
const { TabPane } = Tabs;
const { Option } = Select;

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
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

    const fetchDepartments = async (page = 1, pageSize = 10, search = '', status = 'all') => {
        setLoading(true);
        try {
            const params = {
                page,
                pageSize,
                search,
                status: status !== 'all' ? status : undefined
            };

            const data = await getAllDepartments(params);
            if (data) {
                setDepartments(data.items || []);
                setPagination({
                    ...pagination,
                    current: page,
                    pageSize,
                    total: data.total || 0,
                });

                // Calculate counts for each tab
                setCounts({
                    all: data.total || 0,
                    active: (data.items || []).filter(dept => dept.status === 'active').length,
                    inactive: (data.items || []).filter(dept => dept.status === 'inactive').length,
                });
            }
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments(pagination.current, pagination.pageSize, searchText, statusFilter);
    }, []);

    const handleTableChange = (pagination) => {
        fetchDepartments(pagination.current, pagination.pageSize, searchText, statusFilter);
    };

    const handleSearch = () => {
        fetchDepartments(1, pagination.pageSize, searchText, statusFilter);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        fetchDepartments(1, pagination.pageSize, searchText, value);
    };

    const handleAddDepartment = () => {
        setShowAddModal(true);
    };

    const handleAddDepartmentSuccess = () => {
        setShowAddModal(false);
        fetchDepartments(pagination.current, pagination.pageSize, searchText, statusFilter);
    };

    return (
        <div className="department-management-container">
            <Row gutter={[0, 24]}>
                <Col span={24}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <h2>
                                <BankOutlined style={{ marginRight: 12 }} />
                                Department Management
                            </h2>
                        </Col>
                        <Col>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddDepartment}
                                size="large"
                            >
                                Add Department
                            </Button>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <Card>
                        <Row className="actions-row" gutter={16}>
                            <Col xs={24} sm={12} md={8} lg={6} className="search-container">
                                <Input.Search
                                    placeholder="Search departments..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onSearch={handleSearch}
                                    enterButton={<SearchOutlined />}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={12} md={6} lg={4}>
                                <Select
                                    value={statusFilter}
                                    onChange={handleStatusFilter}
                                    style={{ width: '100%' }}
                                    placeholder="Filter by status"
                                >
                                    <Option value="all">All Status</Option>
                                    <Option value="active">Active</Option>
                                    <Option value="inactive">Inactive</Option>
                                </Select>
                            </Col>
                        </Row>

                        <Tabs defaultActiveKey="1" className="department-tabs">
                            <TabPane
                                tab={
                                    <span>
                                        All Departments <Badge count={counts.all} style={{ backgroundColor: '#1890ff' }} />
                                    </span>
                                }
                                key="1"
                            >
                                <DepartmentTable
                                    departments={departments}
                                    loading={loading}
                                    pagination={pagination}
                                    onChange={handleTableChange}
                                    onReload={() => fetchDepartments(pagination.current, pagination.pageSize, searchText, statusFilter)}
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
                                <DepartmentTable
                                    departments={departments.filter(dept => dept.status === 'active')}
                                    loading={loading}
                                    pagination={{ ...pagination, total: counts.active }}
                                    onChange={handleTableChange}
                                    onReload={() => fetchDepartments(pagination.current, pagination.pageSize, searchText, statusFilter)}
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
                                <DepartmentTable
                                    departments={departments.filter(dept => dept.status === 'inactive')}
                                    loading={loading}
                                    pagination={{ ...pagination, total: counts.inactive }}
                                    onChange={handleTableChange}
                                    onReload={() => fetchDepartments(pagination.current, pagination.pageSize, searchText, statusFilter)}
                                />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>

            {showAddModal && (
                <AddDepartment
                    visible={showAddModal}
                    onCancel={() => setShowAddModal(false)}
                    onSuccess={handleAddDepartmentSuccess}
                />
            )}
        </div>
    );
};

export default DepartmentManagement;