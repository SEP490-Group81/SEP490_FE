import React, { useState, useRef, useEffect } from 'react';
import { Layout, Typography, Row, Col, Button, Input, Avatar, Badge, Card, Divider } from 'antd';
import {
    SendOutlined,
    RobotOutlined,
    UserOutlined,
    QuestionCircleOutlined,
    ClockCircleOutlined,
    BookOutlined,
    HeartOutlined
} from '@ant-design/icons';
import './ChatPage.scss';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const ChatPage = () => {
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: 'Xin chào! Tôi là DABS Assistant. Tôi có thể giúp gì cho bạn hôm nay?',
            time: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Focus vào input khi trang được load
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            sendMessage();
        }
    };

    const sendMessage = () => {
        if (input.trim()) {
            // Thêm tin nhắn của người dùng
            const newMessages = [...messages, {
                type: 'user',
                content: input.trim(),
                time: new Date()
            }];

            setMessages(newMessages);
            setInput('');

            // Mô phỏng phản hồi từ bot sau một khoảng thời gian
            setTimeout(() => {
                const botResponse = getBotResponse(input);
                setMessages([...newMessages, {
                    type: 'bot',
                    content: botResponse,
                    time: new Date()
                }]);
            }, 1000);
        }
    };

    // Hàm xử lý phản hồi đơn giản từ bot (thay thế bằng API thực tế sau này)
    const getBotResponse = (userInput) => {
        const input = userInput.toLowerCase();

        if (input.includes('xin chào') || input.includes('hello') || input.includes('hi')) {
            return 'Xin chào! Tôi có thể giúp gì cho bạn?';
        } else if (input.includes('đặt khám') || input.includes('đặt lịch')) {
            return 'Để đặt lịch khám bệnh, bạn có thể vào mục "Đặt khám" trên trang chủ hoặc truy cập vào đường dẫn sau: /dat-kham';
        } else if (input.includes('bác sĩ') || input.includes('doctor')) {
            return 'Hiện nay DABS có liên kết với nhiều bác sĩ giỏi từ nhiều chuyên khoa. Bạn có thể xem thông tin các bác sĩ trong mục "Cơ sở y tế" > "Đội ngũ bác sĩ"';
        } else if (input.includes('giờ làm việc') || input.includes('thời gian')) {
            return 'Thời gian làm việc của chúng tôi là từ 7:30 - 17:00 từ thứ 2 đến thứ 7, Chủ nhật từ 7:30 - 12:00';
        } else if (input.includes('liên hệ') || input.includes('hotline')) {
            return 'Bạn có thể liên hệ với chúng tôi qua hotline: 1900 1234 hoặc email: contact@dabs.com.vn';
        } else if (input.includes('cảm ơn')) {
            return 'Không có gì! Rất vui được hỗ trợ bạn. Bạn còn câu hỏi nào khác không?';
        } else {
            return 'Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể nói rõ hơn hoặc liên hệ trực tiếp với nhân viên hỗ trợ qua hotline: 1900 1234.';
        }
    };

    // Format timestamp
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Danh sách câu hỏi gợi ý
    const suggestedQuestions = [
        { icon: <QuestionCircleOutlined />, text: 'Cách đặt lịch khám?' },
        { icon: <ClockCircleOutlined />, text: 'Giờ làm việc?' },
        { icon: <BookOutlined />, text: 'Có những chuyên khoa nào?' },
        { icon: <HeartOutlined />, text: 'Làm thế nào để tạo hồ sơ bệnh nhân?' },
    ];

    return (
        <Content className="chat-page-container">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={16} lg={16} className="chat-main-col">
                    <Card className="chat-card">
                        <div className="chat-header">
                            <Avatar icon={<RobotOutlined />} className="bot-avatar" size={42} />
                            <div className="header-info">
                                <Title level={4} className="bot-name">DABS Assistant</Title>
                                <div className="bot-status">
                                    <Badge status="success" />
                                    <span>Trực tuyến</span>
                                </div>
                            </div>
                        </div>

                        <Divider className="chat-divider" />

                        <div className="chat-messages">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
                                >
                                    {message.type === 'bot' && (
                                        <Avatar
                                            icon={<RobotOutlined />}
                                            className="message-avatar"
                                            size="default"
                                        />
                                    )}

                                    <div className="message-content">
                                        <div className="message-bubble">
                                            {message.content}
                                        </div>
                                        <div className="message-time">
                                            {formatTime(message.time)}
                                        </div>
                                    </div>

                                    {message.type === 'user' && (
                                        <Avatar
                                            icon={<UserOutlined />}
                                            className="message-avatar"
                                            size="default"
                                        />
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} /> {/* Dùng để auto-scroll */}
                        </div>

                        <div className="chat-input">
                            <Input
                                placeholder="Nhập câu hỏi của bạn..."
                                value={input}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                size="large"
                                ref={inputRef}
                                suffix={
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        onClick={sendMessage}
                                        disabled={!input.trim()}
                                        className="send-button"
                                    >
                                        Gửi
                                    </Button>
                                }
                            />
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={8} lg={8}>
                    <Card className="info-card">
                        <Title level={4}>Hỏi đáp y tế</Title>
                        <Paragraph>
                            Trợ lý ảo DABS Assistant có thể giúp bạn trả lời các câu hỏi thông thường về dịch vụ y tế,
                            đặt khám và thông tin về bác sĩ tại hệ thống DABS.
                        </Paragraph>

                        <Divider />

                        <div className="suggested-questions">
                            <Title level={5}>Câu hỏi thường gặp</Title>
                            {suggestedQuestions.map((question, index) => (
                                <Button
                                    key={index}
                                    className="question-button"
                                    icon={question.icon}
                                    onClick={() => {
                                        setInput(question.text);
                                        inputRef.current.focus();
                                    }}
                                >
                                    {question.text}
                                </Button>
                            ))}
                        </div>

                        <Divider />

                        <div className="contact-info">
                            <Title level={5}>Cần hỗ trợ thêm?</Title>
                            <Paragraph>
                                Vui lòng liên hệ với chúng tôi qua hotline: <strong>1900 1234</strong>
                                <br />
                                hoặc email: <strong>contact@dabs.com.vn</strong>
                            </Paragraph>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default ChatPage;