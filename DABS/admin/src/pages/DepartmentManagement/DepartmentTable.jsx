import React, { useState } from 'react';
import { Table, Button, Space, Tag, Tooltip, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, BankOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import EditDepartment from './EditDepartment';
import DeleteDepartment from './DeleteDepartment';
import ViewDepartment from './ViewDepartmentDetail';


const DepartmentTable = ({ departments, loading, pagination, onChange, onReload }) => {
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingDepartment, setViewingDepartment] = useState(null);

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

    const handleEditSuccess = () => {
        setShowEditModal(false);
        onReload();
    };

    const handleDeleteSuccess = () => {
        setShowDeleteModal(false);
        onReload();
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
            key: 'headOfDepartment',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    {record.headOfDepartment}
                </div>
            ),
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (_, record) => (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                        <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                        <span style={{ fontSize: '12px' }}>{record.phoneNumber}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.email}</div>
                </div>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Staff/Beds',
            key: 'staffBeds',
            render: (_, record) => (
                <div>
                    <div style={{ fontSize: '12px' }}>Staff: <strong>{record.totalStaff}</strong></div>
                    <div style={{ fontSize: '12px' }}>Beds: <strong>{record.totalBeds}</strong></div>
                </div>
            ),
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
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => formatDate(date),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
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
        </div>
    );
};

export default DepartmentTable;