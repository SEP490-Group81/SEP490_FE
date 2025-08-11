import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Layout, Typography, Row, Col, Button, Input, Avatar, Badge, Card, Divider, message as antMessage, Space } from 'antd';
import {
    SendOutlined,
    RobotOutlined,
    UserOutlined,
    QuestionCircleOutlined,
    ClockCircleOutlined,
    BookOutlined,
    HeartOutlined,
    LoadingOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import './ChatPage.scss';

// ✅ Import chatbot service
import {
    createChatBotSession,
    sendMessage as sendChatMessage,
    sendFirstMessage,
    extractTextFromResponse,
    generateSessionId,
    extractMixedContentFromResponse
} from '../../services/chatbotService';

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const ChatPage = () => {
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: 'Xin chào! Tôi là DABS Assistant - Trợ lý đặt khám thông minh được hỗ trợ bởi AI. Tôi có thể giúp bạn đặt lịch khám bệnh, tìm bác sĩ phù hợp và trả lời các câu hỏi về y tế. Bạn cần hỗ trợ gì hôm nay?',
            time: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const [inputValue, setInputValue] = useState(''); // ✅ Add state for UI updates

    // ✅ Use refs for values that don't need to trigger re-renders
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const inputValueRef = useRef(''); // ✅ Store input value in ref instead of state
    const initializationRef = useRef(false); // ✅ Add missing ref
    const userIdRef = useRef(null); // ✅ Add missing ref

    // ✅ Get user and token from Redux store with proper null checking
    const user = useSelector((state) => state.user?.user);
    const accessToken = useSelector((state) => state.user?.accessToken || state.auth?.accessToken);

    // ✅ Ensure userId is always a string
    const userId = user?.id ? String(user.id) : `guest_${Date.now()}`;

    // ✅ Initialize chat session using chatbotService with useCallback
    const initializeChatSession = useCallback(async () => {
        if (initializationRef.current || isInitializing || !userId || !accessToken) {
            return;
        }

        initializationRef.current = true;
        setIsInitializing(true);

        try {
            console.log('🔄 Initializing chat session for user:', userId);

            // Generate unique session ID
            const newSessionId = generateSessionId();
            console.log('🆔 Generated session ID:', newSessionId);

            // Create session using chatbotService
            const sessionResult = await createChatBotSession(newSessionId, userId, accessToken);

            console.log('✅ Session created:', sessionResult);

            // Ensure sessionId is always a string
            const finalSessionId = String(sessionResult?.sessionId || newSessionId);
            console.log('✅ Final session ID (string):', finalSessionId);
            setSessionId(finalSessionId);
            userIdRef.current = userId;

            antMessage.success('Đã kết nối với trợ lý AI!');

        } catch (error) {
            console.error('❌ Error initializing chat session:', error);
            antMessage.error('Không thể kết nối với trợ lý AI. Vui lòng thử lại.');
            setSessionId(null);
            initializationRef.current = false; // Allow retry
        } finally {
            setIsInitializing(false);
        }
    }, [userId, accessToken, isInitializing]);

    // ✅ Initialize chat session when component mounts and user/token are available
    useEffect(() => {
        if (userId && userId !== `guest_${Date.now()}` && accessToken && !initializationRef.current) {
            initializeChatSession();
        }
    }, [userId, accessToken, initializeChatSession]);

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

    // ✅ Function to start new chat session with useCallback
    const startNewSession = useCallback(async () => {
        try {
            setIsLoading(true);
            console.log('🔄 Starting new session...');

            if (!accessToken) {
                antMessage.error('Vui lòng đăng nhập để sử dụng trợ lý AI');
                return;
            }

            // Reset refs
            initializationRef.current = false;
            userIdRef.current = null;
            inputValueRef.current = '';
            setInputValue(''); // ✅ Clear state as well
            if (inputRef.current) {
                inputRef.current.value = '';
            }

            // Generate new session ID
            const newSessionId = generateSessionId();

            // Create new session
            const sessionResult = await createChatBotSession(newSessionId, userId, accessToken);

            console.log('✅ New session result:', sessionResult);

            // Ensure sessionId is always a string
            const finalSessionId = String(sessionResult?.sessionId || newSessionId);
            setSessionId(finalSessionId);
            userIdRef.current = userId;

            // Reset messages with welcome message
            setMessages([{
                type: 'bot',
                content: `Xin chào ${user?.fullName || user?.name || 'bạn'}! Tôi là DABS Assistant - Trợ lý đặt khám thông minh được hỗ trợ bởi AI.

🏥 Tôi có thể giúp bạn:
• Đặt lịch khám bệnh theo chuyên khoa
• Tìm bác sĩ phù hợp với triệu chứng
• Tư vấn quy trình khám chữa bệnh
• Hướng dẫn chuẩn bị trước khi khám
• Giải đáp thắc mắc về y tế

Hãy cho tôi biết bạn cần hỗ trợ gì hôm nay!`,
                time: new Date()
            }]);

            antMessage.success('Đã tạo phiên chat mới với trợ lý AI!');
            console.log('✅ New session started:', finalSessionId);

        } catch (error) {
            console.error('❌ Error creating new session:', error);
            antMessage.error('Không thể tạo phiên chat mới. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [accessToken, userId, user]);

    // ✅ Handle input change using both ref and state
    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        inputValueRef.current = value;
        setInputValue(value); // ✅ Update state for UI reactivity
    }, []);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && inputValue.trim() && !isLoading) {
            sendMessage();
        }
    }, [inputValue, isLoading]);

    // ✅ Send message function with useCallback optimization
    const sendMessage = useCallback(async () => {
        const inputValue = inputValueRef.current.trim();

        if (!inputValue || isLoading || !sessionId || !accessToken) {
            if (!accessToken) {
                antMessage.error('Vui lòng đăng nhập để sử dụng trợ lý AI');
            }
            return;
        }

        // Clear input immediately
        inputValueRef.current = '';
        setInputValue(''); // ✅ Clear state as well
        if (inputRef.current) {
            inputRef.current.value = '';
        }

        setIsLoading(true);

        // ✅ Add user message immediately
        const userMessageObj = {
            type: 'user',
            content: inputValue,
            time: new Date()
        };

        setMessages(prev => [...prev, userMessageObj]);

        try {
            console.log('🔄 Sending message to chatbot service...');
            console.log('📤 Message:', inputValue);
            console.log('🆔 Session ID:', sessionId);

            // ✅ Send message to API using chatbotService
            const response = await sendChatMessage(sessionId, userId, inputValue, accessToken);

            console.log('✅ Raw response from API:', response);

            // ✅ Process response and extract bot messages
            let botMessages = [];
            if (Array.isArray(response) && response.length > 0) {
                response.forEach((messageData) => {
                    if (messageData.type === 'choice' && messageData.choices && messageData.choices.length > 0) {
                        botMessages.push({
                            type: 'bot',
                            content: messageData.text,
                            choices: messageData.choices,
                            time: new Date()
                        });
                    } else if (messageData.type === 'text' && messageData.content.trim()) {
                        botMessages.push({
                            type: 'bot',
                            content: messageData.content,
                            time: new Date()
                        });
                    }
                });
            } else {
                // ✅ Fallback for choice responses
                const plainText = response
                    .map(event => event.content?.parts?.map(part => part.text).join(' '))
                    .filter(Boolean)
                    .join(' ');

                if (plainText) {
                    botMessages.push({
                        type: 'bot',
                        content: plainText,
                        time: new Date()
                    });
                }
            }

            // ✅ Add bot messages to state
            if (botMessages.length > 0) {
                setMessages(prev => [...prev, ...botMessages]);
            } else {
                // Fallback message
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: 'Tôi đã nhận được tin nhắn của bạn. Bạn có câu hỏi gì khác không?',
                    time: new Date()
                }]);
            }

        } catch (error) {
            console.error('❌ Error sending message:', error);

            setMessages(prev => [...prev, {
                type: 'bot',
                content: 'Xin lỗi, có lỗi xảy ra khi kết nối với trợ lý AI. Vui lòng thử lại sau.',
                time: new Date()
            }]);

            antMessage.error('Lỗi kết nối API. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, sessionId, accessToken, userId]);

    // ✅ Handle choice button click with useCallback
    const handleChoiceClick = useCallback(async (choice) => {
        if (!choice || !sessionId || !accessToken || isLoading) {
            if (!accessToken) {
                antMessage.error('Vui lòng đăng nhập để sử dụng trợ lý AI');
            }
            return;
        }

        setIsLoading(true);

        // ✅ Add user message for the choice
        const userMessageObj = {
            type: 'user',
            content: choice.label,
            time: new Date()
        };

        try {
            // ✅ Send choice to API
            const response = await sendChatMessage(sessionId, userId, choice.value || choice.label, accessToken);

            // ✅ Process response messages
            let botMessages = [];
            if (Array.isArray(response) && response.length > 0) {
                response.forEach((messageData) => {
                    if (messageData.type === 'choice' && messageData.choices && messageData.choices.length > 0) {
                        botMessages.push({
                            type: 'bot',
                            content: messageData.text,
                            choices: messageData.choices,
                            time: new Date()
                        });
                    } else if (messageData.type === 'text' && messageData.content?.trim()) {
                        botMessages.push({
                            type: 'bot',
                            content: messageData.content,
                            time: new Date()
                        });
                    }
                });
            }

            // ✅ Batch update messages
            setMessages(prev => [
                ...prev,
                userMessageObj,
                ...(botMessages.length > 0 ? botMessages : [{
                    type: 'bot',
                    content: 'Cảm ơn bạn đã chọn. Bạn có cần hỗ trợ gì khác không?',
                    time: new Date()
                }])
            ]);

        } catch (error) {
            console.error('❌ Error handling choice click:', error);

            setMessages(prev => [
                ...prev,
                userMessageObj,
                {
                    type: 'bot',
                    content: 'Xin lỗi, có lỗi xảy ra khi xử lý lựa chọn của bạn. Vui lòng thử lại.',
                    time: new Date()
                }
            ]);

            antMessage.error('Lỗi khi xử lý lựa chọn.');
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, accessToken, userId, isLoading]);

    // ✅ Handle suggested question click with useCallback
    const handleSuggestedQuestion = useCallback(async (questionText) => {
        if (!sessionId || !accessToken) {
            antMessage.error('Vui lòng đăng nhập để sử dụng trợ lý AI');
            return;
        }

        inputValueRef.current = '';
        setInputValue(''); // ✅ Clear state as well
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setIsLoading(true);

        // Thêm tin nhắn của người dùng
        const userMessageObj = {
            type: 'user',
            content: questionText,
            time: new Date()
        };

        setMessages(prev => [...prev, userMessageObj]);

        try {
            // Send to API
            const response = await sendChatMessage(sessionId, userId, questionText, accessToken);

            // ✅ Process response similar to sendMessage
            let botMessages = [];
            if (Array.isArray(response) && response.length > 0) {
                response.forEach((messageData) => {
                    if (messageData.type === 'choice' && messageData.choices && messageData.choices.length > 0) {
                        botMessages.push({
                            type: 'bot',
                            content: messageData.text,
                            choices: messageData.choices,
                            time: new Date()
                        });
                    } else if (messageData.type === 'text' && messageData.content?.trim()) {
                        botMessages.push({
                            type: 'bot',
                            content: messageData.content,
                            time: new Date()
                        });
                    }
                });
            }

            // Add bot messages
            if (botMessages.length > 0) {
                setMessages(prev => [...prev, ...botMessages]);
            } else {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: 'Tôi đã nhận được câu hỏi của bạn nhưng không thể tạo phản hồi phù hợp.',
                    time: new Date()
                }]);
            }

        } catch (error) {
            console.error('❌ Error sending suggested question:', error);

            setMessages(prev => [...prev, {
                type: 'bot',
                content: 'Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi của bạn. Vui lòng thử lại.',
                time: new Date()
            }]);

            antMessage.error('Lỗi kết nối API. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, accessToken, userId]);

    // Format timestamp
    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // ✅ Get session status
    const getSessionStatus = () => {
        if (isInitializing) return { status: 'processing', text: 'Đang kết nối...' };
        if (!accessToken) return { status: 'warning', text: 'Chưa đăng nhập' };
        if (!sessionId) return { status: 'error', text: 'Chưa kết nối' };
        return { status: 'success', text: 'Trực tuyến với AI' };
    };

    const sessionStatus = getSessionStatus();

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
                                    <Badge status={sessionStatus.status} />
                                    <span>{sessionStatus.text}</span>
                                </div>
                            </div>
                            {/* ✅ Add new session button */}
                            <div className="header-actions">
                                <Button
                                    type="text"
                                    icon={<ReloadOutlined />}
                                    onClick={startNewSession}
                                    disabled={isLoading || isInitializing}
                                    loading={isLoading}
                                    title="Tạo phiên chat mới"
                                />
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

                                        {/* ✅ Render choice buttons if available */}
                                        {message.choices && message.choices.length > 0 && (
                                            <div className="choice-buttons" style={{ marginTop: 12 }}>
                                                <Space direction="vertical" style={{ width: '100%' }} size="small">
                                                    {message.choices.map((choice, choiceIndex) => (
                                                        <Button
                                                            key={`choice-${index}-${choiceIndex}`}
                                                            type="default"
                                                            onClick={() => handleChoiceClick(choice)}
                                                            style={{
                                                                width: '100%',
                                                                textAlign: 'left',
                                                                height: 'auto',
                                                                padding: '8px 12px',
                                                                whiteSpace: 'normal',
                                                                wordWrap: 'break-word',
                                                                border: '1px solid #d9d9d9',
                                                                borderRadius: '6px'
                                                            }}
                                                            disabled={isLoading}
                                                        >
                                                            {choice.label}
                                                        </Button>
                                                    ))}
                                                </Space>
                                            </div>
                                        )}

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

                            {/* ✅ Loading indicator */}
                            {(isLoading || isInitializing) && (
                                <div className="message bot-message">
                                    <Avatar
                                        icon={<RobotOutlined />}
                                        className="message-avatar"
                                        size="default"
                                    />
                                    <div className="message-content">
                                        <div className="message-bubble loading">
                                            <LoadingOutlined /> {isInitializing ? 'Đang kết nối trợ lý AI...' : 'Đang xử lý...'}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="chat-input">
                            <Input
                                placeholder={
                                    isLoading ? "Đang xử lý..." :
                                        isInitializing ? "Đang kết nối..." :
                                            !accessToken ? "Vui lòng đăng nhập để sử dụng AI..." :
                                                !sessionId ? "Chưa kết nối với AI..." :
                                                    "Nhập câu hỏi về y tế, đặt khám..."
                                }
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                size="large"
                                ref={inputRef}
                                disabled={isLoading || isInitializing || !sessionId || !accessToken}
                                suffix={
                                    <Button
                                        type="primary"
                                        icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
                                        onClick={sendMessage}
                                        disabled={!inputValue.trim() || isLoading || isInitializing || !sessionId || !accessToken}
                                        className="send-button"
                                        loading={isLoading}
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
                        <Title level={4}>Hỏi đáp y tế với AI</Title>
                        <Paragraph>
                            Trợ lý ảo DABS Assistant được hỗ trợ bởi AI có thể giúp bạn trả lời các câu hỏi về dịch vụ y tế,
                            đặt khám và thông tin về bác sĩ tại hệ thống DABS.
                        </Paragraph>

                        {/* ✅ Session info */}
                        {sessionId && (
                            <div className="session-info">
                                <small style={{ color: '#666' }}>
                                    Session ID: {sessionId.slice(-8)}...
                                </small>
                            </div>
                        )}

                        <Divider />

                        <div className="suggested-questions">
                            <Title level={5}>Câu hỏi thường gặp</Title>
                            {suggestedQuestions.map((question, index) => (
                                <Button
                                    key={index}
                                    className="question-button"
                                    icon={question.icon}
                                    onClick={() => handleSuggestedQuestion(question.text)}
                                    disabled={isLoading || isInitializing || !sessionId || !accessToken}
                                    loading={isLoading}
                                >
                                    {question.text}
                                </Button>
                            ))}
                        </div>

                        <Divider />

                        <div className="session-controls">
                            <Button
                                type="primary"
                                icon={<ReloadOutlined />}
                                onClick={startNewSession}
                                disabled={isLoading || isInitializing}
                                loading={isLoading}
                                block
                            >
                                Tạo phiên chat mới
                            </Button>
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