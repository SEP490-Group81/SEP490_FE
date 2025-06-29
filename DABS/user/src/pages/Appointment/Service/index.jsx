import { current } from "@reduxjs/toolkit";
import { Button, ConfigProvider, Menu, Table } from "antd";
import dayjs from 'dayjs';
import viVN from 'antd/locale/vi_VN';
import { CalendarOutlined, CheckCircleFilled } from '@ant-design/icons';
import "./styles.scss";
import { useState } from "react";
dayjs.locale('vi');


function AppointmentService() {
    const dataSource = [
        {
            key: '1',
            name: 'Khám bệnh tổng quát',
            schedule: 'Lịch khám: Thứ 2, 3, 4, 5, 6, 7, CN',
            price: '200.000 đ',
        },
        {
            key: '2',
            name: 'Khám bệnh chuyên khoa',
            schedule: 'Lịch khám: Thứ 2, 3, 4, 5, 6, 7, CN',
            price: '200.000 đ',
        },
        {
            key: '3',
            name: 'Khám bác sĩ theo yêu cầu',
            schedule: 'Lịch khám: Thứ 2, 3, 4, 5, 6, 7, CN',
            price: '200.000 đ',
        },
         {
            key: '4',
            name: 'Khám chuyên gia',
            schedule: 'Lịch khám: Thứ 2, 3, 4, 5, 6, 7, CN',
            price: '200.000 đ',
        },
    ];

    const columns = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key',
            width: 50,
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <strong>{text}</strong><br />
                    <span style={{ color: '#888', fontSize: 12 }}>{record.schedule}</span>
                </div>
            ),
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price',
            width: 120,
        },
        {
            title: '',
            key: 'action',
            width: 200,
            render: () => (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        type="default"
                        style={{ marginRight: 8, borderRadius: 6, backgroundColor: '#eaf6ff', color: '#00baff', border: 'none' }}
                    >
                        Chi tiết
                    </Button>
                    <Button
                        type="primary"
                        style={{ borderRadius: 6, backgroundColor: '#00cfff', borderColor: '#00cfff' }}
                    >
                        Đặt khám ngay
                    </Button>
                </div>
            ),
        },
    ];

    const items = [
        {
            key: 'center',
            label: <span style={{ fontWeight: 600 }}>Trung Tâm Nội Soi Tiêu Hoá Doctor Check</span>,
            
        },
        {
            key: 'date',
            label: <span style={{ color: '#00bfff', fontWeight: 600 }}>Chọn dịch vụ</span>,
        },
    ];

    return <>

        <div style={{ background: '#eaf8ff', display: "flex", flexDirection: "column" }}>
            <Menu
                mode="horizontal"
                selectedKeys={[current]}
                style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: 16,
                    boxShadow: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 50
                }}
                items={items}
                disabledOverflow
            />
            <ConfigProvider
                locale={viVN}
                theme={{
                    token: {
                        colorPrimary: '#00bfff',
                    },
                    components: {
                        Calendar: {
                            itemActiveBg: '#00bfff',
                            itemActiveColor: '#fff',
                        },
                    },
                }}
            >
                <div className="responsive-container"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: 32,
                        minHeight: '100vh',
                        padding: 40,
                    }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: 16,
                        boxShadow: '0 2px 8px #e6f4ff',
                        width: 340,
                        minWidth: 300,
                        paddingBottom: 24,
                    }}>
                        <div style={{
                            background: 'linear-gradient(90deg, #00bfff 60%, #00eaff 100%)',
                            color: '#fff',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            fontWeight: 600,
                            fontSize: 18,
                            padding: '16px 24px',
                        }}>
                            Thông tin cơ sở y tế
                        </div>
                        <div style={{ padding: '24px 24px 0 24px', fontSize: 15 }}>
                            <div style={{ fontWeight: 600, marginBottom: 8 }}>
                                <CheckCircleFilled style={{ color: '#00bfff', marginRight: 8 }} />
                                Trung Tâm Nội Soi Tiêu Hoá Doctor Check
                            </div>

                            <div style={{ marginBottom: 8 }}>
                                <CalendarOutlined style={{ color: '#00bfff', marginRight: 8 }} />
                                <span style={{ fontWeight: 500 }}>Dịch vụ:</span> Đặt khám dạ dày & đại tràng
                            </div>

                        </div>
                    </div>

                    <div style={{
                        background: '#fff',
                        borderRadius: 16,
                        boxShadow: '0 2px 8px #e6f4ff',
                        width: "auto",
                        maxWidth: 600,
                        paddingBottom: 24,
                    }}>
                        <div style={{
                            background: 'linear-gradient(90deg, #00bfff 60%, #00eaff 100%)',
                            color: '#fff',
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 16,
                            fontWeight: 600,
                            fontSize: 20,
                            padding: '16px 24px',
                            marginBottom: 0,
                        }}>
                            Vui lòng chọn dịch vụ
                        </div>

                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            pagination={false}
                            rowKey="key"
                            style={{ maxHeight: 300, overflowY: 'auto', marginTop: 16, borderRadius: 8, boxShadow: '0 2px 8px #e6f4ff' }}
                        />

                    </div>
                </div>


            </ConfigProvider>
        </div>
    </>
}

export default AppointmentService;