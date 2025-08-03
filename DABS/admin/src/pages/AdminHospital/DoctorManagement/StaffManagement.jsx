import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Input,
    Select,
    Space,
    Avatar,
    Tag,
    Tooltip,
    Rate,
    Modal,
    Row,
    Col,
    Statistic,
    Typography,
    Tabs
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    UserOutlined,
    MedicineBoxOutlined,
    HeartOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../redux/slices/messageSlice';
import {
    deleteDoctor,
    updateDoctorStatus,
    getAllDoctors
} from '../../../services/doctorService';


import AddStaff from './AddStaff';
import EditStaff from './EditStaff';
import ViewStaff from './ViewStaff';
import DeleteStaff from './DeleteStaff';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

const StaffManagementPage = () => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [specializationFilter, setSpecializationFilter] = useState('all');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalNurses: 0,
        activeDoctors: 0,
        activeNurses: 0,
        inactiveDoctors: 0,
        inactiveNurses: 0,
        departments: 0
    });


    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffType, setStaffType] = useState('doctor');
    const [selectedViewStaff, setSelectedViewStaff] = useState(null);

    const dispatch = useDispatch();


    const departments = [
        { id: 1, name: 'Cardiology' },
        { id: 2, name: 'Neurology' },
        { id: 3, name: 'Emergency' },
        { id: 4, name: 'Pediatrics' },
        { id: 5, name: 'Orthopedics' },
        { id: 6, name: 'Surgery' },
        { id: 7, name: 'Internal Medicine' },
        { id: 8, name: 'Radiology' },
        { id: 9, name: 'Laboratory' }
    ];

    const specializations = [
        'Cardiology',
        'Neurology',
        'Emergency Medicine',
        'Pediatrics',
        'Orthopedics',
        'General Surgery',
        'Internal Medicine',
        'Radiology',
        'Pathology',
        'Anesthesiology',
        'Critical Care',
        'Intensive Care',
        'Operating Room',
        'Recovery'
    ];


    const sampleNurses = [
        {
            id: 101,
            type: 'nurse',
            name: 'Nurse Sarah Wilson',
            fullname: 'Nurse Sarah Wilson',
            email: 'sarah.wilson@hospital.com',
            phone: '+1-555-1111',
            phoneNumber: '+1-555-1111',
            specialization: 'Critical Care',
            departmentId: 3,
            departmentName: 'Emergency',
            licenseNumber: 'RN-2024-001',
            experience: '8 years',
            status: 'active',
            avatar: '',
            avatarUrl: '',
            gender: false,
            dob: '1990-05-15',
            shift: 'Day Shift (7AM-7PM)',
            schedule: 'Day Shift (7AM-7PM)',
            certifications: 'BLS, ACLS, PALS',
            education: 'BLS, ACLS, PALS',
            rating: 4.8,
            totalPatients: 850,
            consultationFee: 0,
            createdAt: '2022-01-10T08:00:00Z',
            cccd: '123456789012',
            province: 'Ho Chi Minh City',
            ward: 'District 1',
            streetAddress: '123 Nguyen Hue Street'
        },
        {
            id: 102,
            type: 'nurse',
            name: 'Nurse Michael Brown',
            fullname: 'Nurse Michael Brown',
            email: 'michael.brown@hospital.com',
            phone: '+1-555-2222',
            phoneNumber: '+1-555-2222',
            specialization: 'Intensive Care',
            departmentId: 1,
            departmentName: 'Cardiology',
            licenseNumber: 'RN-2024-002',
            experience: '12 years',
            status: 'active',
            avatar: '',
            avatarUrl: '',
            gender: true,
            dob: '1985-11-22',
            shift: 'Night Shift (7PM-7AM)',
            schedule: 'Night Shift (7PM-7AM)',
            certifications: 'BLS, ACLS, CCRN',
            education: 'BLS, ACLS, CCRN',
            rating: 4.9,
            totalPatients: 1200,
            consultationFee: 0,
            createdAt: '2020-08-15T09:00:00Z',
            cccd: '987654321098',
            province: 'Ho Chi Minh City',
            ward: 'District 3',
            streetAddress: '456 Le Loi Street'
        },
        {
            id: 103,
            type: 'nurse',
            name: 'Nurse Emily Davis',
            fullname: 'Nurse Emily Davis',
            email: 'emily.davis@hospital.com',
            phone: '+1-555-3333',
            phoneNumber: '+1-555-3333',
            specialization: 'Pediatrics',
            departmentId: 4,
            departmentName: 'Pediatrics',
            licenseNumber: 'RN-2024-003',
            experience: '6 years',
            status: 'active',
            avatar: '',
            avatarUrl: '',
            gender: false,
            dob: '1992-03-08',
            shift: 'Day Shift (7AM-7PM)',
            schedule: 'Day Shift (7AM-7PM)',
            certifications: 'BLS, PALS, NRP',
            education: 'BLS, PALS, NRP',
            rating: 4.7,
            totalPatients: 650,
            consultationFee: 0,
            createdAt: '2023-02-20T10:00:00Z',
            cccd: '456789123456',
            province: 'Ho Chi Minh City',
            ward: 'District 2',
            streetAddress: '789 Dong Khoi Street'
        }
    ];


    const fetchStaff = async () => {
        setLoading(true);
        try {
            console.log('🔄 Fetching staff data...');

            const doctorResponse = await getAllDoctors();
            console.log('📥 Doctor API Response:', doctorResponse);

            let doctors = [];

            if (doctorResponse && doctorResponse.success && doctorResponse.result) {
                console.log('📦 Response has result array, length:', doctorResponse.result.length);

                doctors = doctorResponse.result.map((doctor, index) => {
                    console.log(`👨‍⚕️ Doctor ${index + 1}:`, doctor);

                    const user = doctor.user || {};

                    // ✅ Create consistent data structure for both view and edit
                    return {
                        // Basic info
                        id: doctor.id || user.id || `doctor-${index}`,
                        type: 'doctor',

                        // User info (flat structure for easy access)
                        name: user.fullname || user.userName || doctor.description || 'Unknown Doctor',
                        fullname: user.fullname || user.userName || doctor.description || 'Unknown Doctor',
                        email: user.email || `doctor${index + 1}@hospital.com`,
                        phone: user.phoneNumber || 'N/A',
                        phoneNumber: user.phoneNumber || 'N/A',
                        userName: user.userName || '',
                        avatarUrl: user.avatarUrl || '',
                        avatar: user.avatarUrl || '',
                        gender: user.gender,
                        dob: user.dob,
                        cccd: user.cccd || '',
                        province: user.province ,
                        ward: user.ward ,
                        streetAddress: user.streetAddress || '',
                        job: user.job || 'Doctor',

                        // Professional info
                        description: doctor.description || 'No description',
                        practicingFrom: doctor.practicingFrom || new Date().toISOString(),

                        // Default values for display
                        specialization: 'General Medicine',
                        departmentId: 1,
                        departmentName: getDepartmentName(1),
                        licenseNumber: `MD${doctor.id || index}`,
                        experience: '5 years',
                        education: 'Medical Degree',
                        status: 'active',
                        consultationFee: 200000,
                        totalPatients: Math.floor(Math.random() * 1000),
                        rating: (4 + Math.random()).toFixed(1),
                        createdAt: doctor.practicingFrom || new Date().toISOString(),
                        schedule: 'Mon-Fri: 8:00-17:00',

                        // ✅ Keep original API data for editing
                        originalData: {
                            doctor: doctor,
                            user: user,
                            hospitalAffiliations: doctor.hospitalAffiliations || [],
                            specializations: doctor.specializations || []
                        }
                    };
                });
            } else if (Array.isArray(doctorResponse)) {
                console.log('📋 Response is direct array, length:', doctorResponse.length);
                doctors = doctorResponse.map((doctor, index) => {
                    const user = doctor.user || {};
                    return {
                        id: doctor.id || user.id || `doctor-${index}`,
                        type: 'doctor',
                        name: user.fullname || user.userName || doctor.description || 'Unknown Doctor',
                        fullname: user.fullname || user.userName || doctor.description || 'Unknown Doctor',
                        email: user.email || `doctor${index + 1}@hospital.com`,
                        phone: user.phoneNumber || 'N/A',
                        phoneNumber: user.phoneNumber || 'N/A',
                        userName: user.userName || '',
                        avatarUrl: user.avatarUrl || '',
                        avatar: user.avatarUrl || '',
                        gender: user.gender,
                        dob: user.dob,
                        cccd: user.cccd || '',
                        province: user.province,
                        ward: user.ward ,
                        streetAddress: user.streetAddress || '',
                        job: user.job || 'Doctor',
                        description: doctor.description || 'No description',
                        practicingFrom: doctor.practicingFrom || new Date().toISOString(),
                        specialization: 'General Medicine',
                        departmentId: 1,
                        departmentName: getDepartmentName(1),
                        licenseNumber: `MD${doctor.id || index}`,
                        experience: '5 years',
                        education: 'Medical Degree',
                        status: 'active',
                        consultationFee: 200000,
                        totalPatients: Math.floor(Math.random() * 1000),
                        rating: (4 + Math.random()).toFixed(1),
                        createdAt: doctor.practicingFrom || new Date().toISOString(),
                        schedule: 'Mon-Fri: 8:00-17:00',
                        originalData: {
                            doctor: doctor,
                            user: user,
                            hospitalAffiliations: doctor.hospitalAffiliations || [],
                            specializations: doctor.specializations || []
                        }
                    };
                });
            } else {
                console.warn('⚠️ Unexpected API response format:', doctorResponse);
            }

            console.log('✅ Transformed doctors:', doctors);


            let filteredDoctors = [...doctors];

            if (searchText) {
                filteredDoctors = filteredDoctors.filter(doctor =>
                    doctor.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    doctor.email.toLowerCase().includes(searchText.toLowerCase()) ||
                    doctor.phoneNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                    doctor.userName.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            if (departmentFilter !== 'all') {
                filteredDoctors = filteredDoctors.filter(doctor => doctor.departmentId === parseInt(departmentFilter));
            }

            if (statusFilter !== 'all') {
                filteredDoctors = filteredDoctors.filter(doctor => doctor.status === statusFilter);
            }

            if (specializationFilter !== 'all') {
                filteredDoctors = filteredDoctors.filter(doctor => doctor.specialization === specializationFilter);
            }

            console.log('✅ Filtered doctors:', filteredDoctors);





            if (searchText) {
                filteredDoctors = filteredDoctors.filter(doctor =>
                    doctor.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    doctor.email.toLowerCase().includes(searchText.toLowerCase()) ||
                    doctor.phoneNumber.toLowerCase().includes(searchText.toLowerCase()) ||
                    doctor.userName.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            if (departmentFilter !== 'all') {
                filteredDoctors = filteredDoctors.filter(doctor => doctor.departmentId === parseInt(departmentFilter));
            }

            if (statusFilter !== 'all') {
                filteredDoctors = filteredDoctors.filter(doctor => doctor.status === statusFilter);
            }

            if (specializationFilter !== 'all') {
                filteredDoctors = filteredDoctors.filter(doctor => doctor.specialization === specializationFilter);
            }
            console.log('✅ Filtered doctors:', filteredDoctors);


            let nurses = sampleNurses.map(nurse => ({
                ...nurse,
                originalData: {
                    nurse: nurse,
                    user: {
                        id: nurse.id,
                        fullname: nurse.fullname,
                        phoneNumber: nurse.phoneNumber,
                        email: nurse.email,
                        avatarUrl: nurse.avatarUrl,
                        dob: nurse.dob,
                        gender: nurse.gender,
                        job: nurse.job || 'Nurse',
                        cccd: nurse.cccd,
                        province: nurse.province,
                        ward: nurse.ward,
                        streetAddress: nurse.streetAddress
                    },
                    hospitalAffiliations: [],
                    specializations: []
                }
            }));

            if (searchText) {
                nurses = nurses.filter(nurse =>
                    nurse.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    nurse.email.toLowerCase().includes(searchText.toLowerCase())
                );
            }

            if (departmentFilter !== 'all') {
                nurses = nurses.filter(nurse => nurse.departmentId === parseInt(departmentFilter));
            }

            if (statusFilter !== 'all') {
                nurses = nurses.filter(nurse => nurse.status === statusFilter);
            }

            if (specializationFilter !== 'all') {
                nurses = nurses.filter(nurse => nurse.specialization === specializationFilter);
            }

            let allStaff = [];

            switch (activeTab) {
                case 'doctors':
                    allStaff = filteredDoctors;
                    break;
                case 'nurses':
                    allStaff = nurses;
                    break;
                default:
                    allStaff = [...filteredDoctors, ...nurses];
                    break;
            }

            console.log('✅ Final staff list:', allStaff);

            setStaff(allStaff);
            setPagination(prev => ({
                ...prev,
                total: allStaff.length
            }));


            const activeDoctors = doctors.filter(d => d.status === 'active').length;
            const inactiveDoctors = doctors.filter(d => d.status === 'inactive').length;
            const activeNurses = nurses.filter(n => n.status === 'active').length;
            const inactiveNurses = nurses.filter(n => n.status === 'inactive').length;

            setStats({
                totalDoctors: doctors.length,
                totalNurses: nurses.length,
                activeDoctors,
                activeNurses,
                inactiveDoctors,
                inactiveNurses,
                departments: departments.length
            });

            console.log('📊 Updated stats:', {
                totalDoctors: doctors.length,
                totalNurses: sampleNurses.length,
                activeDoctors,
                activeNurses,
                inactiveDoctors,
                inactiveNurses
            });

        } catch (error) {
            console.error('❌ Error fetching staff:', error);
            dispatch(setMessage({
                type: 'error',
                content: 'Failed to fetch staff data. Please try again.',
                duration: 4
            }));
            setStaff([]);
        } finally {
            setLoading(false);
        }
    };


    const getDepartmentName = (departmentId) => {
        const dept = departments.find(d => d.id === departmentId);
        return dept ? dept.name : 'Unknown Department';
    };


    const handleView = (staffMember) => {
        console.log('👁️ Viewing staff:', staffMember);
        // Chỉ cần pass staff với id, component ViewStaff sẽ tự fetch detail
        setSelectedStaff({ id: staffMember.id }); // ✅ Sử dụng setSelectedStaff thay vì setSelectedDoctor
        setViewModalVisible(true);
    };

    const handleEdit = (staffMember) => {
        console.log('✏️ Editing staff:', staffMember);
        setSelectedStaff(staffMember);
        setEditModalVisible(true);
    };

    const handleDelete = (staffMember) => {
        console.log('🗑️ Delete action triggered for:', staffMember);
        setSelectedStaff(staffMember);
        setDeleteModalVisible(true);
    };


    const handleDeleteSuccess = async () => {
        console.log('✅ Delete operation completed successfully');
        setDeleteModalVisible(false);
        setSelectedStaff(null);


        try {
            await fetchStaff();
            console.log('🔄 Staff data refreshed after deletion');
        } catch (error) {
            console.error('❌ Error refreshing data after deletion:', error);
        }
    };

    const handleDeleteCancel = () => {
        console.log('❌ Delete operation cancelled');
        setDeleteModalVisible(false);
        setSelectedStaff(null);
    };

    const handleStatusToggle = (staffMember) => {
        const newStatus = staffMember.status === 'active' ? 'inactive' : 'active';

        Modal.confirm({
            title: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} ${staffMember.type === 'doctor' ? 'Doctor' : 'Nurse'}`,
            content: `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${staffMember.name}?`,
            okText: 'Yes',
            onOk: async () => {
                try {
                    if (staffMember.type === 'doctor') {
                        const response = await updateDoctorStatus(staffMember.id, newStatus);
                        if (response.success) {
                            dispatch(setMessage({
                                type: 'success',
                                content: `${staffMember.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
                                duration: 4
                            }));
                            fetchStaff();
                        }
                    } else {

                        dispatch(setMessage({
                            type: 'success',
                            content: `${staffMember.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}. (Mock)`,
                            duration: 4
                        }));
                        fetchStaff();
                    }
                } catch (error) {
                    dispatch(setMessage({
                        type: 'error',
                        content: `Failed to update ${staffMember.type} status. Please try again.`,
                        duration: 4
                    }));
                }
            }
        });
    };


    const columns = [
        {
            title: 'Staff Member',
            key: 'staff',
            width: 280,
            render: (_, staffMember) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                        src={staffMember.avatarUrl || staffMember.avatar}
                        icon={<UserOutlined />}
                        style={{
                            marginRight: 12,
                            backgroundColor: staffMember.type === 'doctor' ? '#1890ff' : '#52c41a'
                        }}
                    />
                    <div>
                        <div style={{
                            fontWeight: 500,
                            color: staffMember.type === 'doctor' ? '#1890ff' : '#52c41a'
                        }}>
                            {staffMember.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                            <Tag
                                size="small"
                                color={staffMember.type === 'doctor' ? 'blue' : 'green'}
                                icon={staffMember.type === 'doctor' ? <MedicineBoxOutlined /> : <HeartOutlined />}
                            >
                                {staffMember.type === 'doctor' ? 'Doctor' : 'Nurse'}
                            </Tag>
                            {staffMember.licenseNumber}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Contact',
            key: 'contact',
            width: 200,
            render: (_, staffMember) => (
                <div>
                    <div style={{ fontSize: '13px' }}>📧 {staffMember.email}</div>
                    <div style={{ fontSize: '13px' }}>📞 {staffMember.phone || staffMember.phoneNumber}</div>
                </div>
            ),
        },
        {
            title: 'Department',
            dataIndex: 'departmentName',
            key: 'department',
            width: 150,
            render: (department, staffMember) => (
                <Tag
                    color={staffMember.type === 'doctor' ? 'blue' : 'green'}
                    icon={<MedicineBoxOutlined />}
                >
                    {department}
                </Tag>
            ),
        },
        {
            title: 'Specialization',
            dataIndex: 'specialization',
            key: 'specialization',
            width: 150,
            render: (specialization) => (
                <Tag color="purple">{specialization}</Tag>
            ),
        },
        {
            title: 'Experience & Rating',
            key: 'experience',
            width: 160,
            render: (_, staffMember) => (
                <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>
                        {staffMember.experience}
                    </div>
                    <Rate disabled value={staffMember.rating || 4.5} style={{ fontSize: '12px' }} />
                </div>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            width: 100,
            render: (_, staffMember) => (
                <Tag
                    color={staffMember.status === 'active' ? 'success' : 'error'}
                    icon={staffMember.status === 'active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStatusToggle(staffMember)}
                >
                    {staffMember.status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, staffMember) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(staffMember)}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(staffMember)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(staffMember)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];


    useEffect(() => {
        fetchStaff();
    }, [activeTab, pagination.current, pagination.pageSize, searchText, departmentFilter, statusFilter, specializationFilter]);


    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
    };


    const handleSearch = (value) => {
        setSearchText(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };


    const handleFilterChange = (filterType, value) => {
        switch (filterType) {
            case 'department':
                setDepartmentFilter(value);
                break;
            case 'status':
                setStatusFilter(value);
                break;
            case 'specialization':
                setSpecializationFilter(value);
                break;
        }
        setPagination(prev => ({ ...prev, current: 1 }));
    };


    const handleAddStaff = (type) => {
        setStaffType(type);
        setAddModalVisible(true);
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>

            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                    <TeamOutlined style={{ marginRight: 12 }} />
                    Staff Management
                </Title>
                <p style={{ color: '#8c8c8c', marginTop: 8 }}>
                    Manage hospital doctors and nurses, their information, and assignments
                </p>
            </div>


            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Doctors"
                            value={stats.totalDoctors}
                            prefix={<MedicineBoxOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Nurses"
                            value={stats.totalNurses}
                            prefix={<HeartOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic
                            title="Active Staff"
                            value={stats.activeDoctors + stats.activeNurses}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card>
                        <Statistic
                            title="Departments"
                            value={stats.departments}
                            prefix={<MedicineBoxOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>


            <Card>

                <div style={{
                    marginBottom: 24,
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16
                }}>
                    <Space size="middle" wrap>
                        <Search
                            placeholder="Search staff..."
                            allowClear
                            style={{ width: 300 }}
                            onSearch={handleSearch}
                            onChange={(e) => !e.target.value && setSearchText('')}
                        />

                        <Select
                            placeholder="Department"
                            style={{ width: 150 }}
                            value={departmentFilter}
                            onChange={(value) => handleFilterChange('department', value)}
                        >
                            <Option value="all">All Departments</Option>
                            {departments.map(dept => (
                                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
                            ))}
                        </Select>

                        <Select
                            placeholder="Specialization"
                            style={{ width: 150 }}
                            value={specializationFilter}
                            onChange={(value) => handleFilterChange('specialization', value)}
                        >
                            <Option value="all">All Specializations</Option>
                            {specializations.map(spec => (
                                <Option key={spec} value={spec}>{spec}</Option>
                            ))}
                        </Select>

                        <Select
                            placeholder="Status"
                            style={{ width: 120 }}
                            value={statusFilter}
                            onChange={(value) => handleFilterChange('status', value)}
                        >
                            <Option value="all">All Status</Option>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Space>

                    <Space>
                        <Button
                            type="primary"
                            icon={<UserAddOutlined />}
                            onClick={() => handleAddStaff('doctor')}
                        >
                            Add Doctor
                        </Button>
                        <Button
                            type="primary"
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            icon={<UserAddOutlined />}
                            onClick={() => handleAddStaff('nurse')}
                        >
                            Add Nurse
                        </Button>
                    </Space>
                </div>


                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    style={{ marginBottom: 16 }}
                >
                    <TabPane
                        tab={
                            <span>
                                <TeamOutlined />
                                All Staff ({stats.totalDoctors + stats.totalNurses})
                            </span>
                        }
                        key="all"
                    />
                    <TabPane
                        tab={
                            <span>
                                <MedicineBoxOutlined />
                                Doctors ({stats.totalDoctors})
                            </span>
                        }
                        key="doctors"
                    />
                    <TabPane
                        tab={
                            <span>
                                <HeartOutlined />
                                Nurses ({stats.totalNurses})
                            </span>
                        }
                        key="nurses"
                    />
                </Tabs>


                <Table
                    columns={columns}
                    dataSource={staff}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} staff members`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: 1300 }}
                />
            </Card>


            <AddStaff
                visible={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                onSuccess={() => {
                    setAddModalVisible(false);
                    fetchStaff();
                }}
                staffType={staffType}
                departments={departments}
                specializations={specializations}
            />

            <EditStaff
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onSuccess={() => {
                    setEditModalVisible(false);
                    fetchStaff();
                }}
                staff={selectedStaff}
                departments={departments}
                specializations={specializations}
            />

            {viewModalVisible && selectedStaff && (
                <ViewStaff
                    visible={viewModalVisible}
                    onCancel={() => {
                        setViewModalVisible(false);
                        setSelectedStaff(null); // ✅ Sử dụng setSelectedStaff thay vì setSelectedDoctor
                    }}
                    staff={selectedStaff} // ✅ Sử dụng selectedStaff thay vì selectedDoctor
                />
            )}

            <DeleteStaff
                visible={deleteModalVisible}
                onCancel={handleDeleteCancel}
                onSuccess={handleDeleteSuccess}
                staff={selectedStaff}
            />
        </div>
    );
};

export default StaffManagementPage;