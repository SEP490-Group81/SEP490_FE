import { Alert, Divider, Input, Typography, Form, Col, Row, Button, DatePicker, ConfigProvider, Select } from "antd";
import { UserOutlined, CalendarOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import viVN from "antd/lib/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDistricts, getProvinces, getWards } from "../../../services/provinceService";
dayjs.locale("vi");
const { Text } = Typography;
function CreateProfile() {
  // const dispatch = useDispatch();
  const userDefault = useSelector((state) => state.user.user);

  console.log("userDefault in createProfile", userDefault);
  const { Option } = Select;


  const fieldMap = {
    userName: 'fullName',
    dob: 'dob',
    phoneNumber: 'phoneNumber',
    email: 'email',
    gender: 'gender',
    job: 'job',
    address: 'streetAddress',
    province: 'province',
    district: 'district',
    ward: 'ward'
  };

const getMappedData = (values) => {
  const mapped = {};
  Object.keys(fieldMap).forEach((formField) => {
    if (values[formField] !== undefined && values[formField] !== null && values[formField] !== "") {
      if (formField === 'dob') {
        mapped[fieldMap[formField]] = values.dob.format ? values.dob.format('YYYY-MM-DD') : values.dob;
      } else if (formField === 'gender') {
        mapped[fieldMap[formField]] = values.gender === "1" || values.gender === 1 || values.gender === true;
      } else {
        mapped[fieldMap[formField]] = values[formField];
      }
    }
  });
  return mapped;
};


  const handleFinish = (values) => {
    const mappedData = getMappedData(values);
    const newUser = { ...userDefault, ...mappedData };
    console.log("Mapped Data:", mappedData);
    console.log("New User Data:", newUser);
    try {
      // Gửi dữ liệu lên server
      // const res = await putAuth('/api/v1/user/update', newUser);

      // // Sau khi thành công, cập nhật lại Redux (giả sử res.result là user mới)
      // if (res && res.result) {
      //   dispatch(setUser(res.result));
      // }
    } catch (error) {
      // Xử lý lỗi nếu cần
      console.error(error);
    }
  };

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    getProvinces()
      .then(data => setProvinces(data))
      .catch(err => {
        console.error("Error fetching provinces:", err);
      });
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      getDistricts(selectedProvince)
        .then(data => setDistricts(data))
        .catch(err => {
          console.error("Error fetching districts:", err);
        });
      setWards([]);
      setSelectedDistrict(null);
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict(null);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      getWards(selectedDistrict)
        .then(data => setWards(data))
        .catch(err => {
          console.error("Error fetching wards:", err);
        });
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);
  return (
    <div>
      <div style={{ textAlign: "center", backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
        <h1
          style={{
            fontSize: "45px",
            fontFamily: "sans-serif",
            fontStyle: "normal",
            fontWeight: 700,
            color: "#00b5f1",
          }}
        >
          Tạo mới hồ sơ
        </h1>
        <Divider size="large" />
      </div>
      <div
        style={{
          backgroundColor: "#E8F2F7",
          borderRadius: "8px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "40px",
        }}
      >

        <style>
          {`
          .centered-alert {
            width: 40%;
             max-width: 90vx;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .centered-alert .ant-alert {
            width: 70%;
          }
          .centered-alert .required-text {
            margin-top: 20px;
          }
        `}
        </style>
        <div className="centered-alert">
          <Alert
            message="Vui lòng cung cấp thông tin chính xác để được phục vụ tốt nhất."
            type="info"
            style={{ fontSize: "15px", width: "100%", textAlign: "center" }}
          />
          <Text className="required-text" style={{ fontSize: "15px" }} type="danger">
            (*) Thông tin bắt buộc nhập
          </Text>
          <Divider orientation="left" className="divider-text" style={{ fontSize: "30px" }} >Thông tin chung</Divider>
          <ConfigProvider locale={viVN}>
            <Form style={{ width: "100%", maxWidth: 800, margin: "0 auto" }} name="createUserProfile" onFinish={handleFinish} layout="vertical">
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="userName"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Họ và tên (có dấu)</span>}
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên!" },

                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      defaultValue={userDefault?.fullName || ""}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="dob"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Ngày tháng năm sinh</span>}
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày tháng năm sinh!" },
                    ]}
                  >
                    <DatePicker
                      defaultValue={dayjs(userDefault?.dob, "DD-MM-YYYY")}
                      prefix={<CalendarOutlined />}
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      size="large"
                      placeholder="Chọn ngày sinh"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="phoneNumber"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Số điện thoại</span>}
                    rules={[
                      { required: true, message: "Vui lòng nhập số điện thoại!" },
                      { pattern: /^0[0-9]{9}$/, message: "Số điện thoại không hợp lệ!" },
                    ]}
                  >
                    <Input
                      defaultValue={userDefault?.phoneNumber || ""}
                      prefix={<PhoneOutlined />}
                      placeholder="Nhập số điện thoại"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="email"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Địa chỉ Email</span>}
                    rules={[
                      { message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input
                      defaultValue={userDefault?.email || ""}
                      prefix={<MailOutlined />} placeholder="Nhập email" size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="gender"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Giới tính</span>}
                    rules={[
                      { required: true, message: "Chọn giới tính ..." },

                    ]}
                  >
                    <Select
                      placeholder="Chọn giới tính ..."
                      size="large"
                      defaultValue={userDefault?.gender !== undefined ? userDefault.gender.toString() : ""}
                    >
                      <Option value="1">Male</Option>
                      <Option value="0">Female</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="job"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Nghề nghiệp (không bắt buộc)</span>}
                  >
                    <Input
                      defaultValue={userDefault?.job || ""}
                      placeholder="Nghề nghiệp của bạn" size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Tỉnh/Thành phố" name="province">
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="Chọn tỉnh/thành phố"
                      options={provinces.map(p => ({ label: p.name, value: p.code }))}
                      onChange={value => setSelectedProvince(value)}
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Quận/Huyện" name="district">
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="Chọn quận/huyện"
                      options={districts.map(d => ({ label: d.name, value: d.code }))}
                      onChange={value => setSelectedDistrict(value)}
                      disabled={!selectedProvince}
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Phường/Xã" name="ward">
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      placeholder="Chọn phường/xã"
                      options={wards.map(w => ({ label: w.name, value: w.code }))}
                      disabled={!selectedDistrict}
                      allowClear
                    />
                  </Form.Item>
                </Col>

              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item label="Số nhà, đường" name="streetAddress">
                    <Input placeholder="Nhập số nhà, tên đường" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item>
                    <Button style={{ width: "100px", height: "40px", fontSize: "18px" }} type="primary" htmlType="submit" size="large">
                      Tạo mới
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

            </Form>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
}

export default CreateProfile;