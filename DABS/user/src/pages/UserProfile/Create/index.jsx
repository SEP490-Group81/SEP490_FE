import { Alert, Divider, Input, Typography, Form, Col, Row, Button, DatePicker, ConfigProvider, Select } from "antd";
import { UserOutlined, CalendarOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import viVN from "antd/lib/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
const { Text } = Typography;
function CreateProfile() {
  const { Option } = Select;
  const handleFinish = (values) => {
    console.log("Form values:", values);
  };
  return (
    <>
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
            min-width: 1000px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
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
            style={{ fontSize: "15px" }}
          />
          <Text className="required-text" style={{ fontSize: "15px" }} type="danger">
            (*) Thông tin bắt buộc nhập
          </Text>
          <Divider orientation="left" className="divider-text" style={{ fontSize: "30px" }} >Thông tin chung</Divider>
          <ConfigProvider locale={viVN}>
            <Form style={{ width: "100vh" }} name="createUserProfile" onFinish={handleFinish} layout="vertical">
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
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col  xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="dob"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Ngày tháng năm sinh</span>}
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày tháng năm sinh!" },
                    ]}
                  >
                    <DatePicker
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
                <Col  xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="phoneNumber"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Số điện thoại</span>}
                    rules={[
                      { required: true, message: "Vui lòng nhập số điện thoại!" },
                      { pattern: /^0[0-9]{9}$/, message: "Số điện thoại không hợp lệ!" },
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="Nhập số điện thoại"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col  xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="email"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Địa chỉ Email</span>}
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Email không hợp lệ!" },
                    ]}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Nhập email" size="large" />
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
                    <Select placeholder="Chọn giới tính ..." size="large">
                      <Option value="true">Male</Option>
                      <Option value="false">Female</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col  xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="job"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Nghề nghiệp (không bắt buộc)</span>}
                  >
                    <Input placeholder="Nghề nghiệp của bạn" size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>

                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Form.Item
                    name="address"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Nơi ở hiện tại (không bắt buộc)</span>}
                  >
                    <Input placeholder="Nơi ở của bạn" size="large" />
                  </Form.Item>
                </Col>
              </Row>
              <Row >
                <Col span={24}>
                  <Form.Item
                    name="symptoms"
                    label={<span style={{ fontSize: "17px", fontWeight: "bold" }}>Triệu chứng hiện tại (không bắt buộc)</span>}
                  >
                    <Input.TextArea rows={4} placeholder="Nhập mô tả triệu chứng của bạn..." />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item>
                    <Button style={{width: "100px", height:"40px", fontSize: "18px"}} type="primary" htmlType="submit" size="large">
                      Tạo mới
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

            </Form>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
}

export default CreateProfile;