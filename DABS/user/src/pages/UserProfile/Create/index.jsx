import { Alert, Divider, Typography } from "antd";
const { Text } = Typography;
function CreateProfile() {
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
          <Divider className="divider-text" style={{ fontSize: "25px" }} >Thông tin chung</Divider>
        </div>
      </div>
    </>
  );
}

export default CreateProfile;