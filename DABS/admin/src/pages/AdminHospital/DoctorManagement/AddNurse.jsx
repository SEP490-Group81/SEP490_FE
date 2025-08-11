import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    Row,
    Col,
    Button,
    Spin,
    DatePicker,
    Upload,
    Alert,
    Steps,
    message
} from 'antd';
import {
    UserAddOutlined,
    SaveOutlined,
    UserOutlined,
    MedicineBoxOutlined,
    CheckCircleOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessage, setMessage } from '../../../redux/slices/messageSlice';
import { createUser } from '../../../services/userService'; // ✅ Sử dụng service createUser
import { getDepartmentsByHospitalId } from '../../../services/departmentService';
import { getProvinces } from '../../../services/provinceService';
import dayjs from 'dayjs';

const { Option } = Select;
const { Step } = Steps;

const AddNurse = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [departments, setDepartments] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [loadingProvinces, setLoadingProvinces] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const messageState = useSelector((state) => state.message);
    const [messageApi, contextHolder] = message.useMessage();

    // ✅ Lấy hospital ID từ user state
    const hospitalId = user?.hospitals?.[0]?.id;

    // Theo dõi thay đổi message state
    useEffect(() => {
        if (messageState && messageState.content) {
            if (messageState.type === 'success') {
                messageApi.success({
                    content: messageState.content,
                    duration: messageState.duration || 4,
                });
            } else if (messageState.type === 'error') {
                messageApi.error({
                    content: messageState.content,
                    duration: messageState.duration || 8,
                });
            }

            setTimeout(() => {
                dispatch(clearMessage());
            }, 100);
        }
    }, [messageState, messageApi, dispatch]);

    // Lấy dữ liệu khi modal mở
    useEffect(() => {
        if (visible && hospitalId) {
            fetchInitialData();
        }
    }, [visible, hospitalId]);

    // Cập nhật phường/xã khi tỉnh thay đổi
    useEffect(() => {
        if (selectedProvince && provinces.length > 0) {
            const provinceObj = provinces.find((p) => p.province === selectedProvince);
            const wardsList = provinceObj?.wards || [];
            setWards(wardsList);
        } else {
            setWards([]);
        }
    }, [selectedProvince, provinces]);

    const fetchInitialData = async () => {
        try {
            setLoadingDepartments(true);
            setLoadingProvinces(true);

            console.log('🔄 Đang tải dữ liệu ban đầu cho bệnh viện ID:', hospitalId);

            // Tải departments và provinces song song
            const [departmentsData, provincesData] = await Promise.all([
                getDepartmentsByHospitalId(hospitalId),
                getProvinces()
            ]);

            console.log('🏢 Đã tải khoa:', departmentsData);
            console.log('🌏 Đã tải tỉnh thành:', provincesData);

            setDepartments(departmentsData || []);
            setProvinces(provincesData.data || []);

            // ✅ Đặt giá trị mặc định cho điều dưỡng
            form.setFieldsValue({
                job: 'Điều dưỡng', // ✅ Chức danh mặc định
                // ✅ roleType được hard-code là 7 (vai trò điều dưỡng)
            });

        } catch (error) {
            console.error('❌ Lỗi khi tải dữ liệu ban đầu:', error);
            dispatch(setMessage({
                type: 'error',
                content: 'Không thể tải dữ liệu ban đầu. Vui lòng thử lại.'
            }));
        } finally {
            setLoadingDepartments(false);
            setLoadingProvinces(false);
        }
    };

    const handleFormValuesChange = (changedValues) => {
        if ("province" in changedValues) {
            const newProvince = changedValues.province || null;
            setSelectedProvince(newProvince);
            form.setFieldsValue({ ward: undefined });
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            console.log('🔄 Bắt đầu tạo tài khoản điều dưỡng...');

            const currentStepValues = form.getFieldsValue();
            const allValues = { ...formData, ...currentStepValues };

            console.log('📝 Giá trị form:', allValues);

            // ✅ Kiểm tra trường bắt buộc
            const requiredFields = [
                'fullname', 'phoneNumber', 'email', 'password', 
                'dob', 'gender', 'job', 'cccd', 
                'province', 'ward', 'streetAddress', 'departmentId'
            ];

            const missingFields = requiredFields.filter(field => !allValues[field]);

            if (missingFields.length > 0) {
                const errorMsg = `Thiếu trường bắt buộc: ${missingFields.join(', ')}`;
                messageApi.error({
                    content: errorMsg,
                    duration: 6,
                });
                throw new Error(errorMsg);
            }

            // ✅ Chuẩn bị payload điều dưỡng sử dụng format createUser
            const nursePayload = {
                hospitalId: parseInt(hospitalId), // ✅ Từ user state
                departmentId: parseInt(allValues.departmentId), // ✅ Từ lựa chọn form
                roleType: 7, // ✅ Hard-code cho vai trò điều dưỡng
                fullname: allValues.fullname?.trim() || "",
                phoneNumber: allValues.phoneNumber?.trim() || "",
                email: allValues.email?.trim() || "",
                password: allValues.password?.trim() || "",
                avatarUrl: allValues.avatarUrl?.trim() || "",
                dob: allValues.dob ? (typeof allValues.dob === 'string' ? allValues.dob : allValues.dob.format('YYYY-MM-DD')) : null,
                gender: allValues.gender === 'male', // ✅ Chuyển thành boolean
                job: allValues.job?.trim() || "Điều dưỡng",
                cccd: allValues.cccd?.trim() || "",
                province: allValues.province?.trim() || "",
                ward: allValues.ward?.trim() || "",
                streetAddress: allValues.streetAddress?.trim() || ""
            };

            console.log('🏥 Payload điều dưỡng cuối cùng:', JSON.stringify(nursePayload, null, 2));

            // ✅ Hiển thị thông báo đang tải
            messageApi.loading({
                content: 'Đang tạo tài khoản điều dưỡng...',
                duration: 0,
                key: 'creating'
            });

            // ✅ Gọi API createUser
            const response = await createUser(nursePayload);
            console.log('📥 Phản hồi createUser:', response);

            // ✅ Đóng thông báo đang tải
            messageApi.destroy('creating');

            // ✅ Kiểm tra thành công
            const isSuccess = (
                response === true ||
                response?.success === true ||
                response?.success !== false ||
                (response?.status >= 200 && response?.status < 300) ||
                response?.message?.toLowerCase().includes('success') ||
                response?.result ||
                (!response?.error && response !== false && response !== null)
            );

            if (isSuccess) {
                console.log('✅ Tạo điều dưỡng thành công');

                messageApi.success({
                    content: '🎉 Tạo điều dưỡng thành công!',
                    duration: 4,
                });

                dispatch(setMessage({
                    type: 'success',
                    content: '🎉 Tài khoản điều dưỡng đã được tạo thành công!',
                    duration: 4
                }));

                // Reset form
                form.resetFields();
                setCurrentStep(0);
                setFormData({});
                setSelectedProvince(null);
                setWards([]);

                setTimeout(() => {
                    onSuccess();
                }, 1500);

            } else {
                const errorMessage = response?.message || response?.error || 'Không thể tạo điều dưỡng';
                console.error('❌ Tạo thất bại:', errorMessage);

                messageApi.error({
                    content: `❌ ${errorMessage}`,
                    duration: 8,
                });

                throw new Error(errorMessage);
            }

        } catch (error) {
            console.error('❌ Lỗi khi tạo điều dưỡng:', error);

            let errorMessage = 'Không thể tạo điều dưỡng. Vui lòng thử lại.';

            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.errors) {
                    const validationErrors = Object.values(error.response.data.errors).flat();
                    errorMessage = validationErrors.join(', ');
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            messageApi.error({
                content: `❌ ${errorMessage}`,
                duration: 8,
            });

        } finally {
            setLoading(false);
        }
    };

    const nextStep = async () => {
        try {
            let fieldsToValidate = [];

            switch (currentStep) {
                case 0:
                    fieldsToValidate = [
                        'fullname', 'phoneNumber', 'email', 'password', 'confirmPassword',
                        'gender', 'dob', 'cccd', 'province', 'ward', 'streetAddress'
                    ];
                    break;
                case 1:
                    fieldsToValidate = ['job', 'departmentId', 'shift', 'experience'];
                    break;
                default:
                    break;
            }

            if (fieldsToValidate.length > 0) {
                const values = await form.validateFields(fieldsToValidate);
                setFormData(prev => ({ ...prev, ...values }));
            }

            setCurrentStep(currentStep + 1);
        } catch (error) {
            const errorFields = error.errorFields || [];
            if (errorFields.length > 0) {
                const missingFields = errorFields.map(field => field.name[0]).join(', ');
                messageApi.error({
                    content: `Vui lòng hoàn thành: ${missingFields}`,
                    duration: 6,
                });
            }
        }
    };

    const prevStep = () => {
        const currentValues = form.getFieldsValue();
        setFormData(prev => ({ ...prev, ...currentValues }));
        setCurrentStep(currentStep - 1);
    };

    const steps = [
        {
            title: 'Thông tin cơ bản',
            description: 'Thông tin cá nhân',
            icon: <UserOutlined />
        },
        {
            title: 'Thông tin nghề nghiệp',
            description: 'Chi tiết công việc',
            icon: <MedicineBoxOutlined />
        },
        {
            title: 'Xem lại',
            description: 'Xác nhận thông tin',
            icon: <CheckCircleOutlined />
        }
    ];

    const renderBasicInfoStep = () => {
        return (
            <div style={{
                marginBottom: 32,
                padding: '20px',
                background: '#f0f7ff',
                borderRadius: '8px',
                border: '1px solid #d6e4ff'
            }}>
                <h3 style={{
                    color: '#52c41a',
                    marginBottom: 20,
                    fontSize: '16px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Thông tin cơ bản
                </h3>

                <Alert
                    message={`Bệnh viện: ${user?.hospitals?.[0]?.name || 'Đang tải...'}`}
                    description={`Đang tạo tài khoản điều dưỡng cho bệnh viện ID: ${hospitalId}.`}
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="fullname"
                            label="Họ và tên"
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ tên' },
                                { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }
                            ]}
                        >
                            <Input placeholder="Nguyễn Thị Lan" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="phoneNumber"
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số' }
                            ]}
                        >
                            <Input placeholder="0123456789" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                            ]}
                        >
                            <Input placeholder="dieuduong@benhvien.com" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
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
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="avatarUrl"
                            label="URL ảnh đại diện"
                        >
                            <Input placeholder="https://example.com/photo.jpg" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            name="gender"
                            label="Giới tính"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                        >
                            <Select placeholder="Chọn giới tính">
                                <Option value="male">👨 Nam</Option>
                                <Option value="female">👩 Nữ</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            name="dob"
                            label="Ngày sinh"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Chọn ngày"
                                format="DD/MM/YYYY"
                                disabledDate={(current) => current && current > dayjs().subtract(18, 'year')}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            name="cccd"
                            label="Số CCCD/CMND"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số CCCD' },
                                { pattern: /^[0-9]{9,12}$/, message: 'CCCD phải có 9-12 chữ số' }
                            ]}
                        >
                            <Input placeholder="Nhập số CCCD" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            name="province"
                            label="Tỉnh/Thành phố"
                            rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
                        >
                            <Select
                                placeholder="Chọn tỉnh/thành phố"
                                showSearch
                                loading={loadingProvinces}
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                                options={provinces.map((p) => ({
                                    label: p.province,
                                    value: p.province,
                                }))}
                                allowClear
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            name="ward"
                            label="Quận/Huyện"
                            rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                        >
                            <Select
                                placeholder={selectedProvince ? "Chọn quận/huyện" : "Chọn tỉnh/thành phố trước"}
                                showSearch
                                disabled={!selectedProvince}
                                options={wards.map((w) => ({
                                    label: w.name,
                                    value: w.name
                                }))}
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                                allowClear
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            name="streetAddress"
                            label="Địa chỉ cụ thể"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}
                        >
                            <Input placeholder="123 Đường ABC" />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        );
    };

    const renderProfessionalStep = () => {
        return (
            <div style={{
                marginBottom: 32,
                padding: '20px',
                background: '#f6ffed',
                borderRadius: '8px',
                border: '1px solid #b7eb8f'
            }}>
                <h3 style={{
                    color: '#52c41a',
                    marginBottom: 20,
                    fontSize: '16px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <MedicineBoxOutlined style={{ marginRight: 8 }} />
                    Thông tin nghề nghiệp
                </h3>

                <Alert
                    message="Phân công vai trò điều dưỡng"
                    description={`Bệnh viện ID: ${hospitalId}. Khoa có sẵn: ${departments.length}`}
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="job"
                            label="Chức danh"
                            initialValue="Điều dưỡng"
                            rules={[{ required: true, message: 'Vui lòng nhập chức danh' }]}
                        >
                            <Select placeholder="Chọn chức danh">
                                <Option value="Điều dưỡng">👩‍⚕️ Điều dưỡng</Option>
                                <Option value="Điều dưỡng trưởng">👩‍⚕️ Điều dưỡng trưởng</Option>
                                <Option value="Điều dưỡng chuyên khoa">👩‍⚕️ Điều dưỡng chuyên khoa</Option>
                                <Option value="Điều dưỡng ca">👩‍⚕️ Điều dưỡng ca</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="departmentId"
                            label="Khoa"
                            rules={[{ required: true, message: 'Vui lòng chọn khoa' }]}
                        >
                            <Select 
                                placeholder="Chọn khoa" 
                                showSearch
                                loading={loadingDepartments}
                                filterOption={(input, option) =>
                                    (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {departments.map(dept => (
                                    <Option key={dept.id} value={dept.id}>
                                        🏥 {dept.name} (ID: {dept.id})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="shift"
                            label="Ca làm việc"
                        >
                            <Select placeholder="Chọn ca làm việc">
                                <Option value="Ca ngày (7AM-7PM)">🌅 Ca ngày (7AM-7PM)</Option>
                                <Option value="Ca đêm (7PM-7AM)">🌙 Ca đêm (7PM-7AM)</Option>
                                <Option value="Luân phiên">🔄 Luân phiên</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="experience"
                            label="Năm kinh nghiệm"
                        >
                            <Select placeholder="Chọn số năm kinh nghiệm">
                                <Option value="0-1 năm">🌱 0-1 năm</Option>
                                <Option value="2-5 năm">🌿 2-5 năm</Option>
                                <Option value="5-10 năm">🌳 5-10 năm</Option>
                                <Option value="Trên 10 năm">🌲 Trên 10 năm</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ marginTop: 16, padding: 12, background: '#f0f0f0', borderRadius: 6, fontSize: '12px' }}>
                    <strong>Thông tin debug:</strong><br />
                    ID Bệnh viện: {hospitalId}<br />
                    Loại vai trò: 7 (Điều dưỡng) - hard-coded<br />
                    Khoa có sẵn: {departments.length}<br />
                    Service: createUser (không phải createDoctor)
                </div>
            </div>
        );
    };

    const renderReviewStep = () => {
        const currentValues = form.getFieldsValue();
        const allData = { ...formData, ...currentValues };

        const selectedDepartment = departments.find(d => d.id === allData.departmentId);

        return (
            <div style={{
                marginBottom: 32,
                padding: '20px',
                background: '#fff7e6',
                borderRadius: '8px',
                border: '1px solid #ffd591'
            }}>
                <h3 style={{
                    color: '#faad14',
                    marginBottom: 20,
                    fontSize: '16px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <CheckCircleOutlined style={{ marginRight: 8 }} />
                    Xem lại thông tin điều dưỡng
                </h3>

                <Alert
                    message="Vui lòng xem lại tất cả thông tin trước khi tạo tài khoản điều dưỡng"
                    description="Đảm bảo tất cả thông tin đều chính xác vì một số thông tin không thể thay đổi sau này."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 20 }}
                />

                <div style={{ background: 'white', padding: '16px', borderRadius: '6px' }}>
                    <Row gutter={32}>
                        <Col span={12}>
                            <h4 style={{ color: '#52c41a', marginBottom: 12 }}>👤 Thông tin cá nhân</h4>
                            <p><strong>Họ tên:</strong> {allData.fullname || 'Chưa cung cấp'}</p>
                            <p><strong>Điện thoại:</strong> {allData.phoneNumber || 'Chưa cung cấp'}</p>
                            <p><strong>Email:</strong> {allData.email || 'Chưa cung cấp'}</p>
                            <p><strong>Giới tính:</strong> {allData.gender === 'male' ? '👨 Nam' : '👩 Nữ'}</p>
                            <p><strong>Ngày sinh:</strong> {allData.dob ? (typeof allData.dob === 'string' ? allData.dob : allData.dob.format('DD/MM/YYYY')) : 'Chưa cung cấp'}</p>
                            <p><strong>CCCD:</strong> {allData.cccd || 'Chưa cung cấp'}</p>
                            <p><strong>Địa chỉ:</strong> {[allData.streetAddress, allData.ward, allData.province].filter(Boolean).join(', ') || 'Chưa cung cấp'}</p>
                        </Col>
                        <Col span={12}>
                            <h4 style={{ color: '#52c41a', marginBottom: 12 }}>🏥 Thông tin nghề nghiệp</h4>
                            <p><strong>Bệnh viện:</strong> {user?.hospitals?.[0]?.name || 'Đang tải...'} (ID: {hospitalId})</p>
                            <p><strong>Loại vai trò:</strong> 7 (Điều dưỡng) - Hard-coded</p>
                            <p><strong>Chức danh:</strong> {allData.job || 'Điều dưỡng'}</p>
                            <p><strong>Khoa:</strong> {selectedDepartment?.name || 'Chưa chọn'} (ID: {allData.departmentId})</p>
                            <p><strong>Ca làm việc:</strong> {allData.shift || 'Chưa xác định'}</p>
                            <p><strong>Kinh nghiệm:</strong> {allData.experience || 'Chưa xác định'}</p>

                            <div style={{ marginTop: 16, padding: 8, background: '#e6fffb', borderRadius: 4, fontSize: '12px' }}>
                                <strong>Xem trước API Payload:</strong><br />
                                hospitalId: {hospitalId}<br />
                                departmentId: {allData.departmentId}<br />
                                roleType: 7 (hard-coded)<br />
                                Service: createUser
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return renderBasicInfoStep();
            case 1:
                return renderProfessionalStep();
            case 2:
                return renderReviewStep();
            default:
                return null;
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <UserAddOutlined style={{
                            color: '#52c41a',
                            marginRight: 8,
                            fontSize: '20px'
                        }} />
                        <span style={{ fontSize: '18px', fontWeight: 600 }}>
                            Thêm điều dưỡng mới
                        </span>
                    </div>
                }
                open={visible}
                onCancel={() => {
                    form.resetFields();
                    setCurrentStep(0);
                    setFormData({});
                    setSelectedProvince(null);
                    setWards([]);
                    onCancel();
                }}
                footer={null}
                width={1100}
                destroyOnClose
                style={{ top: 20 }}
            >
                <Spin spinning={loading}>
                    <div style={{ maxHeight: '75vh', overflowY: 'auto', padding: '0 4px' }}>
                        <div style={{ marginBottom: 32 }}>
                            <Steps current={currentStep} size="small">
                                {steps.map((step, index) => (
                                    <Step
                                        key={index}
                                        title={step.title}
                                        description={step.description}
                                        icon={step.icon}
                                    />
                                ))}
                            </Steps>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            preserve={true}
                            onValuesChange={handleFormValuesChange}
                        >
                            {renderStepContent()}

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: 12,
                                paddingTop: 16,
                                borderTop: '1px solid #f0f0f0'
                            }}>
                                <div>
                                    {currentStep > 0 && (
                                        <Button onClick={prevStep} size="large">
                                            Quay lại
                                        </Button>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: 12 }}>
                                    <Button onClick={() => {
                                        form.resetFields();
                                        setCurrentStep(0);
                                        setFormData({});
                                        setSelectedProvince(null);
                                        setWards([]);
                                        onCancel();
                                    }} size="large">
                                        Hủy
                                    </Button>

                                    {currentStep < steps.length - 1 ? (
                                        <Button
                                            type="primary"
                                            onClick={nextStep}
                                            size="large"
                                            style={{
                                                backgroundColor: '#52c41a',
                                                borderColor: '#52c41a'
                                            }}
                                        >
                                            Tiếp theo
                                        </Button>
                                    ) : (
                                        <Button
                                            type="primary"
                                            onClick={handleSubmit}
                                            loading={loading}
                                            size="large"
                                            icon={<SaveOutlined />}
                                            style={{
                                                backgroundColor: '#52c41a',
                                                borderColor: '#52c41a'
                                            }}
                                        >
                                            Tạo điều dưỡng
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Form>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};

export default AddNurse;