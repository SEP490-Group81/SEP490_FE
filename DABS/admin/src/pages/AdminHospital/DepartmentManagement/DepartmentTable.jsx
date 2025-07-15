import React, { useState } from 'react';
import { Table, Button, Space, Tag, Tooltip, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, BankOutlined, UserOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import EditDepartment from './EditDepartment';
import DeleteDepartment from './DeleteDepartment';
import ViewDepartment from './ViewDepartmentDetail';
import DoctorManagement from './DoctorManage';


const DepartmentTable = ({ departments, loading, pagination, onChange, onReload }) => {
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingDepartment, setViewingDepartment] = useState(null);
    const [showDoctorModal, setShowDoctorModal] = useState(false);
    const [managingDepartment, setManagingDepartment] = useState(null);

    const handleEdit = (record) => {
        setEditingDepartment(record);
        setShowEditModal(true);
    };

    const handleDelete = (record) => {
        setDepartmentToDelete(record);
        setShowDeleteModal(true);
    };

    const handleView = (record) => {
        setViewingDepartment(record);
        setShowViewModal(true);
    };

    const handleManageDoctors = (record) => {
        setManagingDepartment(record);
        setShowDoctorModal(true);
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        onReload();
    };

    const handleDeleteSuccess = () => {
        setShowDeleteModal(false);
        onReload();
    };

    const handleDoctorManagementSuccess = () => {
        onReload(); // Refresh department data
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'default';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const columns = [
        {
            title: 'Department',
            key: 'department',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        icon={<BankOutlined />}
                        style={{ marginRight: 12, backgroundColor: '#1890ff' }}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.name}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Code: {record.code}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Head of Department',
            key: 'head',
            render: (_, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <UserOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                        <span style={{ fontSize: '12px' }}>{record.headOfDepartment || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneOutlined style={{ marginRight: 4, color: '#52c41a' }} />
                        <span style={{ fontSize: '12px' }}>{record.phoneNumber || 'N/A'}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (location) => location || 'N/A',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)} className="department-status-tag">
                    {status?.toUpperCase() || 'N/A'}
                </Tag>
            ),
        },
        {
            title: 'Statistics',
            key: 'statistics',
            render: (_, record) => (
                <div>
                    <div style={{ fontSize: '12px' }}>Staff: <strong>{record.totalStaff || 0}</strong></div>
                    <div style={{ fontSize: '12px' }}>Beds: <strong>{record.totalBeds || 0}</strong></div>
                </div>
            ),
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDate(date),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Manage Doctors">
                        <Button
                            type="text"
                            icon={<TeamOutlined />}
                            onClick={() => handleManageDoctors(record)}
                            style={{ color: '#52c41a' }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="department-table-container">
            <Table
                columns={columns}
                dataSource={departments}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={onChange}
                bordered={false}
                size="middle"
            />

            {showEditModal && (
                <EditDepartment
                    visible={showEditModal}
                    record={editingDepartment}
                    onCancel={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {showDeleteModal && (
                <DeleteDepartment
                    visible={showDeleteModal}
                    record={departmentToDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    onSuccess={handleDeleteSuccess}
                />
            )}

            {showViewModal && (
                <ViewDepartment
                    visible={showViewModal}
                    record={viewingDepartment}
                    onCancel={() => setShowViewModal(false)}
                />
            )}

            {showDoctorModal && (
                <DoctorManagement
                    visible={showDoctorModal}
                    department={managingDepartment}
                    onCancel={() => setShowDoctorModal(false)}
                    onSuccess={handleDoctorManagementSuccess}
                />
            )}
        </div>
    );
};

export default DepartmentTable;