import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Spin, Row, Col, DatePicker, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage, clearMessage } from '../../../redux/slices/messageSlice';
import { createUser } from '../../../services/userService';
import { getProvinces, getWards } from '../../../services/provinceService';
import { getAllHospitals } from '../../../services/hospitalService';
import { getDepartmentsByHospitalId } from '../../../services/departmentService';
import dayjs from 'dayjs';

const { Option } = Select;

const AddUser = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [loadingHospitals, setLoadingHospitals] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    const dispatch = useDispatch();
    const messageState = useSelector(state => state.message);
    const [messageApi, contextHolder] = message.useMessage();

    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedHospitalId, setSelectedHospitalId] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);

    const [selectedRole, setSelectedRole] = useState(null);
    const [isPatientRole, setIsPatientRole] = useState(false);

    const roles = [
        { id: 1, name: 'Người dùng', roleType: 1 },
        { id: 4, name: 'Quản trị viên Bệnh viện', roleType: 4 },
        { id: 6, name: 'Bệnh nhân', roleType: 6 },
        { id: 7, name: 'Y tá', roleType: 7 }
    ];

    const handleRoleChange = (roleId) => {
        const role = roles.find(r => r.id === roleId);
        setSelectedRole(role);
        const isPatient = role?.roleType === 6;
        setIsPatientRole(isPatient);
        if (isPatient) {
            form.setFieldsValue({
                hospitalId: undefined,
                departmentId: undefined
            });
            setSelectedHospitalId(null);
            setDepartments([]);
        }
    };

    useEffect(() => {
        if (messageState && messageState.content) {
            messageApi.open({
                type: messageState.type,
                content: messageState.content,
            });
            dispatch(clearMessage());
        }
    }, [messageState, messageApi, dispatch]);

    useEffect(() => {
        if (visible) {
            dispatch(clearMessage());
            fetchProvinces();
            fetchHospitals();
            form.resetFields();
            setSelectedHospitalId(null);
            setDepartments([]);
            setSelectedProvince(null);
            setWards([]);
            setSelectedRole(null);
            setIsPatientRole(false);
        } else {
            dispatch(clearMessage());
        }
    }, [visible, dispatch, form]);

    const fetchProvinces = async () => {
        setLoadingProvinces(true);
        try {
            const provincesData = await getProvinces();
            let processedProvinces = [];
            if (Array.isArray(provincesData)) {
                processedProvinces = provincesData;
            } else if (provincesData?.data && Array.isArray(provincesData.data)) {
                processedProvinces = provincesData.data;
            } else if (provincesData?.results && Array.isArray(provincesData.results)) {
                processedProvinces = provincesData.results;
            }
            setProvinces(processedProvinces);
        } catch {
            setProvinces([]);
            dispatch(setMessage({
                type: 'error',
                content: 'Không thể tải danh sách tỉnh/thành phố'
            }));
        } finally {
            setLoadingProvinces(false);
        }
    };

    const fetchWards = async (provinceCode) => {
        if (!provinceCode) {
            setWards([]);
            return;
        }
        setLoadingWards(true);
        try {
            const wardsData = await getWards(provinceCode);
            setWards(Array.isArray(wardsData) ? wardsData : []);
        } catch {
            setWards([]);
            dispatch(setMessage({
                type: 'error',
                content: 'Không thể tải danh sách phường/xã'
            }));
        } finally {
            setLoadingWards(false);
        }
    };

    const fetchHospitals = async () => {
        setLoadingHospitals(true);
        try {
            const hospitalsData = await getAllHospitals();
            let processedHospitals = [];
            if (Array.isArray(hospitalsData)) {
                processedHospitals = hospitalsData;
            } else if (hospitalsData?.result && Array.isArray(hospitalsData.result)) {
                processedHospitals = hospitalsData.result;
            }
            setHospitals(processedHospitals);
        } catch {
            setHospitals([]);
            dispatch(setMessage({
                type: 'error',
                content: 'Không thể tải danh sách bệnh viện'
            }));
        } finally {
            setLoadingHospitals(false);
        }
    };

    const fetchDepartments = async (hospitalId) => {
        if (!hospitalId) {
            setDepartments([]);
            return;
        }
        setLoadingDepartments(true);
        try {
            const departmentsData = await getDepartmentsByHospitalId(hospitalId);
            let processedDepartments = [];
            if (Array.isArray(departmentsData)) {
                processedDepartments = departmentsData;
            } else if (departmentsData?.result && Array.isArray(departmentsData.result)) {
                processedDepartments = departmentsData.result;
            }
            setDepartments(processedDepartments);
        } catch {
            setDepartments([]);
            dispatch(setMessage({
                type: 'error',
                content: 'Không thể tải danh sách khoa'
            }));
        } finally {
            setLoadingDepartments(false);
        }
    };

    const handleHospitalChange = (hospitalId) => {
        setSelectedHospitalId(hospitalId);
        form.setFieldsValue({ departmentId: undefined });
        fetchDepartments(hospitalId);
    };

    const handleProvinceChange = (provinceId) => {
        setSelectedProvince(provinceId);
        form.setFieldsValue({ ward: undefined });
        setWards([]);
        fetchWards(provinceId);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        dispatch(clearMessage());
        try {
            const currentSelectedRole = roles.find(role => role.id === values.roleId);
            if (!currentSelectedRole) throw new Error('Vai trò được chọn không hợp lệ');
            const isCurrentPatient = currentSelectedRole?.roleType === 6;
            if (!isCurrentPatient && !values.hospitalId) throw new Error('Vui lòng chọn bệnh viện');

            const selectedProvinceObj = provinces.find(p => p.id === values.province || p.code === values.province);
            const selectedWardObj = wards.find(w => w.id === values.ward || w.code === values.ward);

            const userData = {
                roleType: currentSelectedRole?.roleType || 1,
                fullname: values.fullname.trim(),
                phoneNumber: values.phoneNumber?.trim() || "",
                email: values.email.trim(),
                password: values.password,
                avatarUrl: "",
                dob: values.dob ? values.dob.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                gender: values.gender === 'male',
                job: values.job?.trim() || "",
                cccd: values.cccd?.trim() || "",
                province: selectedProvinceObj?.name || selectedProvinceObj?.province || values.province || "",
                ward: selectedWardObj?.name || selectedWardObj?.ward || values.ward || "",
                streetAddress: values.streetAddress?.trim() || ""
            };
            if (!isCurrentPatient) {
                userData.hospitalId = values.hospitalId || 0;
                userData.departmentId = values.departmentId || 0;
            } else {
                userData.hospitalId = 0;
                userData.departmentId = 0;
            }

            const response = await createUser(userData);

            if (response?.success || response?.result || response?.id) {
                dispatch(setMessage({
                    type: 'success',
                    content: `🎉 Tạo ${isCurrentPatient ? 'bệnh nhân' : currentSelectedRole.name.toLowerCase()} "${userData.fullname}" thành công!`
                }));
                form.resetFields();
                setSelectedHospitalId(null);
                setDepartments([]);
                setSelectedProvince(null);
                setWards([]);
                setSelectedRole(null);
                setIsPatientRole(false);
                if (onSuccess && typeof onSuccess === 'function') {
                    onSuccess(response, { shouldReload: true });
                }
                setTimeout(() => {
                    handleCancel();
                }, 1500);
            } else {
                throw new Error('Phản hồi không hợp lệ từ server');
            }
        } catch (error) {
            let errorMessage = 'Không thể tạo người dùng. Vui lòng thử lại.';
            if (error.response?.data) {
                const errorData = error.response.data;
                if (errorData.title) {
                    switch (errorData.title) {
                        case 'PHONE_ALREADY_EXISTS':
                            errorMessage = '📱 Số điện thoại này đã được đăng ký!\nVui lòng sử dụng số điện thoại khác.'; break;
                        case 'EMAIL_ALREADY_EXISTS':
                            errorMessage = '📧 Email này đã được đăng ký!\nVui lòng sử dụng email khác.'; break;
                        case 'CCCD_ALREADY_EXISTS':
                            errorMessage = '🆔 Số CCCD này đã được đăng ký!\nVui lòng kiểm tra lại số CCCD.'; break;
                        case 'VALIDATION_ERROR':
                            errorMessage = '⚠️ Dữ liệu không hợp lệ!\nVui lòng kiểm tra lại thông tin đã nhập.'; break;
                        case 'UNAUTHORIZED':
                            errorMessage = '🔒 Không có quyền thực hiện thao tác này!\nVui lòng đăng nhập lại.'; break;
                        case 'SERVER_ERROR':
                            errorMessage = '🔥 Lỗi hệ thống!\nVui lòng thử lại sau ít phút.'; break;
                        default:
                            errorMessage = `❌ ${errorData.title.replace(/_/g, ' ')}\n${errorData.message || 'Vui lòng thử lại.'}`; break;
                    }
                } else if (errorData.message) {
                    errorMessage = `❌ ${errorData.message}`;
                }
                if (errorData.errors && typeof errorData.errors === 'object') {
                    const fieldErrors = Object.keys(errorData.errors).map(field =>
                        `• ${field}: ${errorData.errors[field]}`
                    ).join('\n');
                    errorMessage += `\n\nChi tiết lỗi:\n${fieldErrors}`;
                }
                if (errorData.status) {
                    errorMessage += `\n\nMã lỗi: ${errorData.status}`;
                }
            } else if (error.message) {
                errorMessage = `❌ ${error.message}`;
            }
            if (error.code === 'NETWORK_ERROR' || !error.response) {
                errorMessage = '🌐 Lỗi kết nối mạng!\nVui lòng kiểm tra kết nối internet và thử lại.';
            }
            dispatch(setMessage({
                type: 'error',
                content: errorMessage
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        dispatch(clearMessage());
        form.resetFields();
        setSelectedHospitalId(null);
        setDepartments([]);
        setSelectedProvince(null);
        setWards([]);
        setSelectedRole(null);
        setIsPatientRole(false);
        if (onCancel && typeof onCancel === 'function') {
            onCancel();
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <UserAddOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        Thêm Người dùng mới
                        {selectedRole && (
                            <span style={{
                                marginLeft: 12,
                                padding: '2px 8px',
                                background: isPatientRole ? '#fff7e6' : '#e6f7ff',
                                color: isPatientRole ? '#fa8c16' : '#1890ff',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'normal'
                            }}>
                                {selectedRole.name}
                            </span>
                        )}
                    </div>
                }
                open={visible}
                onCancel={handleCancel}
                footer={null}
                width={1000}
                destroyOnClose
                maskClosable={false}
            >
                <Spin spinning={loading} tip="Đang tạo người dùng...">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            gender: 'female',
                            dob: dayjs().subtract(25, 'years')
                        }}
                        scrollToFirstError
                    >
                        {isPatientRole && (
                            <div style={{
                                marginBottom: 24,
                                padding: '12px 16px',
                                background: '#fff7e6',
                                borderRadius: '6px',
                                border: '1px solid #ffd591',
                                fontSize: '13px'
                            }}>
                                <div style={{ color: '#fa8c16', fontWeight: 500, marginBottom: 4 }}>
                                    👤 Tạo tài khoản Bệnh nhân
                                </div>
                                <div style={{ color: '#666', lineHeight: '1.4' }}>
                                    Bệnh nhân không cần thông tin bệnh viện và khoa/phòng ban. Các trường này sẽ được ẩn và không gửi lên server.
                                </div>
                            </div>
                        )}

                        {/* Thông tin tài khoản */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ color: '#1890ff', marginBottom: 16 }}>🔐 Thông tin tài khoản</h4>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập email' },
                                            { type: 'email', message: 'Vui lòng nhập email hợp lệ' },
                                            { max: 100, message: 'Email không được vượt quá 100 ký tự' }
                                        ]}
                                        hasFeedback
                                    >
                                        <Input placeholder="Nhập địa chỉ email" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="roleId"
                                        label="Vai trò"
                                        rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                                        hasFeedback
                                    >
                                        <Select
                                            placeholder="Chọn vai trò người dùng"
                                            onChange={handleRoleChange}
                                        >
                                            {roles.map(role => (
                                                <Option key={role.id} value={role.id}>
                                                    {role.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="password"
                                        label="Mật khẩu"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.Password placeholder="Nhập mật khẩu" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="confirmPassword"
                                        label="Xác nhận mật khẩu"
                                        dependencies={['password']}
                                        rules={[
                                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                                },
                                            }),
                                        ]}
                                        hasFeedback
                                    >
                                        <Input.Password placeholder="Xác nhận mật khẩu" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        {/* Thông tin cơ quan */}
                        {!isPatientRole && (
                            <div style={{ marginBottom: 24 }}>
                                <h4 style={{ color: '#1890ff', marginBottom: 16 }}>🏥 Thông tin cơ quan</h4>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="hospitalId"
                                            label="Bệnh viện"
                                            rules={[{ required: true, message: 'Vui lòng chọn bệnh viện' }]}
                                            hasFeedback
                                        >
                                            <Select
                                                placeholder="Chọn bệnh viện"
                                                loading={loadingHospitals}
                                                onChange={handleHospitalChange}
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                {hospitals.map(hospital => (
                                                    <Option key={hospital.id} value={hospital.id}>
                                                        {hospital.name} - {hospital.address || 'Không có địa chỉ'}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="departmentId"
                                            label="Khoa/Phòng ban"
                                            rules={[{ required: true, message: 'Vui lòng chọn khoa' }]}
                                            hasFeedback
                                        >
                                            <Select
                                                placeholder={selectedHospitalId ? "Chọn khoa/phòng ban" : "Vui lòng chọn bệnh viện trước"}
                                                loading={loadingDepartments}
                                                disabled={!selectedHospitalId}
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                            >
                                                <Option value={0}>Chưa phân khoa</Option>
                                                {departments.map(department => (
                                                    <Option key={department.id} value={department.id}>
                                                        {department.name} {department.description && `- ${department.description}`}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {/* Thông tin cá nhân */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ color: '#1890ff', marginBottom: 16 }}>👤 Thông tin cá nhân</h4>
                            <Form.Item
                                name="fullname"
                                label="Họ và tên"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập họ và tên' },
                                    { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' },
                                    { max: 100, message: 'Họ và tên không được vượt quá 100 ký tự' }
                                ]}
                                hasFeedback
                            >
                                <Input placeholder="Nhập họ và tên đầy đủ" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        name="phoneNumber"
                                        label="Số điện thoại"
                                        rules={[
                                            {
                                                required: true,
                                                pattern: /^[0-9]{10,11}$/,
                                                message: 'Số điện thoại phải có 10-11 chữ số'
                                            }
                                        ]}
                                        hasFeedback
                                    >
                                        <Input placeholder="Nhập số điện thoại (10-11 chữ số)" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="gender"
                                        label="Giới tính"
                                        rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                                        hasFeedback
                                    >
                                        <Select placeholder="Chọn giới tính">
                                            <Option value="male">Nam </Option>
                                            <Option value="female">Nữ </Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="dob"
                                        label="Ngày sinh"
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn ngày sinh' },
                                            {
                                                validator: (_, value) => {
                                                    if (value && dayjs().diff(value, 'years') < 16) {
                                                        return Promise.reject(new Error('Tuổi phải từ 16 trở lên'));
                                                    }
                                                    return Promise.resolve();
                                                }
                                            }
                                        ]}
                                        hasFeedback
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            placeholder="Chọn ngày sinh"
                                            format="DD/MM/YYYY"
                                            disabledDate={(current) => current && current > dayjs().endOf('day')}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="job"
                                        label="Nghề nghiệp"
                                        rules={[
                                            { max: 50, message: 'Nghề nghiệp không được vượt quá 50 ký tự' }
                                        ]}
                                    >
                                        <Input placeholder="Nhập nghề nghiệp" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="cccd"
                                        label="Số CCCD/CMND"
                                        rules={[
                                            {
                                                required: true,
                                                pattern: /^[0-9]{9,12}$/,
                                                message: 'CCCD phải có 9-12 chữ số'
                                            }
                                        ]}
                                        hasFeedback
                                    >
                                        <Input placeholder="Nhập số CCCD/CMND (9-12 chữ số)" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        {/* Thông tin địa chỉ */}
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ color: '#1890ff', marginBottom: 16 }}>📍 Thông tin địa chỉ</h4>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="province"
                                        label="Tỉnh/Thành phố"
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn tỉnh/thành phố' },
                                        ]}
                                    >
                                        <Select
                                            placeholder={loadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"}
                                            loading={loadingProvinces}
                                            onChange={handleProvinceChange}
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            allowClear
                                            notFoundContent={
                                                loadingProvinces ?
                                                    "Đang tải..." :
                                                    provinces.length === 0 ?
                                                        "Không có dữ liệu tỉnh thành" :
                                                        "Không tìm thấy"
                                            }
                                        >
                                            {provinces.map((province, index) => (
                                                <Option
                                                    key={province.id || province.code || index}
                                                    value={province.id || province.code}
                                                >
                                                    {province.name || province.province}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="ward"
                                        label="Phường/Xã"
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn phường/xã' },
                                            
                                        ]}
                                    >
                                        <Select
                                            placeholder={
                                                selectedProvince ?
                                                    (loadingWards ? "Đang tải..." : "Chọn phường/xã") :
                                                    "Vui lòng chọn tỉnh/thành phố trước"
                                            }
                                            loading={loadingWards}
                                            onChange={() => { }}
                                            disabled={!selectedProvince}
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            allowClear
                                            notFoundContent={
                                                loadingWards ?
                                                    "Đang tải..." :
                                                    !selectedProvince ?
                                                        "Vui lòng chọn tỉnh/thành phố trước" :
                                                        wards.length === 0 ?
                                                            "Không có dữ liệu phường/xã" :
                                                            "Không tìm thấy"
                                            }
                                        >
                                            {wards.map((ward, index) => (
                                                <Option
                                                    key={ward.id || ward.code || index}
                                                    value={ward.id || ward.code}
                                                >
                                                    {ward.name || ward.ward}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="streetAddress"
                                        label="Địa chỉ cụ thể"
                                        rules={[
                                            { max: 200, message: 'Địa chỉ không được vượt quá 200 ký tự' }
                                        ]}
                                    >
                                        <Input placeholder="Nhập số nhà, tên đường..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </div>

                        <div style={{
                            marginBottom: 24,
                            padding: '12px 16px',
                            background: '#f6ffed',
                            borderRadius: '6px',
                            border: '1px solid #b7eb8f',
                            fontSize: '13px'
                        }}>
                            <div style={{ color: '#389e0d', fontWeight: 500, marginBottom: 4 }}>
                                💡 Lưu ý khi tạo người dùng:
                            </div>
                            <div style={{ color: '#666', lineHeight: '1.4' }}>
                                • <strong>Vai trò Bệnh nhân</strong> không cần thông tin bệnh viện và khoa/phòng ban<br />
                                • <strong>Các vai trò khác</strong> yêu cầu chọn bệnh viện và có thể chọn khoa/phòng ban<br />
                                • <strong>Email</strong> và <strong>Số điện thoại</strong> phải là duy nhất trong hệ thống<br />
                                • <strong>Lỗi sẽ được hiển thị chi tiết</strong> để hỗ trợ khắc phục nhanh chóng
                            </div>
                        </div>

                        <Row justify="end" gutter={8}>
                            <Col>
                                <Button onClick={handleCancel} disabled={loading}>
                                    Hủy
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<UserAddOutlined />}
                                >
                                    {loading ? 'Đang tạo...' : `Tạo ${isPatientRole ? 'Bệnh nhân' : 'Người dùng'}`}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
};

export default AddUser;