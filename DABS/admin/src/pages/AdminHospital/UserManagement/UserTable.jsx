import React, { useState } from 'react';
import { Table, Button, Space, Tag, Tooltip, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';
import ViewUser from './ViewUser';

const UserTable = ({ users, loading, pagination, onChange, onReload }) => {
    const [editingUser, setEditingUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingUser, setViewingUser] = useState(null);

    const handleEdit = (record) => {
        setEditingUser(record);
        setShowEditModal(true);
    };

    const handleDelete = (record) => {
        setUserToDelete(record);
        setShowDeleteModal(true);
    };

    const handleEditSuccess = () => {
        setShowEditModal(false);
        onReload();
    };

    const handleView = (record) => {
        setViewingUser(record);
        setShowViewModal(true);
    };

    const handleDeleteSuccess = () => {
        setShowDeleteModal(false);
        onReload();
    };

    const getStatusColor = (active) => {
        return active ? 'success' : 'default';
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'systemAdmin': return '#faad14';
            case 'hospitalAdmin': return '#722ed1';
            case 'doctor': return '#52c41a';
            case 'nurse': return '#13c2c2';
            case 'patient': return '#1890ff';
            default: return '#8c8c8c';
        }
    };

    // ✅ Chuyển đổi role sang tiếng Việt
    const getRoleDisplayName = (roleType) => {
        switch (roleType) {
            case 2: return 'Bác sĩ';
            case 4: return 'Quản trị viên BV';
            case 5: return 'Quản trị hệ thống';
            case 6: return 'Bệnh nhân';
            case 7: return 'Y tá';
            default: return 'Người dùng';
        }
    };

    // Extract role from username if not provided directly
    const getUserRole = (user) => {
        if (!user.role) return 'user';

        const roleType = user.role.roleType;
        
        // Option 1: Map by roleType
        switch (roleType) {
            case 2: return 'doctor';
            case 4: return 'hospitalAdmin';
            case 5: return 'systemAdmin';
            case 6: return 'patient';
            case 7: return 'nurse';
            default: return 'user';
        }
    };

    const columns = [
        {
            title: 'Người dùng',
            key: 'user',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        icon={<UserOutlined />}
                        style={{ marginRight: 12, backgroundColor: '#1890ff' }}
                        src={record.avatarUrl}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.fullname || 'Không rõ'}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.email || 'Chưa có email'}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: 'userName',
            key: 'userName',
            render: (text) => text || 'Chưa có',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (text) => text || 'Chưa có',
        },
        {
            title: 'Vai trò',
            key: 'role',
            render: (_, record) => {
                const role = getUserRole(record);
                const roleType = record.role?.roleType;
                const displayName = getRoleDisplayName(roleType);
                
                return (
                    <Tag color={getRoleColor(role)} className="user-role-tag">
                        {displayName}
                    </Tag>
                );
            },
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_, record) => (
                <Tag color={getStatusColor(record.active)} className="user-status-tag">
                    {record.active ? 'HOẠT ĐỘNG' : 'NGƯNG HOẠT ĐỘNG'}
                </Tag>
            ),
        },
        {
            title: 'Xác thực',
            key: 'verification',
            render: (_, record) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Tag 
                        color={record.isVerifiedEmail ? 'green' : 'orange'} 
                        style={{ margin: 0, fontSize: '11px' }}
                    >
                        {record.isVerifiedEmail ? '✓ Email đã xác thực' : '⏳ Email chưa xác thực'}
                    </Tag>
                    {record.phoneNumber && (
                        <Tag 
                            color={record.isVerifiedPhone ? 'green' : 'orange'}
                            style={{ margin: 0, fontSize: '11px' }}
                        >
                            {record.isVerifiedPhone ? '✓ SĐT đã xác thực' : '⏳ SĐT chưa xác thực'}
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                            style={{ color: '#1890ff' }}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            style={{ color: '#52c41a' }}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
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
        <div className="user-table-container">
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => 
                        `${range[0]}-${range[1]} của ${total} người dùng`,
                    pageSizeOptions: ['10', '20', '50', '100'],
                    size: 'default'
                }}
                loading={loading ? { tip: 'Đang tải dữ liệu...' } : false}
                onChange={onChange}
                bordered={false}
                size="middle"
                locale={{
                    emptyText: (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <UserOutlined style={{ fontSize: '24px', color: '#d9d9d9', marginBottom: '8px' }} />
                            <div style={{ color: '#999' }}>Không có dữ liệu người dùng</div>
                        </div>
                    ),
                    triggerDesc: 'Nhấn để sắp xếp giảm dần',
                    triggerAsc: 'Nhấn để sắp xếp tăng dần',
                    cancelSort: 'Nhấn để hủy sắp xếp',
                }}
                scroll={{ x: 1000 }}
            />

            {/* ✅ Edit Modal */}
            {showEditModal && (
                <EditUser
                    visible={showEditModal}
                    record={editingUser}
                    onCancel={() => setShowEditModal(false)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {/* ✅ Delete Modal */}
            {showDeleteModal && (
                <DeleteUser
                    visible={showDeleteModal}
                    record={userToDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    onSuccess={handleDeleteSuccess}
                />
            )}

            {/* ✅ View Modal */}
            {showViewModal && (
                <ViewUser
                    visible={showViewModal}
                    record={viewingUser}
                    onCancel={() => setShowViewModal(false)}
                />
            )}
        </div>
    );
};

export default UserTable;