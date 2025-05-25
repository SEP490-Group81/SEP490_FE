import { Outlet } from "react-router-dom";
import { Button, Layout } from 'antd';
import "./style.scss";
import { UserOutlined, CaretDownOutlined, TikTokOutlined, FacebookOutlined, YoutubeOutlined } from '@ant-design/icons';

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
                        <ul>

                            <li>
                                <div className="header__content__bottom__support">
                                    <a href="/">Hỗ trợ đặt khám</a>
                                </div>
                            </li>
                            <li>
                                <div className="header__content__bottom__content-component-1">
                                    <a href="/">Cơ sở y tế</a>
                                    <div><CaretDownOutlined /></div>
                                </div>
                            </li>
                            <li>
                                <div className="header__content__bottom__content-component-2">
                                    <a href="/">Dịch vụ y tế</a>
                                    <div><CaretDownOutlined /></div>
                                </div>
                            </li>
                            <li>
                                <div className="header__content__bottom__content-component-3">
                                    <a href="/">Khám sức khoẻ doanh nghiệp</a>
                                </div>
                            </li>
                            <li>
                                <div className="header__content__bottom__content-component-3">
                                    <a href="/">Tin tức</a>
                                    <div><CaretDownOutlined /></div>
                                </div>
                            </li>
                            <li>
                                <div className="header__content__bottom__content-component-3">
                                    <a href="/">Hướng dẫn</a>
                                    <div><CaretDownOutlined /></div>
                                </div>
                            </li>
                            <li>
                                <div className="header__content__bottom__content-component-3">
                                    <a href="/">Liên hệ hợp tác</a>
                                    <div><CaretDownOutlined /></div>
                                </div>
                            </li>

                        </ul>



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