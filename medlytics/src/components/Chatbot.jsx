import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: 'Hi! 👋 I\'m your MedLytics AI assistant. How can I help you today?'
        }
    ]);
    const [inputValue, setInputValue] = useState('');

    const quickActions = [
        { text: '🛌 Sleep Analysis', response: 'Our Sleep Disorder Analysis uses advanced AI to track your sleep patterns, identify issues like insomnia or sleep apnea, and provide personalized recommendations. Would you like to start your analysis?' },
        { text: '💭 Anxiety Help', response: 'Our Anxiety Prediction tool analyzes your responses to identify anxiety patterns and provide early intervention strategies. It\'s completely confidential and uses machine learning for accurate results.' },
        { text: '❤️ Depression Check', response: 'Depression Prediction helps identify early signs of depression through AI analysis. We provide personalized support recommendations and connect you with resources. Your mental health matters!' },
        { text: '⚖️ BMI Calculator', response: 'Our BMI Analysis tool calculates your Body Mass Index and provides personalized health recommendations based on your results, along with nutrition and exercise tips.' }
    ];

    const handleQuickAction = (action) => {
        setMessages([...messages,
        { type: 'user', text: action.text },
        { type: 'bot', text: action.response }
        ]);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setMessages([...messages, { type: 'user', text: userMessage }]);
        setInputValue('');

        // Simple response logic
        setTimeout(() => {
            let botResponse = '';
            const lowerInput = userMessage.toLowerCase();

            if (lowerInput.includes('sleep') || lowerInput.includes('insomnia')) {
                botResponse = 'I can help you with sleep analysis! Our AI-powered tool tracks sleep patterns and provides recommendations. Visit our Sleep Disorder Analysis page to get started!';
            } else if (lowerInput.includes('anxiety') || lowerInput.includes('stress')) {
                botResponse = 'Anxiety management is important! Our Anxiety Prediction tool can help identify patterns and provide support. Would you like to learn more?';
            } else if (lowerInput.includes('depression') || lowerInput.includes('mental health')) {
                botResponse = 'Mental health is crucial! Our Depression Prediction service provides confidential analysis and support. I\'m here to help guide you to the right resources.';
            } else if (lowerInput.includes('bmi') || lowerInput.includes('weight')) {
                botResponse = 'Our BMI Analysis tool can calculate your Body Mass Index and provide personalized health recommendations. Try it out!';
            } else if (lowerInput.includes('help') || lowerInput.includes('services')) {
                botResponse = 'MedLytics offers 4 core services: Sleep Analysis, Anxiety Prediction, Depression Prediction, and BMI Analysis. All powered by advanced AI! Which one interests you?';
            } else {
                botResponse = 'I\'m here to help! You can ask me about our services, health analysis tools, or how our AI technology works. What would you like to know?';
            }

            setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
        }, 500);
    };

    return (
        <>
            {/* Chatbot Button */}
            <motion.button
                className="chatbot-button"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
                    cursor: 'pointer',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px'
                }}
            >
                {isOpen ? '✕' : '💬'}
            </motion.button>

            {/* Chatbot Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            bottom: '100px',
                            right: '24px',
                            width: '380px',
                            height: '550px',
                            background: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            zIndex: 999,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '20px',
                                borderTopLeftRadius: '20px',
                                borderTopRightRadius: '20px'
                            }}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <div
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        background: '#10b981',
                                        borderRadius: '50%'
                                    }}
                                ></div>
                                <div>
                                    <div className="fw-bold">MedLytics AI</div>
                                    <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Always here to help</div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '20px',
                                background: '#f8fafc'
                            }}
                        >
                            {messages.map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        marginBottom: '12px',
                                        display: 'flex',
                                        justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start'
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: '75%',
                                            padding: '12px 16px',
                                            borderRadius: '16px',
                                            background: msg.type === 'user'
                                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                : 'white',
                                            color: msg.type === 'user' ? 'white' : '#1e293b',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            fontSize: '0.9rem',
                                            lineHeight: 1.5
                                        }}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Quick Actions */}
                            {messages.length <= 1 && (
                                <div style={{ marginTop: '16px' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                                        Quick actions:
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {quickActions.map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleQuickAction(action)}
                                                style={{
                                                    padding: '8px 12px',
                                                    borderRadius: '20px',
                                                    border: '1px solid #e2e8f0',
                                                    background: 'white',
                                                    color: '#475569',
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.borderColor = '#667eea';
                                                    e.target.style.color = '#667eea';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.borderColor = '#e2e8f0';
                                                    e.target.style.color = '#475569';
                                                }}
                                            >
                                                {action.text}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div
                            style={{
                                padding: '16px',
                                background: 'white',
                                borderTop: '1px solid #e2e8f0'
                            }}
                        >
                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    style={{
                                        flex: 1,
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        outline: 'none',
                                        fontSize: '0.9rem'
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    style={{
                                        padding: '12px 20px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
