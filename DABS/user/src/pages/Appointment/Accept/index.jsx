import { Button, ConfigProvider, Menu } from "antd";
import viVN from "antd/locale/vi_VN";
import {
    CalendarOutlined,
    CheckCircleFilled,
    UserOutlined,
    DollarOutlined,
    SolutionOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

dayjs.locale("vi");

function AppointmentReviewPage() {
    const location = useLocation();
    const { stepData } = location.state || {};

    console.log("meta in accept : " + JSON.stringify(stepData));
    const items = [
        {
            key: "center",
            label: <span style={{ fontWeight: 600 }}>{stepData?.hospitalName || "Không rõ"}</span>,
        },
        {
            key: "review",
            label: (
                <span style={{ color: "#00bfff", fontWeight: 600 }}>
                    Xác nhận thông tin khám
                </span>
            ),
        },
    ];

    const getShiftText = (shift) => {
        if (shift === "morning") return "Buổi sáng";
        if (shift === "afternoon") return "Buổi chiều";
        return "Không xác định";
    };

    const getPaymentText = (type) => {
        if (type === "cash") return "Thanh toán tại cơ sở";
        if (type === "online") return "Thanh toán online";
        return "Không xác định";
    };

    return (
        <div style={{ background: "#eaf8ff", display: "flex", flexDirection: "column" }}>
            <Menu
                mode="horizontal"
                selectedKeys={["review"]}
                style={{
                    background: "transparent",
                    border: "none",
                    fontSize: 16,
                    boxShadow: "none",
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 50,
                }}
                items={items}
                disabledOverflow
            />

            <ConfigProvider locale={viVN}>
                <div
                    className="responsive-container"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        marginBottom: 50,
                        gap: 32,
                        padding: 40,
                    }}
                >
                    {/* Cơ sở y tế */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 2px 8px #e6f4ff",
                            width: 340,
                            minWidth: 300,
                            paddingBottom: 24,
                        }}
                    >
                        <div
                            style={{
                                background: "linear-gradient(90deg, #00bfff 60%, #00eaff 100%)",
                                color: "#fff",
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                fontWeight: 600,
                                fontSize: 18,
                                padding: "16px 24px",
                            }}
                        >
                            Thông tin cơ sở y tế
                        </div>

                        <div style={{ padding: "24px 24px 0 24px", fontSize: 15 }}>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>
                                <CheckCircleFilled style={{ color: "#00bfff", marginRight: 8 }} />
                                {stepData?.hospitalName || "Không rõ"}
                            </div>

                            <div style={{ marginBottom: 8 }}>
                                <CalendarOutlined style={{ color: "#00bfff", marginRight: 8 }} />
                                <span style={{ fontWeight: 500 }}>Thời gian:</span>{" "}
                                {stepData?.[3]?.date} - {getShiftText(stepData?.[3]?.shift)}
                            </div>
                        </div>
                    </div>

                    {/* Thông tin khám */}
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            boxShadow: "0 2px 8px #e6f4ff",
                            width: "auto",
                            paddingBottom: 24,
                            minWidth: 600,
                        }}
                    >
                        <div
                            style={{
                                background: "linear-gradient(90deg, #00bfff 60%, #00eaff 100%)",
                                color: "#fff",
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                fontWeight: 600,
                                fontSize: 20,
                                padding: "16px 24px",
                                marginBottom: 0,
                            }}
                        >
                            Xác nhận thông tin khám
                        </div>

                        <div style={{ padding: "24px" }}>
                            <p>
                                <SolutionOutlined style={{ color: "#00bfff", marginRight: 8 }} />
                                <strong>Dịch vụ:</strong> {stepData?.serviceName || "Không rõ"}
                            </p>
                            <p>
                                <TeamOutlined style={{ color: "#00bfff", marginRight: 8 }} />
                                <strong>Chuyên khoa:</strong> {stepData?.[1]?.specialty?.name || "Không rõ"}
                            </p>
                            <p>
                                <UserOutlined style={{ color: "#00bfff", marginRight: 8 }} />
                                <strong>Bác sĩ:</strong> {stepData?.[2]?.doctor?.user?.fullname || "Không rõ"}
                            </p>
                            <p>
                                <CalendarOutlined style={{ color: "#00bfff", marginRight: 8 }} />
                                <strong>Thời gian:</strong> {stepData?.[3]?.date} - {getShiftText(stepData?.[3]?.shift)}
                            </p>
                            <p>
                                <DollarOutlined style={{ color: "#00bfff", marginRight: 8 }} />
                                <strong>Phương thức thanh toán:</strong> {getPaymentText(stepData?.[4]?.paymentType)}
                            </p>
                        </div>

                        <div
                            style={{
                                borderTop: "1px solid #eee",
                                margin: "0 24px 16px",
                            }}
                        />

                        <div style={{ padding: "0 24px" }}>
                            <h4 style={{ fontWeight: 600, marginBottom: 16 }}>
                                <UserOutlined style={{ color: "#00bfff", marginRight: 8 }} />
                                Thông tin cá nhân
                            </h4>
                            <p><strong>Họ tên:</strong> {stepData?.user?.fullname || "..."}</p>
                            <p><strong>Email:</strong> {stepData?.user?.email || "..."}</p>
                            <p><strong>Số điện thoại:</strong> {stepData?.user?.phoneNumber || "..."}</p>
                        </div>

                        <div style={{ padding: "0 24px", marginTop: 24 }}>
                            <Button
                                type="primary"
                                style={{
                                    width: "100%",
                                    borderRadius: 8,
                                    backgroundColor: "#00cfff",
                                    borderColor: "#00cfff",
                                    fontWeight: 600,
                                }}
                                onClick={() => {
                                    console.log("🟦 Gửi dữ liệu đặt khám:", stepData);

                                }}
                            >
                                Xác nhận & Đặt khám
                            </Button>
                        </div>
                    </div>
                </div>
            </ConfigProvider>
        </div>
    );
}

export default AppointmentReviewPage;
