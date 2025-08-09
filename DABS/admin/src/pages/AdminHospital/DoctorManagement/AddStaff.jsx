import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Row,
    Col,
    message,
    Spin
} from 'antd';
import {
    EnvironmentOutlined,
    PhoneOutlined,
    MailOutlined,
    BankOutlined
} from '@ant-design/icons';
import { updateHospital } from '../../../services/hospitalService';
import { getProvinces } from '../../../services/provinceService'; // ✅ Import from provinceService

const { Option } = Select;

const EditMyHospital = ({ visible, onCancel, onSuccess, hospital }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    
    // ✅ States for provinces and wards
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);

    // ✅ Load provinces when modal opens
    useEffect(() => {
        if (visible) {
            fetchProvinces();
        }
    }, [visible]);

    // ✅ Function to fetch provinces from provinceService
    const fetchProvinces = async () => {
        setLoadingProvinces(true);
        try {
            console.log("🌏 Fetching provinces from provinceService...");
            const response = await getProvinces();
            console.log("📍 Provinces response:", response);
            
            // Handle response structure - could be response.data or direct array
            const provincesData = response.data || response || [];
            setProvinces(provincesData);
            console.log("📍 Provinces loaded:", provincesData.length, "provinces");
        } catch (error) {
            console.error("❌ Error fetching provinces:", error);
            message.error('Không thể tải danh sách tỉnh/thành phố');
            
            // ✅ Fallback to mock data if API fails
            console.log("🔄 Using fallback provinces data...");
            const mockProvinces = [
                { province: "Hà Nội", wards: [
                    { name: "Quận Ba Đình" },
                    { name: "Quận Hoàn Kiếm" },
                    { name: "Quận Hai Bà Trưng" },
                    { name: "Quận Đống Đa" },
                    { name: "Quận Tây Hồ" },
                    { name: "Quận Cầu Giấy" },
                    { name: "Quận Thanh Xuân" },
                ]},
                { province: "TP.Hồ Chí Minh", wards: [
                    { name: "Quận 1" },
                    { name: "Quận 2" },
                    { name: "Quận 3" },
                    { name: "Quận 4" },
                    { name: "Quận 5" },
                    { name: "Quận Bình Thạnh" },
                    { name: "Quận Tân Bình" },
                ]},
                { province: "Đà Nẵng", wards: [
                    { name: "Quận Hải Châu" },
                    { name: "Quận Thanh Khê" },
                    { name: "Quận Sơn Trà" },
                    { name: "Quận Ngũ Hành Sơn" },
                    { name: "Quận Liên Chiểu" },
                ]},
                { province: "Hải Phòng", wards: [
                    { name: "Quận Hồng Bàng" },
                    { name: "Quận Lê Chân" },
                    { name: "Quận Ngô Quyền" },
                    { name: "Quận Kiến An" },
                ]},
                { province: "Cần Thơ", wards: [
                    { name: "Quận Ninh Kiều" },
                    { name: "Quận Ô Môn" },
                    { name: "Quận Bình Thuỷ" },
                    { name: "Quận Cái Răng" },
                ]},
            ];
            setProvinces(mockProvinces);
        } finally {
            setLoadingProvinces(false);
        }
    };

    // ✅ Populate form with hospital data and set province/ward
    useEffect(() => {
        if (visible && hospital) {
            console.log('🏥 Setting hospital data:', hospital);
            
            // Set initial form values
            const initialValues = {
                name: hospital.name,
                address: hospital.address,
                province: hospital.province || hospital.state,
                ward: hospital.ward || hospital.city,
                phoneNumber: hospital.phoneNumber,
                email: hospital.email
            };
            
            console.log('📋 Setting form initial values:', initialValues);
            form.setFieldsValue(initialValues);

            // Set selected province and load wards
            const provinceName = hospital.province || hospital.state;
            if (provinceName) {
                setSelectedProvince(provinceName);
                handleProvinceChange(provinceName, false); // Don't reset ward field
            }
        }
    }, [visible, hospital, form]);

    // ✅ Handle province change and load wards
    const handleProvinceChange = (provinceName, shouldResetWard = true) => {
        console.log('📍 Province changed:', provinceName);
        
        setSelectedProvince(provinceName);
        
        if (shouldResetWard) {
            form.setFieldValue('ward', undefined);
        }
        
        setLoadingWards(true);
        
        // Find province and get its wards
        const selectedProvinceData = provinces.find(p => p.province === provinceName);
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            if (selectedProvinceData && selectedProvinceData.wards) {
                setWards(selectedProvinceData.wards);
                console.log(`🏘️ Loaded ${selectedProvinceData.wards.length} wards for ${provinceName}`);
            } else {
                setWards([]);
                console.log(`⚠️ No wards found for province: ${provinceName}`);
            }
            setLoadingWards(false);
        }, 300);
    };

    // ✅ Update wards when province changes
    useEffect(() => {
        if (selectedProvince && provinces.length > 0) {
            const provinceObj = provinces.find((p) => p.province === selectedProvince);
            const wardsList = provinceObj?.wards || [];
            setWards(wardsList);
            console.log("🏘️ Wards for province", selectedProvince, ":", wardsList.length, "wards");
        } else {
            setWards([]);
        }
    }, [selectedProvince, provinces]);

    // ✅ Handle form submission
    const handleSubmit = async () => {
        try {
            setLoading(true);
            console.log('💾 Submitting hospital update...');
            
            const values = await form.validateFields();
            console.log('📋 Form values:', values);

            // ✅ Only update basic hospital information
            const updateData = {
                id: hospital.id,
                name: values.name.trim(),
                address: values.address.trim(),
                province: values.province,
                ward: values.ward,
                phoneNumber: values.phoneNumber.trim(),
                email: values.email.trim(),
                // Keep other existing fields unchanged
                ...hospital,
                // Override with new basic info
                state: values.province, // Map province to state if needed
                city: values.ward,      // Map ward to city if needed
            };

            console.log('🔄 Updating hospital with data:', updateData);

            const response = await updateHospital(updateData);
            console.log('✅ Hospital updated successfully:', response);

            message.success('Cập nhật thông tin bệnh viện thành công!');
            
            // Call onSuccess with updated data
            if (onSuccess) {
                onSuccess(response.result || updateData);
            }

        } catch (error) {
            console.error('❌ Error updating hospital:', error);

            if (error.errorFields) {
                message.error('Vui lòng kiểm tra lại các trường bắt buộc!');
                console.log('📝 Form validation errors:', error.errorFields);
            } else {
                const errorMessage = error.response?.data?.message || 
                                   error.message || 
                                   'Cập nhật thông tin thất bại!';
                message.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle modal cancel
    const handleCancel = () => {
        console.log('❌ Canceling hospital edit');
        form.resetFields();
        setSelectedProvince(null);
        setWards([]);
        if (onCancel) {
            onCancel();
        }
    };

    // ✅ Handle form values change to update province/ward
    const onFormValuesChange = (changedValues) => {
        if ("province" in changedValues) {
            const newProvince = changedValues.province || null;
            handleProvinceChange(newProvince, true); // Reset ward when province changes
        }
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', color: '#1890ff' }}>
                    <BankOutlined style={{ marginRight: 8, fontSize: '18px' }} />
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>
                        Chỉnh sửa thông tin bệnh viện
                    </span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            onOk={handleSubmit}
            width={700}
            confirmLoading={loading}
            destroyOnClose
            okText="Lưu thay đổi"
            cancelText="Hủy"
            maskClosable={false}
            style={{ top: 50 }}
        >
            <Spin spinning={loading} tip="Đang cập nhật thông tin...">
                <div style={{ 
                    padding: '20px 0',
                    background: '#fafafa',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    <p style={{ 
                        margin: 0, 
                        color: '#666',
                        fontSize: '14px'
                    }}>
                        ℹ️ Chỉ có thể chỉnh sửa thông tin cơ bản của bệnh viện
                    </p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    preserve={false}
                    onValuesChange={onFormValuesChange} // ✅ Handle form changes
                    style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}
                >
                    {/* ✅ Hospital Name */}
                    <Form.Item
                        name="name"
                        label={
                            <span style={{ fontWeight: 600, color: '#262626' }}>
                                🏥 Tên bệnh viện
                            </span>
                        }
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên bệnh viện' },
                            { min: 5, message: 'Tên bệnh viện phải có ít nhất 5 ký tự' }
                        ]}
                    >
                        <Input 
                            placeholder="Nhập tên bệnh viện" 
                            style={{ fontSize: '14px' }}
                        />
                    </Form.Item>

                    {/* ✅ Address */}
                    <Form.Item
                        name="address"
                        label={
                            <span style={{ fontWeight: 600, color: '#262626' }}>
                                <EnvironmentOutlined style={{ marginRight: 4 }} />
                                Địa chỉ chi tiết
                            </span>
                        }
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa chỉ' },
                            { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự' }
                        ]}
                    >
                        <Input 
                            placeholder="Nhập địa chỉ đầy đủ (số nhà, tên đường, phường/xã)" 
                            style={{ fontSize: '14px' }}
                        />
                    </Form.Item>

                    {/* ✅ Province and Ward */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="province"
                                label={
                                    <span style={{ fontWeight: 600, color: '#262626' }}>
                                        🏛️ Tỉnh/Thành phố
                                    </span>
                                }
                                rules={[
                                    { required: true, message: 'Vui lòng chọn tỉnh/thành phố' }
                                ]}
                            >
                                <Select
                                    placeholder="Chọn tỉnh/thành phố"
                                    loading={loadingProvinces}
                                    showSearch
                                    allowClear
                                    filterOption={(input, option) =>
                                        (option?.children ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    style={{ fontSize: '14px' }}
                                    onSelect={(value) => {
                                        console.log("🏙️ Province selected:", value);
                                    }}
                                >
                                    {provinces.map((province) => (
                                        <Option key={province.province} value={province.province}>
                                            📍 {province.province}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="ward"
                                label={
                                    <span style={{ fontWeight: 600, color: '#262626' }}>
                                        🏘️ Quận/Huyện
                                    </span>
                                }
                                rules={[
                                    { required: true, message: 'Vui lòng chọn quận/huyện' }
                                ]}
                            >
                                <Select
                                    placeholder={
                                        selectedProvince 
                                            ? "Chọn quận/huyện"
                                            : "Chọn tỉnh/thành phố trước"
                                    }
                                    loading={loadingWards}
                                    showSearch
                                    allowClear
                                    disabled={!selectedProvince}
                                    filterOption={(input, option) =>
                                        (option?.children ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    style={{ fontSize: '14px' }}
                                    notFoundContent={
                                        !selectedProvince 
                                            ? "Vui lòng chọn tỉnh/thành phố trước"
                                            : loadingWards 
                                                ? "Đang tải..." 
                                                : "Không tìm thấy quận/huyện"
                                    }
                                    onSelect={(value) => {
                                        console.log("🏘️ Ward selected:", value);
                                    }}
                                >
                                    {wards.map((ward) => (
                                        <Option key={ward.name} value={ward.name}>
                                            🏛️ {ward.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* ✅ Contact Information */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label={
                                    <span style={{ fontWeight: 600, color: '#262626' }}>
                                        <PhoneOutlined style={{ marginRight: 4 }} />
                                        Số điện thoại
                                    </span>
                                }
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải có 10-11 chữ số' }
                                ]}
                            >
                                <Input 
                                    placeholder="Nhập số điện thoại (10-11 chữ số)" 
                                    style={{ fontSize: '14px' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label={
                                    <span style={{ fontWeight: 600, color: '#262626' }}>
                                        <MailOutlined style={{ marginRight: 4 }} />
                                        Email
                                    </span>
                                }
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email' },
                                    { type: 'email', message: 'Email không hợp lệ' }
                                ]}
                            >
                                <Input 
                                    placeholder="Nhập địa chỉ email" 
                                    style={{ fontSize: '14px' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* ✅ Info notice */}
                    <div style={{
                        background: '#e6f7ff',
                        border: '1px solid #91d5ff',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        marginTop: '16px'
                    }}>
                        <p style={{ 
                            margin: 0, 
                            fontSize: '13px',
                            color: '#0050b3'
                        }}>
                            💡 <strong>Lưu ý:</strong> Chỉ có thể chỉnh sửa thông tin cơ bản. 
                            Các thông tin khác như chuyên khoa, dịch vụ, v.v. cần liên hệ quản trị viên.
                        </p>
                    </div>

                    {/* ✅ Debug info (remove in production) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div style={{
                            background: "#f0f0f0",
                            padding: 12,
                            borderRadius: 6,
                            fontSize: '12px',
                            marginTop: 16
                        }}>
                            <strong>🔍 Debug Info:</strong><br />
                            Provinces loaded: {provinces.length}<br />
                            Selected province: {selectedProvince || "None"}<br />
                            Available wards: {wards.length}<br />
                            Loading provinces: {loadingProvinces ? "Yes" : "No"}<br />
                            Loading wards: {loadingWards ? "Yes" : "No"}<br />
                            Hospital ID: {hospital?.id || "N/A"}
                        </div>
                    )}
                </Form>
            </Spin>
        </Modal>
    );
};

export default EditMyHospital;