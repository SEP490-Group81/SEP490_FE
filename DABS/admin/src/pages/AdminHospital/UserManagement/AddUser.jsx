import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Spin, Row, Col, DatePicker } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../redux/slices/messageSlice';
import { createUser } from '../../../services/userService';
import { getProvinces } from '../../../services/provinceService';
import { getAllHospitals } from '../../../services/hospitalService';
import { getDepartmentsByHospitalId } from '../../../services/departmentService';
import dayjs from 'dayjs';

const { Option } = Select;

const AddUser = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingHospitals, setLoadingHospitals] = useState(false);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const dispatch = useDispatch();

    // ✅ State cho dropdown options
    const [provinces, setProvinces] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedHospitalId, setSelectedHospitalId] = useState(null);

    // ✅ Cập nhật danh sách vai trò theo roleType từ API
    const roles = [
        { id: 1, name: 'Người dùng', roleType: 1 },
        { id: 2, name: 'Bác sĩ', roleType: 2 },
        { id: 4, name: 'Quản trị viên Bệnh viện', roleType: 4 },
        { id: 5, name: 'Quản trị viên Hệ thống', roleType: 5 },
        { id: 6, name: 'Bệnh nhân', roleType: 6 },
        { id: 7, name: 'Y tá', roleType: 7 }
    ];

    // ✅ Fetch provinces khi modal mở
    useEffect(() => {
        if (visible) {
            fetchProvinces();
            fetchHospitals();
        }
    }, [visible]);

    const fetchProvinces = async () => {
        setLoadingProvinces(true);
        try {
            const provincesData = await getProvinces();
            console.log('🌏 Provinces data:', provincesData);
            
            if (Array.isArray(provincesData)) {
                setProvinces(provincesData);
            } else if (provincesData?.result && Array.isArray(provincesData.result)) {
                setProvinces(provincesData.result);
            } else {
                console.warn('Unexpected provinces data format:', provincesData);
                setProvinces([]);
            }
        } catch (error) {
            console.error('❌ Error fetching provinces:', error);
            dispatch(setMessage({
                type: 'error',
                content: 'Không thể tải danh sách tỉnh thành. Vui lòng thử lại.',
                duration: 3
            }));
            setProvinces([]);
        } finally {
            setLoadingProvinces(false);
        }
    };

    const fetchHospitals = async () => {
        setLoadingHospitals(true);
        try {
            const hospitalsData = await getAllHospitals();
            console.log('🏥 Hospitals data:', hospitalsData);
            
            if (Array.isArray(hospitalsData)) {
                setHospitals(hospitalsData);
            } else if (hospitalsData?.result && Array.isArray(hospitalsData.result)) {
                setHospitals(hospitalsData.result);
            } else {
                console.warn('Unexpected hospitals data format:', hospitalsData);
                setHospitals([]);
            }
        } catch (error) {
            console.error('❌ Error fetching hospitals:', error);
            dispatch(setMessage({
                type: 'error',
                content: 'Không thể tải danh sách bệnh viện. Vui lòng thử lại.',
                duration: 3
            }));
            setHospitals([]);
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
            console.log(`🏭 Departments data for hospital ${hospitalId}:`, departmentsData);
            
            if (Array.isArray(departmentsData)) {
                setDepartments(departmentsData);
            } else if (departmentsData?.result && Array.isArray(departmentsData.result)) {
                setDepartments(departmentsData.result);
            } else {
                console.warn('Unexpected departments data format:', departmentsData);
                setDepartments([]);
            }
        } catch (error) {
            console.error('❌ Error fetching departments:', error);
            dispatch(setMessage({
                type: 'error',
                content: 'Không thể tải danh sách khoa. Vui lòng thử lại.',
                duration: 3
            }));
            setDepartments([]);
        } finally {
            setLoadingDepartments(false);
        }
    };

    // ✅ Handle hospital selection change
    const handleHospitalChange = (hospitalId) => {
        console.log('🏥 Hospital selected:', hospitalId);
        setSelectedHospitalId(hospitalId);
        
        // Reset department khi chọn hospital mới
        form.setFieldsValue({ departmentId: undefined });
        
        // Fetch departments cho hospital được chọn
        fetchDepartments(hospitalId);
    };

    // ✅ Handle province change (có thể fetch wards nếu cần)
    const handleProvinceChange = (provinceValue) => {
        console.log('🌏 Province selected:', provinceValue);
        // Reset ward khi chọn province mới
        form.setFieldsValue({ ward: undefined });
        // Có thể fetch wards ở đây nếu cần
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        
        try {
            const selectedRole = roles.find(role => role.id === values.roleId);
            
            // ✅ Tạo payload theo đúng format API với hospitalId và departmentId từ user selection
            const userData = {
                hospitalId: values.hospitalId || 0, // ✅ Từ user selection
                departmentId: values.departmentId || 0, // ✅ Từ user selection
                roleType: selectedRole?.roleType || 1,
                fullname: values.fullname,
                phoneNumber: values.phoneNumber || "",
                email: values.email,
                password: values.password,
                avatarUrl: "",
                dob: values.dob ? values.dob.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
                gender: values.gender === 'male',
                job: values.job || "",
                cccd: values.cccd || "",
                province: values.province || "",
                ward: values.ward || "",
                streetAddress: values.streetAddress || ""
            };

            console.log('📤 Payload gửi đến API:', userData);
            console.log('🏥 Selected Hospital ID:', values.hospitalId);
            console.log('🏭 Selected Department ID:', values.departmentId);
            console.log('👤 Role Type được chọn:', selectedRole?.roleType);

            const response = await createUser(userData);
            
            console.log('📥 Phản hồi từ API:', response);
            
            if (response?.success || response?.result || response?.id) {
                dispatch(setMessage({
                    type: 'success',
                    content: 'Tạo người dùng thành công! 🎉',
                    duration: 4
                }));
                
                form.resetFields();
                setSelectedHospitalId(null);
                setDepartments([]);
                onSuccess();
            } else {
                throw new Error('Phản hồi không hợp lệ từ server');
            }
        } catch (error) {
            console.error('❌ Lỗi khi tạo người dùng:', error);
            
            let errorMessage = 'Không thể tạo người dùng. Vui lòng thử lại.';
            
            if (error.response?.data) {
                const errorData = error.response.data;
                
                if (errorData.title) {
                    switch (errorData.title) {
                        case 'PHONE_ALREADY_EXISTS':
                            errorMessage = 'Số điện thoại này đã được đăng ký. Vui lòng sử dụng số điện thoại khác.';
                            break;
                        case 'EMAIL_ALREADY_EXISTS':
                            errorMessage = 'Email này đã được đăng ký. Vui lòng sử dụng email khác.';
                            break;
                        case 'CCCD_ALREADY_EXISTS':
                            errorMessage = 'Số CCCD này đã được đăng ký. Vui lòng kiểm tra lại số CCCD.';
                            break;
                        default:
                            errorMessage = errorData.title.replace(/_/g, ' ').toLowerCase();
                            break;
                    }
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }
            }
            
            dispatch(setMessage({
                type: 'error',
                content: `❌ ${errorMessage}`,
                duration: 6
            }));
            
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedHospitalId(null);
        setDepartments([]);
        onCancel();
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserAddOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    Thêm Người dùng mới
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={1000}
            destroyOnClose
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
                >
                    {/* ✅ Thông tin tài khoản */}
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
                                    <Select placeholder="Chọn vai trò người dùng">
                                        {roles.map(role => (
                                            <Option key={role.id} value={role.id}>
                                                {role.name} (Type: {role.roleType})
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

                    {/* ✅ Thông tin cơ quan */}
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
                                    rules={[{ required: false, message: 'Vui lòng chọn khoa' }]}
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

                    {/* ✅ Thông tin cá nhân */}
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
                                        <Option value="male">Nam (true)</Option>
                                        <Option value="female">Nữ (false)</Option>
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

                    {/* ✅ Thông tin địa chỉ */}
                    <div style={{ marginBottom: 24 }}>
                        <h4 style={{ color: '#1890ff', marginBottom: 16 }}>📍 Thông tin địa chỉ</h4>
                        
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item 
                                    name="province" 
                                    label="Tỉnh/Thành phố"
                                    rules={[
                                        { max: 50, message: 'Tỉnh/Thành phố không được vượt quá 50 ký tự' }
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn tỉnh/thành phố"
                                        loading={loadingProvinces}
                                        onChange={handleProvinceChange}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        allowClear
                                    >
                                        {provinces.map(province => (
                                            <Option key={province.id || province.code} value={province.name || province.full_name}>
                                                {province.name || province.full_name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item 
                                    name="ward" 
                                    label="Phường/Xã"
                                    rules={[
                                        { max: 50, message: 'Phường/Xã không được vượt quá 50 ký tự' }
                                    ]}
                                >
                                    <Input placeholder="Nhập phường/xã" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item 
                                    name="streetAddress" 
                                    label="Địa chỉ cụ thể"
                                    rules={[
                                        { max: 200, message: 'Địa chỉ không được vượt quá 200 ký tự' }
                                    ]}
                                >
                                    <Input placeholder="Nhập địa chỉ cụ thể" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    {/* ✅ Thông tin API */}
                    <div style={{
                        marginBottom: 24,
                        padding: '12px 16px',
                        background: '#e6f7ff',
                        borderRadius: '6px',
                        border: '1px solid #91d5ff',
                        fontSize: '12px'
                    }}>
                        <div style={{ color: '#1890ff', fontWeight: 500, marginBottom: 4 }}>
                            📡 Payload sẽ được gửi:
                        </div>
                        <div style={{ color: '#666', lineHeight: '1.4' }}>
                            • <strong>Hospital ID:</strong> Từ dropdown bệnh viện<br/>
                            • <strong>Department ID:</strong> Từ dropdown khoa (0 nếu chưa chọn)<br/>
                            • <strong>Province:</strong> Từ provinceService<br/>
                            • <strong>Role Type:</strong> Được map từ role selection<br/>
                            • <strong>Gender:</strong> Nam = true, Nữ = false
                        </div>
                    </div>

                    {/* ✅ Ghi chú */}
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
                            • <strong>Bệnh viện</strong> là bắt buộc và sẽ load danh sách khoa tương ứng<br/>
                            • <strong>Khoa/Phòng ban</strong> không bắt buộc, có thể để "Chưa phân khoa"<br/>
                            • <strong>Tỉnh/Thành phố</strong> sử dụng dữ liệu từ provinceService<br/>
                            • <strong>Email</strong> và <strong>Số điện thoại</strong> phải là duy nhất<br/>
                            • <strong>Ngày sinh</strong> là bắt buộc và phải từ 16 tuổi trở lên
                        </div>
                    </div>

                    {/* ✅ Nút hành động */}
                    <Row justify="end" gutter={8}>
                        <Col>
                            <Button onClick={handleCancel} disabled={loading}>
                                Hủy
                            </Button>
                        </Col>
                        <Col>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {loading ? 'Đang tạo...' : 'Tạo người dùng'}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    );
};

export default AddUser;