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
  message
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  UserOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { setMessage } from '../../../redux/slices/messageSlice';
import { updateDoctor } from '../../../services/doctorService';
import { updateUser } from '../../../services/userService';
import { getProvinces } from '../../../services/provinceService';
import { getHospitalById, getSpecializationsByHospitalId } from '../../../services/hospitalService';
import { getDepartmentsByHospitalId } from '../../../services/departmentService';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const EditStaff = ({ visible, onCancel, onSuccess, staff, departments: propDepartments, specializations: propSpecializations }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Hospital-specific states
  const [currentHospital, setCurrentHospital] = useState(null);
  const [hospitalSpecializations, setHospitalSpecializations] = useState([]);
  const [hospitalDepartments, setHospitalDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [specializationsLoading, setSpecializationsLoading] = useState(false);

  // Address states
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  // ✅ Fetch provinces once
  useEffect(() => {
    getProvinces()
      .then((data) => setProvinces(data.data))
      .catch((err) => console.error("Lỗi khi tải tỉnh thành:", err));
  }, []);

  // ✅ Load wards when province changes
  useEffect(() => {
    if (selectedProvince) {
      const provinceObj = provinces.find((p) => p.province === selectedProvince);
      setWards(provinceObj?.wards || []);
    } else {
      setWards([]);
    }
  }, [selectedProvince, provinces]);

  // ✅ Fetch hospital data
  const fetchHospitalData = async () => {
    if (!user?.hospitals?.[0]?.id) {
      console.warn('Không tìm thấy ID bệnh viện cho user');
      return;
    }

    setDepartmentsLoading(true);
    setSpecializationsLoading(true);

    try {
      const hospitalId = user.hospitals[0].id;
      console.log('🏥 Đang tải dữ liệu cho bệnh viện ID:', hospitalId);

      const [hospital, specs, depts] = await Promise.all([
        getHospitalById(hospitalId),
        getSpecializationsByHospitalId(hospitalId),
        getDepartmentsByHospitalId(hospitalId)
      ]);

      setCurrentHospital(hospital);
      setHospitalSpecializations(specs);
      setHospitalDepartments(depts);

      console.log('🏥 Bệnh viện hiện tại đã được thiết lập:', hospital);
      console.log('🩺 Chuyên khoa bệnh viện đã được thiết lập:', specs);
      console.log('🏢 Khoa bệnh viện đã được thiết lập:', depts);

    } catch (error) {
      console.error('❌ Lỗi khi tải dữ liệu bệnh viện:', error);

      // Fallback
      const fallbackHospitalId = user?.hospitals?.[0]?.id || 105;
      setCurrentHospital({
        id: fallbackHospitalId,
        name: user?.hospitals?.[0]?.name || 'Bệnh viện mặc định',
        address: 'Không rõ'
      });

      setHospitalSpecializations(propSpecializations || []);
      setHospitalDepartments(propDepartments || []);

      message.warning('Không thể tải dữ liệu bệnh viện. Đang sử dụng giá trị mặc định.');
    } finally {
      setDepartmentsLoading(false);
      setSpecializationsLoading(false);
    }
  };

  // ✅ SINGLE useEffect để set form data - Remove duplicate
  useEffect(() => {
    if (staff && visible && provinces.length > 0) {
      console.log("🔧 EditStaff đang khởi tạo với nhân viên:", staff);

      // ✅ Parse và prepare form data với better error handling
      const prepareFormData = () => {
        let formData = {};

        try {
          if (staff.originalData) {
            const { doctor, user } = staff.originalData;
            console.log("📊 Sử dụng cấu trúc originalData:", { doctor, user });

            // ✅ Parse DOB với multiple format support
            let dobValue = null;
            const dobSource = user.dob || staff.dob;
            if (dobSource) {
              console.log("🗓️ Đang parse DOB:", dobSource, typeof dobSource);
              try {
                if (typeof dobSource === 'string') {
                  if (dobSource.includes('T')) {
                    dobValue = dayjs(dobSource); // ISO format
                  } else if (dobSource.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    dobValue = dayjs(dobSource, 'YYYY-MM-DD'); // Date only
                  } else {
                    dobValue = dayjs(dobSource); // Other formats
                  }
                } else {
                  dobValue = dayjs(dobSource);
                }

                if (!dobValue.isValid()) {
                  console.warn("⚠️ DOB không hợp lệ, đặt về null");
                  dobValue = null;
                } else {
                  console.log("✅ DOB đã được parse:", dobValue.format('YYYY-MM-DD'));
                }
              } catch (error) {
                console.error("❌ Lỗi khi parse DOB:", error);
                dobValue = null;
              }
            }

            // ✅ Parse practicing date
            let practicingFromValue = null;
            const practicingSource = doctor.practicingFrom || staff.practicingFrom;
            if (practicingSource) {
              console.log("🏥 Đang parse practicingFrom:", practicingSource);
              try {
                practicingFromValue = dayjs(practicingSource);
                if (!practicingFromValue.isValid()) {
                  practicingFromValue = null;
                } else {
                  console.log("✅ PracticingFrom đã được parse:", practicingFromValue.format('YYYY-MM-DD'));
                }
              } catch (error) {
                console.error("❌ Lỗi khi parse practicingFrom:", error);
                practicingFromValue = null;
              }
            }

            formData = {
              // ✅ Thông tin cơ bản
              fullname: user.fullname || staff.fullname || staff.name || "",
              email: user.email || staff.email || "",
              phoneNumber: user.phoneNumber || staff.phoneNumber || staff.phone || "",
              gender: typeof user.gender === 'boolean'
                ? (user.gender ? 'male' : 'female')
                : (user.gender === 'male' ? 'male' : 'female'),
              dob: dobValue,
              cccd: user.cccd || staff.cccd || "",
              avatarUrl: user.avatarUrl || staff.avatarUrl || staff.avatar || "",
              job: user.job || 'Bác sĩ',

              // ✅ Thông tin địa chỉ
              province: user.province || staff.province || "",
              ward: user.ward || staff.ward || "",
              streetAddress: user.streetAddress || staff.streetAddress || "",

              // ✅ Thông tin chuyên môn
              departmentId: staff.departmentId || null,
              specializationIds: staff.specializationIds || [],
              description: doctor.description || staff.description || "",
              practicingFrom: practicingFromValue,

              // ✅ Hospital affiliations
              hospitalAffiliations: staff.hospitalAffiliations || []
            };

          } else {
            // ✅ Handle direct staff object structure
            console.log("📊 Sử dụng cấu trúc staff trực tiếp");

            let dobValue = null;
            if (staff.dob) {
              try {
                dobValue = dayjs(staff.dob);
                if (!dobValue.isValid()) dobValue = null;
              } catch (error) {
                console.error("❌ Lỗi khi parse DOB của staff:", error);
                dobValue = null;
              }
            }

            let practicingFromValue = null;
            if (staff.practicingFrom) {
              try {
                practicingFromValue = dayjs(staff.practicingFrom);
                if (!practicingFromValue.isValid()) practicingFromValue = null;
              } catch (error) {
                practicingFromValue = null;
              }
            }

            formData = {
              fullname: staff.fullname || staff.name || "",
              email: staff.email || "",
              phoneNumber: staff.phoneNumber || staff.phone || "",
              gender: typeof staff.gender === 'boolean'
                ? (staff.gender ? 'male' : 'female')
                : (staff.gender === 'male' ? 'male' : 'female'),
              dob: dobValue,
              cccd: staff.cccd || "",
              avatarUrl: staff.avatarUrl || staff.avatar || "",
              job: 'Bác sĩ',
              province: staff.province || "",
              ward: staff.ward || "",
              streetAddress: staff.streetAddress || "",
              departmentId: staff.departmentId || null,
              specializationIds: staff.specializationIds || [],
              description: staff.description || "",
              practicingFrom: practicingFromValue,
              hospitalAffiliations: staff.hospitalAffiliations || []
            };
          }

          return formData;

        } catch (error) {
          console.error("❌ Lỗi khi chuẩn bị dữ liệu form:", error);
          // ✅ Return minimal safe data
          return {
            fullname: staff.fullname || staff.name || "",
            email: staff.email || "",
            phoneNumber: staff.phoneNumber || staff.phone || "",
            gender: 'male',
            dob: null,
            cccd: "",
            avatarUrl: "",
            job: 'Bác sĩ',
            province: "",
            ward: "",
            streetAddress: "",
            departmentId: null,
            specializationIds: [],
            description: "",
            practicingFrom: null,
            hospitalAffiliations: []
          };
        }
      };

      const formData = prepareFormData();

      console.log("📝 Dữ liệu form cuối cùng để thiết lập:", formData);
      console.log("🗓️ Giá trị DOB:", formData.dob, formData.dob?.format?.('YYYY-MM-DD'));
      console.log("🏥 ID khoa:", formData.departmentId);
      console.log("🩺 ID chuyên khoa:", formData.specializationIds);

      // ✅ Set form values
      form.setFieldsValue(formData);

      // ✅ Set selected province để load wards
      if (formData.province) {
        setSelectedProvince(formData.province);
      }

      // ✅ Fetch hospital data sau khi set form
      fetchHospitalData();

    }
  }, [staff, visible, provinces, form]); // ✅ Proper dependencies

  // ✅ Handle form values change
  const onFormValuesChange = (changedValues) => {
    console.log("📝 Giá trị form đã thay đổi:", changedValues);

    if ("province" in changedValues) {
      const newProvince = changedValues.province || null;
      setSelectedProvince(newProvince);

      // ✅ Clear ward when province changes
      if (newProvince !== selectedProvince) {
        form.setFieldsValue({ ward: undefined });
      }
    }
  };

  // ✅ Enhanced handleSubmit với better validation
  const handleSubmit = async (values) => {
    setLoading(true);

    // Determine staff type outside try block for error handling
    const isDoctor = staff.type === 'doctor' || staff.editApiType === 'updateDoctor';
    const isNurse = staff.type === 'nurse' || staff.editApiType === 'updateUser';
    const staffTypeText = isDoctor ? 'bác sĩ' : 'điều dưỡng';

    try {
      console.log('🔄 Bắt đầu quá trình cập nhật cho nhân viên ID:', staff.id);
      console.log('📝 Giá trị form nhận được:', values);
      console.log('👤 Loại nhân viên:', staff.type || staff.editApiType);

      // ✅ Pre-submit validation
      if (!values.dob) {
        message.error('Ngày sinh là bắt buộc');
        setLoading(false);
        return;
      }

      if (isDoctor) {
        if (!values.departmentId) {
          message.error('Vui lòng chọn khoa');
          setLoading(false);
          return;
        }

        if (!values.specializationIds || values.specializationIds.length === 0) {
          message.error('Vui lòng chọn ít nhất một chuyên khoa');
          setLoading(false);
          return;
        }
      }

      // ✅ Format dates properly
      let dobFormatted = null;
      if (values.dob) {
        try {
          if (typeof values.dob === 'string') {
            dobFormatted = values.dob.match(/^\d{4}-\d{2}-\d{2}$/)
              ? values.dob
              : dayjs(values.dob).format('YYYY-MM-DD');
          } else if (values.dob && values.dob.format) {
            dobFormatted = values.dob.format('YYYY-MM-DD');
          } else {
            dobFormatted = dayjs(values.dob).format('YYYY-MM-DD');
          }
        } catch (error) {
          console.error('❌ Lỗi khi định dạng DOB:', error);
          throw new Error('Định dạng ngày sinh không hợp lệ');
        }
      }

      let practicingFromFormatted = null;
      if (values.practicingFrom) {
        try {
          if (typeof values.practicingFrom === 'string') {
            practicingFromFormatted = values.practicingFrom;
          } else if (values.practicingFrom.toISOString) {
            practicingFromFormatted = values.practicingFrom.toISOString();
          } else {
            practicingFromFormatted = dayjs(values.practicingFrom).toISOString();
          }
        } catch (error) {
          console.error('❌ Lỗi khi định dạng practicingFrom:', error);
          practicingFromFormatted = dayjs().toISOString(); // ✅ Fallback to current date
        }
      } else {
        // ✅ Default to current date if not provided
        practicingFromFormatted = dayjs().toISOString();
      }

      let response;

      if (isDoctor) {
        // ✅ Handle doctor update với NEW payload structure
        const hospitalId = currentHospital?.id || user?.hospitals?.[0]?.id;
        if (!hospitalId) {
          throw new Error('Không tìm thấy ID bệnh viện. Vui lòng làm mới trang và thử lại.');
        }

        // ✅ Get correct IDs from staff object
        const doctorId = staff.originalData?.id || staff.doctorId || staff.id;
        const userId = staff.originalData?.user?.id || staff.userId || staff.user?.id;

        console.log('🆔 Doctor ID:', doctorId);
        console.log('🆔 User ID:', userId);
        console.log('🏥 Hospital ID:', hospitalId);

        // ✅ NEW PAYLOAD STRUCTURE theo API requirement
        const updateData = {
          id: parseInt(doctorId), // ✅ Doctor ID ở top level

          hospitalAffiliations: [{
            hospitalId: parseInt(hospitalId),
            departmentId: parseInt(values.departmentId),
            contractStart: dayjs().toISOString(),
            contractEnd: dayjs().add(1, 'year').toISOString(),
            position: "Bác sĩ"
          }],

          user: {
            id: parseInt(userId),
            fullname: values.fullname?.trim() || "",
            phoneNumber: values.phoneNumber?.trim() || "",
            email: values.email?.trim() || "",
            avatarUrl: values.avatarUrl?.trim() || "",
            dob: dobFormatted, // ✅ Format YYYY-MM-DD
            gender: values.gender === 'male', // ✅ Boolean
            job: values.job || 'Bác sĩ',
            cccd: values.cccd?.trim() || "",
            province: values.province?.trim() || "",
            ward: values.ward?.trim() || "",
            streetAddress: values.streetAddress?.trim() || ""
          },

          // ✅ NO nested doctor object - fields ở top level
          description: values.description?.trim() || "", // ✅ Top level
          practicingFrom: practicingFromFormatted || dayjs().toISOString(), // ✅ Top level với fallback

          specializationIds: Array.isArray(values.specializationIds)
            ? values.specializationIds.map(id => parseInt(id)) // ✅ Convert to integers
            : [parseInt(values.specializationIds)]
        };

        console.log('📤 NEW Payload cập nhật bác sĩ:', JSON.stringify(updateData, null, 2));
        response = await updateDoctor(updateData);

      } else if (isNurse) {
        // ✅ Handle nurse update
        const nurseId = staff.id || staff.userId;

        const updateData = {
          id: parseInt(nurseId), // ✅ Ensure integer
          fullname: values.fullname?.trim() || "",
          phoneNumber: values.phoneNumber?.trim() || "",
          email: values.email?.trim() || "",
          avatarUrl: values.avatarUrl?.trim() || "",
          dob: dobFormatted,
          gender: values.gender === 'male',
          job: values.job || 'Điều dưỡng',
          cccd: values.cccd?.trim() || "",
          province: values.province?.trim() || "",
          ward: values.ward?.trim() || "",
          streetAddress: values.streetAddress?.trim() || "",
          description: values.description?.trim() || "",
          practicingFrom: practicingFromFormatted || null, // ✅ Consistent with doctor
        };

        console.log('📤 Payload cập nhật điều dưỡng:', JSON.stringify(updateData, null, 2));
        response = await updateUser(nurseId, updateData);
      } else {
        throw new Error('Không xác định được loại nhân viên. Không thể xác định phương thức cập nhật.');
      }

      console.log('📥 Phản hồi cập nhật:', response);
      console.log('📥 Response type:', typeof response);
      console.log('📥 Response keys:', response ? Object.keys(response) : 'No keys');

      // ✅ Enhanced success detection
      let isSuccess = false;

      if (response) {
        // Check if response has the expected structure from your payload
        if (response.id && (response.user || response.hospitalAffiliations || response.description !== undefined)) {
          isSuccess = true;
          console.log('✅ Success detected: Response contains expected payload structure');
        }
        // Check explicit success indicators
        else if (
          response === true ||
          response.success === true ||
          (response.status >= 200 && response.status < 300) ||
          (typeof response.message === 'string' && response.message.toLowerCase().includes('success'))
        ) {
          isSuccess = true;
          console.log('✅ Success detected: Explicit success indicators');
        }
        // Check if response doesn't have error indicators
        else if (
          !response.error &&
          response !== false &&
          response !== null &&
          response.success !== false
        ) {
          isSuccess = true;
          console.log('✅ Success detected: No error indicators found');
        }
      }

      if (isSuccess) {
        console.log(`✅ Cập nhật ${staffTypeText} thành công`);
        message.success(`Cập nhật ${staffTypeText} thành công!`);
        dispatch(setMessage({
          type: 'success',
          content: `🎉 Thông tin ${staffTypeText} đã được cập nhật thành công!`,
          duration: 4
        }));

        // ✅ Close modal and trigger refresh
        handleCancel(); // Close modal first

        // ✅ Call onSuccess with updated data if available
        if (typeof onSuccess === 'function') {
          onSuccess(response); // Pass response data for refresh
        }

      } else {
        const errorMessage = response?.message || response?.error || `Cập nhật ${staffTypeText} thất bại`;
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật ${staffTypeText}:`, error);

      let errorMessage = `Cập nhật ${staffTypeText} thất bại. Vui lòng thử lại.`;

      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        } else if (error.response.data.errors) {
          const validationErrors = [];
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(msg => validationErrors.push(`${field}: ${msg}`));
            } else {
              validationErrors.push(`${field}: ${messages}`);
            }
          });
          errorMessage = validationErrors.join('\n');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
      dispatch(setMessage({
        type: 'error',
        content: `❌ ${errorMessage}`,
        duration: 8
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('🔄 Closing modal and cleaning up...');

    form.resetFields();
    setSelectedProvince(null);
    setWards([]);
    setCurrentHospital(null);
    setHospitalDepartments([]);
    setHospitalSpecializations([]);
    setLoading(false); // ✅ Reset loading state

    // ✅ Call onCancel to close modal
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  if (!staff) return null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <EditOutlined style={{
            color: '#1890ff',
            marginRight: 8,
            fontSize: '20px'
          }} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>
            Chỉnh sửa {(staff.type === 'doctor' || staff.editApiType === 'updateDoctor') ? 'Bác sĩ' : 'Điều dưỡng'} - {staff.fullname || staff.name}
          </span>
          {currentHospital && (
            <span style={{
              fontSize: '12px',
              color: '#666',
              marginLeft: '8px',
              fontWeight: 'normal'
            }}>
              ({currentHospital.name})
            </span>
          )}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      destroyOnClose
      style={{ top: 20 }}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '0 4px' }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={onFormValuesChange}
            preserve={false}
          >
            {/* Thông tin cơ bản */}
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
                Thông tin cơ bản
              </h3>

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
                    <Input placeholder="Họ và tên" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="email"
                    label="Địa chỉ email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                    ]}
                  >
                    <Input placeholder="email@benhvien.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={8}>
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
                    rules={[
                      { required: true, message: 'Vui lòng chọn ngày sinh' }, // ✅ Add required validation
                      {
                        validator: (_, value) => {
                          if (value && dayjs().diff(value, 'years') < 18) {
                            return Promise.reject(new Error('Phải đủ 18 tuổi trở lên'));
                          }
                          if (value && dayjs().diff(value, 'years') > 100) {
                            return Promise.reject(new Error('Vui lòng nhập ngày sinh hợp lệ'));
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="Chọn ngày sinh"
                      format="YYYY-MM-DD"
                      disabledDate={(current) => {
                        return current && (
                          current > dayjs().endOf('day') ||
                          current < dayjs().subtract(100, 'years')
                        );
                      }}
                      showToday={false}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="cccd"
                    label="Số CCCD/CMND"
                    rules={[
                      { pattern: /^[0-9]{9,12}$/, message: 'CCCD phải có 9-12 chữ số' }
                    ]}
                  >
                    <Input placeholder="Nhập số CCCD" />
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
                <Col xs={24} md={12}>
                  <Form.Item
                    name="job"
                    label="Chức danh"
                  >
                    <Input placeholder="Bác sĩ" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Thông tin chuyên môn */}
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
                Thông tin chuyên môn
                {hospitalDepartments.length > 0 && (
                  <span style={{
                    fontSize: '12px',
                    color: '#666',
                    marginLeft: '8px',
                    fontWeight: 'normal'
                  }}>
                    ({hospitalDepartments.length} khoa có sẵn)
                  </span>
                )}
              </h3>

              <Form.Item
                name="description"
                label="Mô tả chuyên môn"
              >
                <TextArea
                  rows={3}
                  placeholder="Mô tả ngắn gọn về chuyên môn hoặc kinh nghiệm"
                />
              </Form.Item>

              {/* Khoa và Chuyên khoa - Chỉ dành cho Bác sĩ */}
              {(staff.type === 'doctor' || staff.editApiType === 'updateDoctor') && (
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="departmentId"
                      label="Khoa"
                      rules={[{ required: true, message: 'Vui lòng chọn khoa' }]}
                    >
                      <Select
                        placeholder={hospitalDepartments.length > 0 ? "Chọn khoa" : "Đang tải khoa..."}
                        loading={departmentsLoading}
                        showSearch
                        filterOption={(input, option) =>
                          option?.children?.toLowerCase().includes(input.toLowerCase())
                        }
                        notFoundContent={hospitalDepartments.length === 0 ? "Không tìm thấy khoa" : "Không có khoa phù hợp"}
                      >
                        {hospitalDepartments?.map(dept => (
                          <Option key={dept.id} value={dept.id}>
                            🏥 {dept.name}
                            {dept.description && (
                              <span style={{ color: '#999', fontSize: '12px' }}>
                                {' - ' + dept.description}
                              </span>
                            )}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="specializationIds"
                      label="Chuyên khoa"
                      rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder={hospitalSpecializations.length > 0 ? "Chọn chuyên khoa" : "Đang tải chuyên khoa..."}
                        loading={specializationsLoading}
                        showSearch
                        notFoundContent={hospitalSpecializations.length === 0 ? "Không tìm thấy chuyên khoa" : "Không có chuyên khoa phù hợp"}
                      >
                        {hospitalSpecializations?.map(spec => (
                          <Option key={spec.id} value={spec.id}>
                            🩺 {spec.name}
                            {spec.description && (
                              <span style={{ color: '#999', fontSize: '12px' }}>
                                {' - ' + spec.description}
                              </span>
                            )}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="practicingFrom"
                    label="Hành nghề từ"
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      placeholder="Chọn ngày"
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Thông tin địa chỉ */}
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
                📍 Thông tin địa chỉ
              </h3>

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
                      allowClear
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={provinces.map((p) => ({
                        label: p.province,
                        value: p.province,
                      }))}
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
                      placeholder="Chọn quận/huyện"
                      disabled={!selectedProvince}
                      showSearch
                      allowClear
                      options={wards.map((w) => ({ label: w.name, value: w.name }))}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    name="streetAddress"
                    label="Địa chỉ cụ thể"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}
                  >
                    <Input placeholder="123 Đường Nguyễn Huệ" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Form Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
              paddingTop: 16,
              borderTop: '1px solid #f0f0f0'
            }}>
              <Button onClick={handleCancel} size="large" disabled={loading}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<SaveOutlined />}
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
              </Button>
            </div>
          </Form>
        </div>
      </Spin>
    </Modal>
  );
};

export default EditStaff;