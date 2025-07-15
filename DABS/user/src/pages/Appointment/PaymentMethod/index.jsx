import { Button, ConfigProvider, Menu, Table } from "antd";
import dayjs from "dayjs";
import viVN from "antd/locale/vi_VN";
import { CalendarOutlined, CheckCircleFilled } from "@ant-design/icons";
import { useState } from "react";
dayjs.locale("vi");

function PaymentMethod({ onNext, defaultValue, infomationValue, onBack }) {
  const [selectedPayment, setSelectedPayment] = useState(defaultValue?.paymentType || null);

  const items = [
    {
      key: "center",
      label: <span style={{ fontWeight: 600 }}>{infomationValue.hospitalName}</span>,
    },
    {
      key: "payment",
      label: <span style={{ color: "#00bfff", fontWeight: 600 }}>Chọn hình thức thanh toán</span>,
    },
  ];

  const paymentOptions = [
    {
      key: "cash",
      type: "Thanh toán tiền mặt tại cơ sở",
      description: "Bạn sẽ thanh toán trực tiếp tại quầy khi đến khám.",
    },
    {
      key: "online",
      type: "Thanh toán online",
      description: "Hỗ trợ thanh toán qua VNPay, Momo, ZaloPay,...",
    },
  ];

  const columns = [
    {
      dataIndex: "type",
      key: "type",
      render: (text, record) => (
        <div>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>{record.description}</div>
        </div>
      ),
    },
  ];

  const handleSubmit = () => {
    if (!selectedPayment) return;
    onNext({ paymentType: selectedPayment });
  };

  return (
    <div style={{ background: "#eaf8ff", display: "flex", flexDirection: "column" }}>
      <Menu
        mode="horizontal"
        selectedKeys={["payment"]}
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
          {/* Bảng thông tin */}
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
                {infomationValue.hospitalName}
              </div>

              <div style={{ marginBottom: 8 }}>
                <CalendarOutlined style={{ color: "#00bfff", marginRight: 8 }} />
                <span style={{ fontWeight: 500 }}>Dịch vụ:</span> {infomationValue.serviceName}
              </div>
            </div>
          </div>

          {/* Bảng chọn hình thức thanh toán */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 8px #e6f4ff",
              width: "auto",
              maxWidth: 600,
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
                fontSize: 20,
                padding: "16px 24px",
                marginBottom: 0,
              }}
            >
              Vui lòng chọn hình thức thanh toán
            </div>

            <Table
              dataSource={paymentOptions}
              columns={columns}
              pagination={false}
              rowKey="key"
              style={{
                marginTop: 16,
                borderRadius: 8,
                boxShadow: "0 2px 8px #e6f4ff",
              }}
              onRow={(record) => ({
                onClick: () => setSelectedPayment(record.key),
              })}
              rowClassName={(record) =>
                record.key === selectedPayment ? "selected-payment-row" : ""
              }
            />

            {/* Nút điều hướng */}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 16px", marginTop: 24 }}>
              <Button
                onClick={onBack}
                style={{
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  backgroundColor: "#f9f9f9",
                }}
              >
                ← Quay lại
              </Button>

              <Button
                type="primary"
                disabled={!selectedPayment}
                onClick={handleSubmit}
                style={{
                  borderRadius: 6,
                  backgroundColor: "#00cfff",
                  borderColor: "#00cfff",
                }}
              >
                Tiếp tục →
              </Button>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
}

export default PaymentMethod;
