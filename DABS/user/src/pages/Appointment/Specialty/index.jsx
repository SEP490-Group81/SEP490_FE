import { current } from "@reduxjs/toolkit";
import { Button, ConfigProvider, Descriptions, Menu, Table } from "antd";
import dayjs from 'dayjs';
import viVN from 'antd/locale/vi_VN';
import { CalendarOutlined, CheckCircleFilled } from '@ant-design/icons';
import "./styles.scss";
import { useState } from "react";
import Search from "antd/es/transfer/search";
dayjs.locale('vi');


function AppointmentSpecialty() {
    const [searchText, setSearchText] = useState('');
    const specialtiesData = [
        {
            id: 'sp1',
            name: 'Nội khoa',
            description: 'Chuyên khoa Nội khoa tập trung khám và điều trị các bệnh lý liên quan đến các cơ quan nội tạng như tim, phổi, gan, thận, tiêu hóa, huyết học,...',
        },
        {
            id: 'sp2',
            name: 'Ngoại khoa',
            description: 'Chuyên khoa Ngoại khoa thực hiện các phẫu thuật và can thiệp ngoại khoa trên các bộ phận như xương khớp, thần kinh, tiêu hóa, tiết niệu,...',
        },
        {
            id: 'sp3',
            name: 'Sản phụ khoa',
            description: 'Chuyên khoa Sản phụ khoa chuyên về chăm sóc sức khỏe sinh sản, khám thai, điều trị các bệnh lý phụ khoa và hỗ trợ sinh sản.',
        },
        {
            id: 'sp4',
            name: 'Nhi khoa',
            description: 'Chuyên khoa Nhi khoa chuyên khám và điều trị các bệnh lý ở trẻ em từ sơ sinh đến vị thành niên.',
        },
        {
            id: 'sp5',
            name: 'Tai mũi họng (TMH)',
            description: 'Chuyên khoa Tai mũi họng chuyên về các bệnh lý liên quan đến tai, mũi, họng và các vùng lân cận.',
        },
        {
            id: 'sp6',
            name: 'Răng hàm mặt',
            description: 'Chuyên khoa Răng hàm mặt tập trung điều trị các bệnh lý về răng, nướu, hàm và mặt, bao gồm nha khoa thẩm mỹ và chỉnh nha.',
        },
        {
            id: 'sp7',
            name: 'Chẩn đoán hình ảnh',
            description: 'Chuyên khoa Chẩn đoán hình ảnh cung cấp các dịch vụ siêu âm, X-quang, CT-Scan, MRI để hỗ trợ chẩn đoán bệnh lý.',
        },
        {
            id: 'sp8',
            name: 'Xét nghiệm',
            description: 'Chuyên khoa Xét nghiệm thực hiện các xét nghiệm huyết học, sinh hóa, vi sinh,... giúp đánh giá tình trạng sức khỏe và hỗ trợ chẩn đoán.',
        },
    ];

    const columns = [
        {
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div>
                    <strong style={{ textTransform: 'uppercase' }}>{text}</strong>
                    <div style={{ fontStyle: 'italic', color: '#3b4a5a', marginTop: 4, fontSize: 12 }}>
                        {record.description}
                    </div>
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
            label: <span style={{ color: '#00bfff', fontWeight: 600 }}>Chọn chuyên khoa</span>,
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
                                <span style={{ fontWeight: 500 }}>Dịch vụ:</span> Khám chuyên khoa
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
                            Vui lòng chọn chuyên khoa
                        </div>
                        <div style={{ padding: '20px 16px 0px 16px' }}>
                            <Search
                                placeholder="Tìm kiếm theo tên chuyên khoa"
                                onChange={e => setSearchText(e.target.value)}

                                allowClear
                            />
                        </div>
                        <Table
                            dataSource={specialtiesData}
                            pagination={false}
                            rowKey="key"
                            style={{ maxHeight: 300, overflowY: 'auto', marginTop: 16, borderRadius: 8, boxShadow: '0 2px 8px #e6f4ff' }}
                            columns={columns}
                        />

                    </div>
                </div>


            </ConfigProvider>
        </div>
    </>
}

export default AppointmentSpecialty;