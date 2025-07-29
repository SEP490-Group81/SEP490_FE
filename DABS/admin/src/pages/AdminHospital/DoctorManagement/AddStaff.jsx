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
    InputNumber,
    Upload,
    Alert,
    Steps
} from 'antd';
import {
    UserAddOutlined,
    SaveOutlined,
    UserOutlined,
    MedicineBoxOutlined,
    HeartOutlined,
    UploadOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../redux/slices/messageSlice';
import { createDoctor } from '../../../services/doctorService';

import { getHospitalById, getSpecializationsByHospitalId } from '../../../services/hospitalService';
import { useSelector } from 'react-redux';
import { getDepartmentsByHospitalId } from '../../../services/departmentService';


const { Option } = Select;
const { Step } = Steps;

const AddStaff = ({ visible, onCancel, onSuccess, staffType = 'doctor', departments, specializations }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [formData, setFormData] = useState({});
    const [currentHospital, setCurrentHospital] = useState(null);
    const [hospitalSpecializations, setHospitalSpecializations] = useState([]);
    const [hospitalDepartments, setHospitalDepartments] = useState([]);
    const dispatch = useDispatch();


    const user = useSelector((state) => state.user.user);
    console.log("🔍 Current user data:", JSON.stringify(user));





    useEffect(() => {
        if (visible) {
            form.resetFields();
            setCurrentStep(0);
            setFileList([]);
            setFormData({});

            fetchHospitalData();
        }
    }, [visible, form, user]);

    const fetchHospitalData = async () => {
        setLoading(true);
        try {
            console.log('🔄 Fetching hospital data...');


            const hospitalId = user?.hospitals?.[0]?.id;
            console.log('🏥 Hospital ID from user.hospitals[0].id:', hospitalId);

            if (!hospitalId) {
                throw new Error('Hospital ID not found in user.hospitals data');
            }


            const [hospital, specs, departments] = await Promise.all([
                getHospitalById(hospitalId),
                getSpecializationsByHospitalId(hospitalId),
                getDepartmentsByHospitalId(hospitalId)
            ]);

            setCurrentHospital(hospital);
            setHospitalSpecializations(specs);
            setHospitalDepartments(departments);

            console.log('🏥 Current hospital set:', hospital);
            console.log('🩺 Hospital specializations set:', specs);
            console.log('🏢 Hospital departments set:', departments);

        } catch (error) {
            console.error('❌ Error fetching hospital data:', error);


            const fallbackHospitalId = user?.hospitals?.[0]?.id || 105;
            setCurrentHospital({
                id: fallbackHospitalId,
                name: user?.hospitals?.[0]?.name || 'Default Hospital',
                address: 'Unknown'
            });


            setHospitalSpecializations(specializations || []);
            setHospitalDepartments(departments || []);

            dispatch(setMessage({
                type: 'warning',
                content: 'Could not load hospital data. Using default values.',
                duration: 5
            }));
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async () => {
        setLoading(true);

        try {
            console.log('🚀 Starting form submission...');

            const currentStepValues = form.getFieldsValue();
            const allValues = { ...formData, ...currentStepValues };

            console.log('📝 Current step values:', currentStepValues);
            console.log('💾 Stored form data:', formData);
            console.log('🔄 Merged values:', allValues);
            console.log('🏥 Current hospital:', currentHospital);
            console.log('🏢 Hospital departments:', hospitalDepartments);
            console.log('👤 User data:', user);


            const requiredFields = [
                'fullname', 'phoneNumber', 'password', 'cccd', 'gender', 'dob',
                'province', 'ward', 'streetAddress', 'description', 'position',
                'departmentId', 'specialization'
            ];

            const missingFields = requiredFields.filter(field => !allValues[field]);

            if (missingFields.length > 0) {
                console.error('❌ Missing required fields:', missingFields);
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            if (staffType === 'doctor') {

                const selectedDepartment = hospitalDepartments?.find(dept => dept.id === allValues.departmentId);
                console.log('🏢 Selected department from hospital:', selectedDepartment);


                let specializationIds = [];


                if (allValues.specialization !== undefined && allValues.specialization !== null) {
                    let specId;
                    if (hospitalSpecializations && hospitalSpecializations.length > 0) {
                        const hospitalSpec = hospitalSpecializations[allValues.specialization];
                        specId = hospitalSpec?.id || parseInt(allValues.specialization);
                    } else {
                        specId = parseInt(allValues.specialization);
                    }
                    specializationIds.push(specId);
                }


                if (allValues.specializationIds && allValues.specializationIds.length > 0) {
                    const additionalIds = allValues.specializationIds.map(id => {
                        if (hospitalSpecializations && hospitalSpecializations.length > 0) {
                            const hospitalSpec = hospitalSpecializations[id];
                            return hospitalSpec?.id || parseInt(id);
                        }
                        return parseInt(id);
                    }).filter(id => !specializationIds.includes(id));

                    specializationIds = [...specializationIds, ...additionalIds];
                }


                if (specializationIds.length === 0) {
                    specializationIds = [1, 2];
                }


                const hospitalId = user?.hospitals?.[0]?.id || currentHospital?.id || 105;
                console.log('🏥 Using hospital ID from user.hospitals[0].id:', hospitalId);


                const dobFormatted = allValues.dob
                    ? (typeof allValues.dob === 'string'
                        ? allValues.dob
                        : allValues.dob.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'))
                    : "1995-07-28T08:29:33.047Z";


                const doctorData = {
                    description: allValues.description?.trim() || "Default description",
                    practicingFrom: "2020-07-28T08:29:33.047Z",
                    user: {
                        fullname: allValues.fullname?.trim() || "",
                        phoneNumber: allValues.phoneNumber?.trim() || "",
                        password: allValues.password?.trim() || "",
                        avatarUrl: allValues.avatarUrl?.trim() || "string",
                        dob: dobFormatted,
                        gender: allValues.gender === 'male',
                        job: "Doctor",
                        cccd: allValues.cccd?.trim() || "",
                        province: allValues.province?.trim() || "",
                        ward: allValues.ward?.trim() || "",
                        streetAddress: allValues.streetAddress?.trim() || ""
                    },
                    hospitalAffiliations: [
                        {
                            hospitalId: hospitalId,
                            departmentId: parseInt(allValues.departmentId) || 15,
                            contractStart: "2020-07-28T08:29:33.047Z",
                            contractEnd: "2027-07-28T08:29:33.047Z",
                            position: allValues.position?.trim() || "Doctor"
                        }
                    ],
                    specializationIds: specializationIds
                };

                console.log('🏥 Creating doctor with payload:', doctorData);
                console.log('🔍 Payload validation:');
                console.log('- Hospital ID:', hospitalId);
                console.log('- Department ID (from hospital):', parseInt(allValues.departmentId));
                console.log('- Selected Department Name:', selectedDepartment?.name || 'Not found');
                console.log('- Specialization IDs:', specializationIds);
                console.log('- DOB formatted:', dobFormatted);
                console.log('- Gender (boolean):', allValues.gender === 'male');

                const response = await createDoctor(doctorData);
                console.log('📥 Create doctor response:', response);

                if (response && response.success !== false) {
                    dispatch(setMessage({
                        type: 'success',
                        content: '🎉 Doctor created successfully!',
                        duration: 4
                    }));

                    form.resetFields();
                    setFileList([]);
                    setCurrentStep(0);
                    setFormData({});
                    onSuccess();
                } else {
                    const errorMessage = response?.message || response?.error || 'Failed to create doctor';
                    throw new Error(errorMessage);
                }
            }
        } catch (error) {
            console.error('❌ Error creating staff:', error);

            let errorMessage = `Failed to create ${staffType}. Please try again.`;

            if (error.response?.data) {
                console.log('🔍 API Error Details:', error.response.data);
                errorMessage = error.response.data.message || error.response.data.title || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }

            dispatch(setMessage({
                type: 'error',
                content: errorMessage,
                duration: 8
            }));

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
                        'fullname', 'phoneNumber', 'gender', 'dob', 'cccd',
                        'password', 'confirmPassword', 'province', 'ward', 'streetAddress'
                    ];
                    break;
                case 1:
                    fieldsToValidate = [
                        'description', 'position', 'departmentId', 'specialization'
                    ];
                    break;
                default:
                    break;
            }

            if (fieldsToValidate.length > 0) {
                const values = await form.validateFields(fieldsToValidate);
                console.log(`✅ Step ${currentStep} validated values:`, values);


                setFormData(prev => ({
                    ...prev,
                    ...values
                }));

                console.log('💾 Updated form data state:', { ...formData, ...values });
            }

            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.log('❌ Step validation failed:', error);

            const errorFields = error.errorFields || [];
            if (errorFields.length > 0) {
                const missingFields = errorFields.map(field => field.name[0]).join(', ');
                dispatch(setMessage({
                    type: 'error',
                    content: `Please complete the following fields: ${missingFields}`,
                    duration: 6
                }));
            }
        }
    };


    const prevStep = () => {

        const currentValues = form.getFieldsValue();
        setFormData(prev => ({
            ...prev,
            ...currentValues
        }));

        setCurrentStep(currentStep - 1);
    };


    const handleUpload = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };


    const steps = [
        {
            title: 'Basic Info',
            description: 'Personal information',
            icon: <UserOutlined />
        },
        {
            title: 'Professional',
            description: 'Work details',
            icon: staffType === 'doctor' ? <MedicineBoxOutlined /> : <HeartOutlined />
        },
        {
            title: 'Review',
            description: 'Confirm details',
            icon: <CheckCircleOutlined />
        }
    ];

    const renderProfessionalStep = () => {

        const availableSpecializations = hospitalSpecializations && hospitalSpecializations.length > 0
            ? hospitalSpecializations
            : specializations || [];

        const availableDepartments = hospitalDepartments && hospitalDepartments.length > 0
            ? hospitalDepartments
            : departments || [];

        return (
            <div style={{
                marginBottom: 32,
                padding: '20px',
                background: '#f0f7ff',
                borderRadius: '8px',
                border: '1px solid #d6e4ff'
            }}>
                <h3 style={{
                    color: '#1890ff',
                    marginBottom: 20,
                    fontSize: '16px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <MedicineBoxOutlined style={{ marginRight: 8 }} />
                    Professional Information
                </h3>


                <Alert
                    message={`Hospital Assignment: ${currentHospital?.name || user?.hospitals?.[0]?.name || 'Loading...'}`}
                    description={`The doctor will be automatically affiliated with ${currentHospital?.name || user?.hospitals?.[0]?.name || 'the current hospital'} (ID: ${user?.hospitals?.[0]?.id || currentHospital?.id || 'Loading...'}) and assigned to the selected department. Available departments: ${availableDepartments.length}`}
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="description"
                            label="Professional Description"
                            rules={[{ required: true, message: 'Please enter description' }]}
                        >
                            <Input.TextArea
                                placeholder="Experienced cardiologist with 10+ years in emergency medicine..."
                                rows={3}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="position"
                            label="Position"
                            rules={[{ required: true, message: 'Please enter position' }]}
                            initialValue="Doctor"
                        >
                            <Select placeholder="Select position">
                                <Option value="Doctor">👨‍⚕️ Doctor</Option>
                                <Option value="Senior Doctor">👨‍⚕️ Senior Doctor</Option>
                                <Option value="Chief Doctor">👨‍⚕️ Chief Doctor</Option>
                                <Option value="Consultant">👨‍⚕️ Consultant</Option>
                                <Option value="Specialist">👨‍⚕️ Specialist</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="departmentId"
                            label="Department"
                            rules={[{ required: true, message: 'Please select department' }]}
                        >
                            <Select placeholder="Select department" showSearch>

                                {availableDepartments?.map(dept => (
                                    <Option key={dept.id} value={dept.id}>
                                        🏥 {dept.name} (ID: {dept.id})
                                        {dept.description && ` - ${dept.description}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="specialization"
                            label="Primary Specialization"
                            rules={[{ required: true, message: 'Please select specialization' }]}
                        >
                            <Select placeholder="Select specialization" showSearch>
                                {availableSpecializations.map((spec, index) => (
                                    <Option key={index} value={index}>
                                        🩺 {typeof spec === 'string' ? spec : spec.name || spec.title}
                                        {typeof spec === 'object' && spec.id && ` (ID: ${spec.id})`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="specializationIds"
                            label="Additional Specializations (Optional)"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select additional specializations"
                                showSearch
                            >
                                {availableSpecializations.map((spec, index) => (
                                    <Option key={index} value={index}>
                                        🩺 {typeof spec === 'string' ? spec : spec.name || spec.title}
                                        {typeof spec === 'object' && spec.id && ` (ID: ${spec.id})`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="contractDuration"
                            label="Contract Duration (Years)"
                            initialValue={1}
                        >
                            <Select placeholder="Select contract duration">
                                <Option value={1}>1 Year</Option>
                                <Option value={2}>2 Years</Option>
                                <Option value={3}>3 Years</Option>
                                <Option value={5}>5 Years</Option>
                                <Option value={10}>10 Years</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>


                <div style={{ marginTop: 16, padding: 8, background: '#f0f0f0', fontSize: '12px' }}>
                    <strong>Debug Info:</strong>
                    <br />User Hospital ID: {user?.hospitals?.[0]?.id || 'Not found'}
                    <br />User Hospital Name: {user?.hospitals?.[0]?.name || 'Not found'}
                    <br />Hospital Departments: {hospitalDepartments?.length || 0} items
                    <br />Hospital Specializations: {hospitalSpecializations?.length || 0} items
                    <br />Fallback Departments: {departments?.length || 0} items
                    <br />Fallback Specializations: {specializations?.length || 0} items
                    <br />Using Departments: {availableDepartments === hospitalDepartments ? 'Hospital departments' : 'Fallback departments'}
                    <br />Using Specializations: {availableSpecializations === hospitalSpecializations ? 'Hospital specializations' : 'Fallback specializations'}
                </div>
            </div>
        );
    };

    const renderReviewStep = () => {
        const currentValues = form.getFieldsValue();
        const allData = { ...formData, ...currentValues };

        console.log('📋 Review data:', allData);


        const availableDepartments = hospitalDepartments && hospitalDepartments.length > 0
            ? hospitalDepartments
            : departments || [];

        const selectedDepartment = availableDepartments?.find(d => d.id === allData.departmentId);

        const availableSpecializations = hospitalSpecializations && hospitalSpecializations.length > 0
            ? hospitalSpecializations
            : specializations || [];

        const primarySpecialization = availableSpecializations[allData.specialization];
        const primarySpecName = typeof primarySpecialization === 'string'
            ? primarySpecialization
            : primarySpecialization?.name || primarySpecialization?.title || 'Unknown';

        const additionalSpecs = allData.specializationIds?.map(id => {
            const spec = availableSpecializations[id];
            return typeof spec === 'string' ? spec : spec?.name || spec?.title || 'Unknown';
        }).filter(Boolean) || [];

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
                    <CheckCircleOutlined style={{ marginRight: 8 }} />
                    Review Information
                </h3>

                <Alert
                    message="Please review all information before creating the account"
                    description="Make sure all details are correct as some information cannot be changed later."
                    type="info"
                    showIcon
                    style={{ marginBottom: 20 }}
                />

                <div style={{ background: 'white', padding: '16px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                        <Row gutter={32}>
                            <Col span={12}>
                                <h4 style={{ color: '#1890ff', marginBottom: 12 }}>👤 Personal Information</h4>
                                <p><strong>Name:</strong> {allData.fullname || 'Not provided'}</p>
                                <p><strong>Phone:</strong> {allData.phoneNumber || 'Not provided'}</p>
                                <p><strong>Gender:</strong> {allData.gender === 'male' ? '👨 Male' : allData.gender === 'female' ? '👩 Female' : 'Not selected'}</p>
                                <p><strong>CCCD:</strong> {allData.cccd || 'Not provided'}</p>
                                <p><strong>DOB:</strong> {allData.dob ? (typeof allData.dob === 'string' ? allData.dob : allData.dob.format('YYYY-MM-DD')) : 'Not provided'}</p>
                                <p><strong>Address:</strong> {[allData.streetAddress, allData.ward, allData.province].filter(Boolean).join(', ') || 'Not provided'}</p>
                            </Col>
                            <Col span={12}>
                                <h4 style={{ color: '#1890ff', marginBottom: 12 }}>🏥 Professional Information</h4>
                                <p><strong>Hospital:</strong> {currentHospital?.name || user?.hospitals?.[0]?.name || 'Loading...'} (ID: {user?.hospitals?.[0]?.id || currentHospital?.id || 'N/A'})</p>
                                <p><strong>Department:</strong> {selectedDepartment?.name || 'Not selected'} (ID: {allData.departmentId || 'N/A'})</p>
                                <p><strong>Position:</strong> {allData.position || 'Not selected'}</p>
                                <p><strong>Primary Specialization:</strong> {primarySpecName}</p>
                                {additionalSpecs.length > 0 && (
                                    <p><strong>Additional Specializations:</strong> {additionalSpecs.join(', ')}</p>
                                )}
                                <p><strong>Description:</strong> {allData.description ? `${allData.description.substring(0, 100)}...` : 'Not provided'}</p>


                                <div style={{ marginTop: 16, padding: 8, background: '#f0f0f0', fontSize: '12px' }}>
                                    <strong>API Payload Preview:</strong>
                                    <br />Hospital ID: {user?.hospitals?.[0]?.id || currentHospital?.id || 105}
                                    <br />Department ID: {allData.departmentId || 'Not selected'}
                                    <br />Department Name: {selectedDepartment?.name || 'Not found'}
                                    <br />Specialization IDs: {[allData.specialization, ...(allData.specializationIds || [])].filter(id => id !== undefined).map(id => {
                                        const spec = availableSpecializations[id];
                                        return typeof spec === 'object' ? spec.id : id;
                                    }).join(', ') || 'None'}
                                    <br />Required missing: {['fullname', 'phoneNumber', 'password', 'cccd', 'gender', 'dob', 'province', 'ward', 'streetAddress', 'description', 'position', 'departmentId', 'specialization'].filter(field => !allData[field]).join(', ') || 'None'}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div style={{
                        marginBottom: 32,
                        padding: '20px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e8e8e8'
                    }}>
                        <h3 style={{
                            color: '#1890ff',
                            marginBottom: 20,
                            fontSize: '16px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <UserOutlined style={{ marginRight: 8 }} />
                            Basic Information
                        </h3>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="fullname"
                                    label="Full Name"
                                    rules={[
                                        { required: true, message: 'Please enter full name' },
                                        { min: 2, message: 'Name must be at least 2 characters' }
                                    ]}
                                >
                                    <Input placeholder="Dr. John Smith" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="phoneNumber"
                                    label="Phone Number"
                                    rules={[
                                        { required: true, message: 'Please enter phone number' },
                                        { pattern: /^[0-9]{10,11}$/, message: 'Phone number must be 10-11 digits' }
                                    ]}
                                >
                                    <Input placeholder="0123456789" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="gender"
                                    label="Gender"
                                    rules={[{ required: true, message: 'Please select gender' }]}
                                >
                                    <Select placeholder="Select gender">
                                        <Option value="male">👨 Male</Option>
                                        <Option value="female">👩 Female</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="dob"
                                    label="Date of Birth"
                                    rules={[{ required: true, message: 'Please select date of birth' }]}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        placeholder="Select date"
                                        format="YYYY-MM-DD"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="cccd"
                                    label="CCCD/ID Card Number"
                                    rules={[
                                        { required: true, message: 'Please enter ID number' },
                                        { pattern: /^[0-9]{9,12}$/, message: 'ID must be 9-12 digits' }
                                    ]}
                                >
                                    <Input placeholder="Enter ID number" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[
                                        { required: true, message: 'Please enter password' },
                                        { min: 6, message: 'Password must be at least 6 characters' }
                                    ]}
                                >
                                    <Input.Password placeholder="Enter password" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Please confirm password' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Passwords do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="Confirm password" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="avatarUrl"
                                    label="Profile Image URL"
                                >
                                    <Input placeholder="https://example.com/photo.jpg" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="job"
                                    label="Job Title"
                                    initialValue="Doctor"
                                >
                                    <Input placeholder="Doctor" disabled />
                                </Form.Item>
                            </Col>
                        </Row>


                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="province"
                                    label="Province/City"
                                    rules={[{ required: true, message: 'Please enter province' }]}
                                >
                                    <Input placeholder="Ho Chi Minh City" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="ward"
                                    label="District/Ward"
                                    rules={[{ required: true, message: 'Please enter district' }]}
                                >
                                    <Input placeholder="District 1" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="streetAddress"
                                    label="Street Address"
                                    rules={[{ required: true, message: 'Please enter street address' }]}
                                >
                                    <Input placeholder="123 Nguyen Hue Street" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                );

            case 1:
                return renderProfessionalStep();

            case 2:
                return renderReviewStep();

            default:
                return null;
        }
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserAddOutlined style={{
                        color: staffType === 'doctor' ? '#1890ff' : '#52c41a',
                        marginRight: 8,
                        fontSize: '20px'
                    }} />
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>
                        Add New {staffType === 'doctor' ? 'Doctor' : 'Nurse'}
                    </span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
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
                                        Previous
                                    </Button>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <Button onClick={onCancel} size="large">
                                    Cancel
                                </Button>

                                {currentStep < steps.length - 1 ? (
                                    <Button
                                        type="primary"
                                        onClick={nextStep}
                                        size="large"
                                        style={{
                                            backgroundColor: staffType === 'doctor' ? '#1890ff' : '#52c41a',
                                            borderColor: staffType === 'doctor' ? '#1890ff' : '#52c41a'
                                        }}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        type="primary"
                                        onClick={handleSubmit}
                                        loading={loading}
                                        size="large"
                                        icon={<SaveOutlined />}
                                        style={{
                                            backgroundColor: staffType === 'doctor' ? '#1890ff' : '#52c41a',
                                            borderColor: staffType === 'doctor' ? '#1890ff' : '#52c41a'
                                        }}
                                    >
                                        Create {staffType === 'doctor' ? 'Doctor' : 'Nurse'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Form>
                </div>
            </Spin>
        </Modal>
    );
};

export default AddStaff;