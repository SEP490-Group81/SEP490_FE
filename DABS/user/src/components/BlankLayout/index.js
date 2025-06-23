import { Space } from "antd";
import { Outlet } from "react-router-dom";
import loginBg from "../../assets/images/login-bgr.png";
import loginDoctor from "../../assets/images/doctor-login.png";
const BlankLayout = () => {
  return (
     <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                background: `#E8F4FD`,
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#e0f7fa",
            }}
        >
            <Space direction="horizontal" size={10}>
                <div
                    style={{
                        width: 400, 
                        height: 500,
                        overflow: "hidden",
                        borderRadius: 16,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                        marginRight: 0,
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <img
                        src={loginDoctor}
                        alt="doctor"
                        style={{
                            height: 500,
                            marginLeft: -175,
                        }}
                    />
                </div>
                <Outlet /> 
            </Space>
        </div>
  
  );
};

export default BlankLayout;
