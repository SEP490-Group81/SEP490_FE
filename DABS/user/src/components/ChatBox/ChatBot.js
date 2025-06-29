import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Avatar, Badge, Tooltip } from 'antd';
import {
    SendOutlined,
    CloseOutlined,
    RobotOutlined,
    UserOutlined,
    CommentOutlined
} from '@ant-design/icons';
import './ChatBot.scss';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: 'Xin chào! Tôi là DABS Assistant. Tôi có thể giúp gì cho bạn hôm nay?',
            time: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [unreadCount, setUnreadCount] = useState(1);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Focus vào input khi mở chat
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Reset số tin nhắn chưa đọc khi mở chat
    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

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

    return (
        <div className="chat-bot-container">
            {/* Nút mở chat */}
            <Button
                type="primary"
                shape="circle"
                size="large"
                className="chat-toggle-button"
                onClick={toggleChat}
                icon={
                    isOpen ? (
                        <CloseOutlined />
                    ) : (
                        <Badge count={unreadCount} size="small" offset={[-5, 5]}>
                            <CommentOutlined />
                        </Badge>
                    )
                }
            />

            {/* Cửa sổ chat */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-title">
                            <Avatar icon={<RobotOutlined />} className="bot-avatar" />
                            <div className="header-info">
                                <div className="bot-name">DABS Assistant</div>
                                <div className="bot-status">
                                    <Badge status="success" />
                                    <span>Trực tuyến</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            type="text"
                            icon={<CloseOutlined />}
                            onClick={toggleChat}
                            className="close-button"
                        />
                    </div>

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
                                        size="small"
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
                                        size="small"
                                    />
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} /> {/* Dùng để auto-scroll */}
                    </div>

                    <div className="chat-input">
                        <Input
                            placeholder="Nhập tin nhắn..."
                            value={input}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            suffix={
                                <Tooltip title="Gửi">
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        onClick={sendMessage}
                                        disabled={!input.trim()}
                                        className="send-button"
                                    />
                                </Tooltip>
                            }
                            ref={inputRef}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;