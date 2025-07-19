import { Button, ConfigProvider, Menu, message } from "antd";
import viVN from "antd/locale/vi_VN";
import {
    CalendarOutlined,
    CheckCircleFilled,
    UserOutlined,
    DollarOutlined,
    SolutionOutlined,
    TeamOutlined,
    EnvironmentOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import "./styles.scss";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getHospitalDetail } from "../../../services/hospitalService";
import { createBookAppointment } from "../../../services/appointmentService";
import { clearMessage, setMessage } from "../../../redux/slices/messageSlice";
dayjs.locale("vi");


function AppointmentReviewPage() {
    const user = useSelector((state) => state.user.user);
    console.log("user in accept payment : " + JSON.stringify(user));
    const [hospital, setHospital] = useState();
    const location = useLocation();
    const { stepData } = location.state || {};
    const [messageApi, contextHolder] = message.useMessage();
    const messageState = useSelector((state) => state.message)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log("meta in accept : " + JSON.stringify(stepData));

    useEffect(() => {
        const fetchApi = async () => {
            const result = await getHospitalDetail(stepData?.hospitalId);
            setHospital(result);
        };
        fetchApi();
    }, [stepData?.hospitalId]);

    useEffect(() => {
        if (messageState) {
            messageApi.open({
                type: messageState.type,
                content: messageState.content,

            });
            dispatch(clearMessage());
        }
    }, [messageState, dispatch]);

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

    const iconStyle = {
        color: "#00bfff",
        marginRight: 8,
        fontSize: 18,
    };

    const handleBackToPayment = () => {
        navigate("/appointment/booking" +
            `?hospitalId=${stepData?.hospitalId}&serviceId=${stepData?.serviceId}&serviceName=${stepData?.serviceName}&hospitalName=${stepData?.hospitalName}`,
            { state: { stepData: stepData, backToStepIndex: 3 } }
        );
    };

    const handleConfirmBooking = async () => {
        try {
            const payload = {
                hospitalId: Number(stepData.hospitalId),
                serviceId: Number(stepData.serviceId),
                specializationId: Number(stepData.specialty?.id || 0),
                doctorId: Number(stepData.doctor?.id || 0),
                appointmentDate: dayjs(stepData.date).toISOString(),
                bookingTime: stepData.shift === "morning" ? 1 : 2,
                paymentMethod: stepData.paymentType === "cash" ? 1 : 5,
                note: "",
            };
            console.log("pay load in booking confirm : " + JSON.stringify(payload));
            await createBookAppointment(payload);
            dispatch(setMessage({ type: 'success', content: 'Đặt khám thành công! ' }));
        } catch (error) {
             dispatch(setMessage({ type: 'error', content: 'Đặt khám thất bại. Vui lòng thử lại! ' }));
        }
    };
    return (
        <>
            {contextHolder}
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
                                <div style={{ fontSize: 15 }}>

                                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                                        <CheckCircleFilled style={{ color: "#00bfff", marginRight: 8 }} />
                                        {hospital?.name || "Không rõ"}
                                    </div>

                                    <div style={{ marginBottom: 8 }}>
                                        <EnvironmentOutlined style={{ color: "#00bfff", marginRight: 8 }} />
                                        <span style={{ fontWeight: 500 }}>Địa chỉ:</span> {hospital?.address || "Không rõ"}
                                    </div>


                                </div>

                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", marginBottom: 50 }}>
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
                                    {[
                                        {
                                            icon: <SolutionOutlined style={iconStyle} />,
                                            label: "Dịch vụ",
                                            value: stepData?.serviceName || "Không rõ",
                                        },
                                        stepData?.specialty && {
                                            icon: <TeamOutlined style={iconStyle} />,
                                            label: "Chuyên khoa",
                                            value: stepData.specialty.name || "Không rõ",
                                        },
                                        stepData?.doctor && {
                                            icon: <UserOutlined style={iconStyle} />,
                                            label: "Bác sĩ",
                                            value: stepData.doctor?.user?.fullname || "Không rõ",
                                        },
                                        {
                                            icon: <CalendarOutlined style={iconStyle} />,
                                            label: "Ngày khám",
                                            value: (
                                                <>
                                                    {stepData?.date || "Không rõ"} (
                                                    <span style={{ fontWeight: 500 }}>
                                                        {stepData?.shift === 'morning' ? 'Buổi sáng' : 'Buổi chiều'}
                                                    </span>
                                                    )
                                                </>
                                            ),
                                        },
                                        {
                                            icon: <DollarOutlined style={iconStyle} />,
                                            label: "Thanh toán",
                                            value:
                                                stepData?.paymentType === 'cash'
                                                    ? 'Tiền mặt tại cơ sở'
                                                    : stepData?.paymentType === 'online'
                                                        ? 'Thanh toán online'
                                                        : 'Chưa chọn',
                                        },
                                    ]
                                        .filter(Boolean)
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: 8,
                                                    fontSize: 16,
                                                }}
                                            >
                                                {item.icon}
                                                <span style={{ fontWeight: 500, marginRight: 4 }}>{item.label}:</span>
                                                <span>{item.value}</span>
                                            </div>
                                        ))}
                                </div>

                                <div
                                    style={{
                                        borderTop: "1px solid #eee",
                                        margin: "0 24px 16px",
                                    }}
                                />

                                <div style={{ padding: "0 24px" }}>
                                    <h4 style={{ fontWeight: 600, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span>
                                            <UserOutlined style={{ color: "#00bfff", marginRight: 8 }} />
                                            Thông tin cá nhân
                                        </span>
                                        <Button
                                            type="link"
                                            onClick={() => navigate("/profile")}
                                            icon={<EyeOutlined />}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </h4>
                                    <p><strong>Họ tên:</strong> {user?.fullname || "..."}</p>
                                    <p><strong>Email:</strong> {user?.email || "..."}</p>
                                    <p><strong>Số điện thoại:</strong> {user?.phoneNumber || "..."}</p>
                                    <p><strong>Mã định danh/CCCD:</strong> {user?.cccd || "..."}</p>
                                </div>

                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Button
                                    onClick={handleBackToPayment}
                                    style={{
                                        borderRadius: 6,
                                        border: "1px solid #ccc",
                                        backgroundColor: "#f9f9f9",
                                        marginTop: 30
                                    }}
                                >
                                    ← Quay lại
                                </Button>

                                <Button
                                    type="primary"
                                    onClick={handleConfirmBooking}
                                    style={{
                                        borderRadius: 6,
                                        backgroundColor: "#00cfff",
                                        borderColor: "#00cfff",
                                        marginTop: 30
                                    }}
                                >
                                    Xác nhận đặt khám
                                </Button>
                            </div>
                        </div>
                    </div>
                </ConfigProvider>
            </div>
        </>
    );
}

export default AppointmentReviewPage;
