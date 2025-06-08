import { Alert, Divider, Input, Typography, Form, Col, Row, Button, DatePicker, ConfigProvider, Select } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import viVN from "antd/lib/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");
const { Text } = Typography;
function ChangePassword() {
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

          <Divider orientation="left" className="divider-text" style={{ fontSize: "30px" }} >Đổi mật khẩu</Divider>

          <Form style={{ width: "100vh" }} name="createUserProfile" onFinish={handleFinish} layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="oldPassword"
                  label="Mật khẩu cũ"
                  rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
                >
                  <Input.Password
                    prefix={<UserOutlined />}
                    placeholder="Nhập mật khẩu cũ"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập mật khẩu mới"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Form.Item
                  name="confirm"
                  label="Xác nhận mật khẩu"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Nhập lại mật khẩu"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <Button style={{ width: "100px", height: "40px", fontSize: "18px" }} type="primary" htmlType="submit" size="large">
                    Cập nhật
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

        </div>
      </div>
    </>
  );
}

export default ChangePassword;