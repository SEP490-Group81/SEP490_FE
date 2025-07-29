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
  Switch,
  Divider
} from 'antd';
import { 
  EditOutlined, 
  SaveOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../redux/slices/messageSlice';
import { updateDoctor } from '../../../services/doctorService';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const EditStaff = ({ visible, onCancel, onSuccess, staff, departments, specializations }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (staff && visible) {
      form.setFieldsValue({
        fullname: staff.name,
        email: staff.email,
        phoneNumber: staff.phone,
        gender: staff.gender ? 'male' : 'female',
        dob: staff.dob ? dayjs(staff.dob) : null,
        departmentId: staff.departmentId,
        specialization: staff.specialization,
        licenseNumber: staff.licenseNumber,
        experience: staff.experience,
        education: staff.education || staff.certifications,
        consultationFee: staff.consultationFee,
        schedule: staff.schedule || staff.shift,
        cccd: staff.cccd,
        province: staff.province,
        ward: staff.ward,
        streetAddress: staff.streetAddress,
        avatarUrl: staff.avatarUrl || staff.avatar,
        status: staff.status === 'active'
      });
    }
  }, [staff, visible, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    
    try {
        console.log('🔄 Starting update process for:', staff.type, staff.id);
        console.log('📝 Form values:', values);
        console.log('👤 Staff data:', staff);
        
        if (staff.type === 'doctor') {
            // ✅ Enhanced data preparation with validation
            const updateData = {
                fullname: values.fullname?.trim() || staff.name,
                email: values.email?.trim() || staff.email,
                phoneNumber: values.phoneNumber?.trim() || staff.phone,
                gender: values.gender === 'male',
                dob: values.dob ? values.dob.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : staff.dob,
                departmentId: parseInt(values.departmentId) || staff.departmentId,
                specialization: values.specialization?.trim() || staff.specialization,
                licenseNumber: values.licenseNumber?.trim() || staff.licenseNumber,
                experience: values.experience?.trim() || staff.experience,
                education: values.education?.trim() || staff.education || staff.certifications,
                consultationFee: values.consultationFee || staff.consultationFee || 0,
                schedule: values.schedule?.trim() || staff.schedule || staff.shift,
                cccd: values.cccd?.trim() || staff.cccd,
                province: values.province?.trim() || staff.province || "string",
                ward: values.ward?.trim() || staff.ward || "string", 
                streetAddress: values.streetAddress?.trim() || staff.streetAddress || "string",
                avatarUrl: values.avatarUrl?.trim() || staff.avatarUrl || staff.avatar || "string",
                status: values.status ? 'active' : 'inactive'
            };

            console.log('📤 Update payload:', updateData);
            console.log('🌐 API call: PUT /doctors/' + staff.id);

            const response = await updateDoctor(staff.id, updateData);
            console.log('📥 Update response:', response);
            console.log('🔍 Response type:', typeof response);
            console.log('🔍 Response keys:', Object.keys(response || {}));
            console.log('🔍 Response details:', JSON.stringify(response, null, 2));
            
            // ✅ Enhanced success checking - more flexible
            const isSuccess = (
                response === true ||
                response?.success === true ||
                response?.success === undefined ||
                (response?.status >= 200 && response?.status < 300) ||
                response?.message?.includes('success') ||
                (!response?.error && response !== false)
            );
            
            console.log('🎯 Determined success status:', isSuccess);
            
            if (isSuccess) {
                console.log('✅ Doctor updated successfully');
                
                dispatch(setMessage({
                    type: 'success',
                    content: '🎉 Doctor updated successfully!',
                    duration: 4
                }));
                
                onSuccess();
            } else {
                const errorMessage = response?.message || response?.error || 'Failed to update doctor';
                console.error('❌ Update failed with message:', errorMessage);
                throw new Error(errorMessage);
            }
            
        } else if (staff.type === 'nurse') {
            // ✅ Mock nurse update (replace with real API call later)
            console.log('🔄 Updating nurse (Mock):', staff.id, values);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('✅ Nurse updated successfully (mock)');
            
            dispatch(setMessage({
                type: 'success',
                content: '🎉 Nurse updated successfully! (Mock)',
                duration: 4
            }));
            
            onSuccess();
        } else {
            throw new Error('Unknown staff type: ' + staff.type);
        }
        
    } catch (error) {
        console.error('❌ Error updating staff:', error);
        console.error('🔍 Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            stack: error.stack
        });
        
        // ✅ Enhanced error message handling
        let errorMessage = `Failed to update ${staff.type}. Please try again.`;
        
        if (error.response?.data) {
            console.log('🔍 API Error Details:', error.response.data);
            if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.data.title) {
                errorMessage = error.response.data.title;
            } else if (error.response.data.errors) {
                // Handle validation errors
                const validationErrors = Object.values(error.response.data.errors).flat();
                errorMessage = validationErrors.join(', ');
            } else if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        console.log('📤 Displaying error message:', errorMessage);
        
        dispatch(setMessage({
            type: 'error',
            content: `❌ ${errorMessage}`,
            duration: 8
        }));
    } finally {
        setLoading(false);
    }
};


  if (!staff) return null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlined style={{ 
            color: staff.type === 'doctor' ? '#1890ff' : '#52c41a', 
            marginRight: 8, 
            fontSize: '20px' 
          }} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>
            Edit {staff.type === 'doctor' ? 'Doctor' : 'Nurse'} - {staff.name}
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      destroyOnClose
      style={{ top: 20 }}
    >
      <Spin spinning={loading}>
        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '0 4px' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
           
            <div style={{ 
              marginBottom: 24, 
              padding: '16px', 
              background: '#f5f5f5', 
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>{staff.type === 'doctor' ? 'Doctor' : 'Nurse'} Status</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Enable or disable {staff.type} account
                </div>
              </div>
              <Form.Item 
                name="status" 
                valuePropName="checked" 
                style={{ margin: 0 }}
              >
                <Switch 
                  checkedChildren="Active" 
                  unCheckedChildren="Inactive"
                />
              </Form.Item>
            </div>

         
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
                    <Input placeholder="Full name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please enter email' },
                      { type: 'email', message: 'Please enter valid email' }
                    ]}
                  >
                    <Input placeholder="email@hospital.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
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
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="Select date"
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="cccd"
                    label="CCCD/ID Card Number"
                    rules={[
                      { pattern: /^[0-9]{9,12}$/, message: 'ID must be 9-12 digits' }
                    ]}
                  >
                    <Input placeholder="Enter ID number" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="avatarUrl"
                    label="Profile Image URL"
                  >
                    <Input placeholder="https://example.com/photo.jpg" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

           
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
                {staff.type === 'doctor' ? 
                  <MedicineBoxOutlined style={{ marginRight: 8 }} /> :
                  <HeartOutlined style={{ marginRight: 8 }} />
                }
                Professional Information
              </h3>
              
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="departmentId"
                    label="Department"
                    rules={[{ required: true, message: 'Please select department' }]}
                  >
                    <Select placeholder="Select department">
                      {departments?.map(dept => (
                        <Option key={dept.id} value={dept.id}>
                          🏥 {dept.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="specialization"
                    label="Specialization"
                    rules={[{ required: true, message: 'Please select specialization' }]}
                  >
                    <Select placeholder="Select specialization" showSearch>
                      {specializations?.map(spec => (
                        <Option key={spec} value={spec}>
                          🩺 {spec}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="licenseNumber"
                    label={staff.type === 'doctor' ? 'Medical License Number' : 'Nursing License Number'}
                    rules={[{ required: true, message: 'Please enter license number' }]}
                  >
                    <Input placeholder={staff.type === 'doctor' ? 'MD-2024-001' : 'RN-2024-001'} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="experience"
                    label="Years of Experience"
                    rules={[{ required: true, message: 'Please enter experience' }]}
                  >
                    <Input placeholder="5 years" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="education"
                    label={staff.type === 'doctor' ? 'Education/Qualification' : 'Certifications'}
                    rules={[{ required: true, message: 'Please enter education/certifications' }]}
                  >
                    <Input placeholder={staff.type === 'doctor' ? 'MD, FACC' : 'BLS, ACLS, PALS'} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="schedule"
                    label={staff.type === 'doctor' ? 'Working Hours' : 'Shift Schedule'}
                    rules={[{ required: true, message: 'Please enter schedule' }]}
                  >
                    <Input placeholder={staff.type === 'doctor' ? 'Mon-Fri: 8:00-17:00' : 'Day Shift (7AM-7PM)'} />
                  </Form.Item>
                </Col>
              </Row>

              {staff.type === 'doctor' && (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="consultationFee"
                      label="Consultation Fee (VND)"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="200000"
                        min={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </div>

          
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
                📍 Address Information
              </h3>
              
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="province"
                    label="Province/City"
                  >
                    <Input placeholder="Ho Chi Minh City" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="ward"
                    label="District/Ward"
                  >
                    <Input placeholder="District 1" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="streetAddress"
                    label="Street Address"
                  >
                    <Input placeholder="123 Nguyen Hue Street" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 12,
              paddingTop: 16,
              borderTop: '1px solid #f0f0f0'
            }}>
              <Button onClick={onCancel} size="large">
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                icon={<SaveOutlined />}
                style={{ 
                  backgroundColor: staff.type === 'doctor' ? '#1890ff' : '#52c41a',
                  borderColor: staff.type === 'doctor' ? '#1890ff' : '#52c41a'
                }}
              >
                Update {staff.type === 'doctor' ? 'Doctor' : 'Nurse'}
              </Button>
            </div>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default EditStaff;