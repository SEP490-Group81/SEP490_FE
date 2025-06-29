import { current } from "@reduxjs/toolkit";
import { Button, Calendar, ConfigProvider, Menu } from "antd";
import dayjs from 'dayjs';
import viVN from 'antd/locale/vi_VN';
import { LeftOutlined, EnvironmentOutlined, CalendarOutlined, SolutionOutlined, CheckCircleFilled, RightOutlined } from '@ant-design/icons';
import { useState } from "react";
import "./styles.scss";
dayjs.locale('vi');


function AppointmentSchedule() {

    const items = [
        {
            key: 'center',
            label: <span style={{ fontWeight: 600 }}>Trung Tâm Nội Soi Tiêu Hoá Doctor Check</span>,
        },
        {
            key: 'date',
            label: <span style={{ color: '#00bfff', fontWeight: 600 }}>Chọn ngày khám</span>,
        },
    ];
    const [selectedDate, setSelectedDate] = useState(dayjs('2025-07-03'));
    const [selectedShift, setSelectedShift] = useState(null);
    const handleSelect = (date) => {
        setSelectedDate(date);
        setSelectedShift(null);
    };
    return <>

        <div style={{  background: '#eaf8ff', display:"flex", flexDirection:"column" }}>
            <Menu
                mode="horizontal"
                selectedKeys={[current]}
                style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: 16,
                    boxShadow: 'none',
                    display:'flex',
                    justifyContent:'center',
                    marginTop:50
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
                            <div style={{ color: '#777', marginBottom: 16 }}>
                                <EnvironmentOutlined style={{ color: '#00bfff', marginRight: 8 }} />
                                429 Tô Hiến Thành, Phường 14, Quận 10, Thành phố Hồ Chí Minh
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <SolutionOutlined style={{ color: '#00bfff', marginRight: 8 }} />
                                <span style={{ fontWeight: 500 }}>Chuyên khoa:</span> Đặt khám dạ dày & đại tràng
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <CalendarOutlined style={{ color: '#00bfff', marginRight: 8 }} />
                                <span style={{ fontWeight: 500 }}>Dịch vụ:</span> Đặt khám dạ dày & đại tràng
                            </div>
                            <div>
                                <CalendarOutlined style={{ color: '#00bfff', marginRight: 8 }} />
                                <span style={{ fontWeight: 500 }}>Ngày khám:</span> {selectedDate.format('DD/MM/YYYY')}
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
                            Vui lòng chọn ngày khám
                        </div>
                        <div style={{ padding: '24px 24px 0 24px' }}>
                            <Calendar
                                fullscreen={false}
                                value={selectedDate}
                                onSelect={handleSelect}
                                headerRender={({ value, onChange }) => (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8,
                                    }}>
                                        <LeftOutlined
                                            style={{ color: '#00bfff', fontSize: 18, cursor: 'pointer', marginRight: 12 }}
                                            onClick={() => onChange(value.subtract(1, 'month'))}
                                        />
                                        <span style={{ color: '#00bfff', fontWeight: 600, fontSize: 18, marginRight: 12 }}>
                                            THÁNG {value.format('MM-YYYY')}
                                        </span>
                                        <RightOutlined
                                            style={{ color: "#00bfff", fontSize: 18, cursor: "pointer" }}
                                            onClick={() => onChange(value.add(1, "month"))}
                                        />
                                    </div>
                                )}
                                locale={viVN}
                                dateFullCellRender={date => {
                                    const isSelected = date.isSame(selectedDate, 'date');
                                    const day = date.day();
                                    let color = undefined;
                                    if (day === 0) color = '#ff4d4f';
                                    if (day === 6) color = '#faad14';
                                    return (
                                        <div style={{
                                            width: "100%", height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            borderRadius: 8,
                                            background: isSelected ? '#00bfff' : undefined,
                                            color: isSelected ? '#fff' : color,
                                            fontWeight: isSelected ? 700 : 500,
                                            border: isSelected ? 'none' : '1px solid #e6f4ff',
                                            cursor: 'pointer',
                                        }}>
                                            {date.date().toString().padStart(2, '0')}
                                        </div>
                                    );
                                }}
                                monthCellRender={() => null}
                            />
                        </div>

                        {selectedDate && (
                            <div style={{ marginTop: 32, padding: '0 24px' }}>
                                <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 16 }}>
                                    Chọn ca khám
                                </div>
                                <div style={{ display: 'flex', gap: 24 }}>
                                    <Button
                                        type={selectedShift === 'morning' ? "primary" : "default"}
                                        style={{
                                            border: '2px solid #00bfff',
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            color: selectedShift === 'morning' ? '#fff' : '#00bfff',
                                            background: selectedShift === 'morning' ? '#00bfff' : '#fff',
                                            width: 140,
                                            height: 48,
                                        }}
                                        onClick={() => setSelectedShift('morning')}
                                    >
                                        Buổi sáng
                                    </Button>
                                    <Button
                                        type={selectedShift === 'afternoon' ? "primary" : "default"}
                                        style={{
                                            border: '2px solid #00bfff',
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            color: selectedShift === 'afternoon' ? '#fff' : '#00bfff',
                                            background: selectedShift === 'afternoon' ? '#00bfff' : '#fff',
                                            width: 140,
                                            height: 48,
                                        }}
                                        onClick={() => setSelectedShift('afternoon')}
                                    >
                                        Buổi chiều
                                    </Button>
                                </div>
                                <div style={{ color: '#faad14', fontSize: 13, marginTop: 16 }}>
                                    Tất cả thời gian theo múi giờ Việt Nam GMT +7
                                </div>
                            </div>
                        )}
                    </div>
                </div>
             
            
            </ConfigProvider>
        </div>
    </>
}

export default AppointmentSchedule;