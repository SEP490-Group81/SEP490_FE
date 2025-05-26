import { Outlet } from "react-router-dom";
import { Button, Layout } from 'antd';
import "./style.scss";
import { UserOutlined, CaretDownOutlined, TikTokOutlined, FacebookOutlined, YoutubeOutlined,MenuOutlined } from '@ant-design/icons';
import { Menu } from "antd";

const { SubMenu } = Menu;
const { Header, Footer } = Layout;
function LayoutCommon() {
    return <>
        <Layout className="layout-default">
            <Header className="header">

                <div className="header__logo">
                    DABS
                </div>
                <div className="header__content">
                    <div className="header__content__top">
                        <div className="header__content__top__network">

                            <div className="header__content__top__network__tiktok">
                                <TikTokOutlined /> Tiktok
                            </div>
                            <div className="header__content__top__network__facebook">
                                <FacebookOutlined />   Facebook
                            </div>
                            <div className="header__content__top__network__youtube">
                                <YoutubeOutlined />  Youtube
                            </div>

                        </div>
                        <div className="header__content__top__wrapper">
                            <div className="header__content__top__wrapper__account">
                                <Button type="primary"><UserOutlined />Tài khoản</Button>
                            </div>
                        </div>

                    </div>
                    <div className="header__content__bottom">
                        <Menu
                         mode="horizontal" 
                        overflowedIndicator= {<MenuOutlined/>}
                        >
                            <Menu.Item key="support">
                                <a href="/">Hỗ trợ đặt khám</a>
                            </Menu.Item>

                            <SubMenu
                                key="medical-facilities"
                                title={
                                    <span>
                                        Cơ sở y tế <CaretDownOutlined />
                                    </span>
                                }
                            >
                                <Menu.Item key="facility-1">Cơ sở 1</Menu.Item>
                                <Menu.Item key="facility-2">Cơ sở 2</Menu.Item>
                            </SubMenu>

                            <SubMenu
                                key="medical-services"
                                title={
                                    <span>
                                        Dịch vụ y tế <CaretDownOutlined />
                                    </span>
                                }
                            >
                                <Menu.Item key="service-1">Dịch vụ 1</Menu.Item>
                                <Menu.Item key="service-2">Dịch vụ 2</Menu.Item>
                            </SubMenu>

                            <Menu.Item key="enterprise-health">
                                <a href="/">Khám sức khoẻ doanh nghiệp</a>
                            </Menu.Item>

                            <SubMenu
                                key="news"
                                title={
                                    <span>
                                        Tin tức <CaretDownOutlined />
                                    </span>
                                }
                            >
                                <Menu.Item key="news-1">Tin 1</Menu.Item>
                                <Menu.Item key="news-2">Tin 2</Menu.Item>
                            </SubMenu>

                            <SubMenu
                                key="guide"
                                title={
                                    <span>
                                        Hướng dẫn <CaretDownOutlined />
                                    </span>
                                }
                            >
                                <Menu.Item key="guide-1">Hướng dẫn 1</Menu.Item>
                                <Menu.Item key="guide-2">Hướng dẫn 2</Menu.Item>
                            </SubMenu>

                            <SubMenu
                                key="contact"
                                title={
                                    <span>
                                        Liên hệ hợp tác <CaretDownOutlined />
                                    </span>
                                }
                            >
                                <Menu.Item key="contact-1">Liên hệ 1</Menu.Item>
                                <Menu.Item key="contact-2">Liên hệ 2</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </div>
                </div>

            </Header>
            <main>

                <div className="layout-default-main">
                    <Outlet />
                </div>

            </main>
            <Footer className="footer">
                Ant Design ©{new Date().getFullYear()} Created by G81
            </Footer>
        </Layout>
        <Outlet />
    </>
}

export default LayoutCommon;