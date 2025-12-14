import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import MessageBubble from '../components/MessageBubble';

const ChatPage = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isAuthenticated()) {
      loadChatHistory();
    }
  }, []);

  const loadChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await chatAPI.getChatHistory();
      const history = response.data.data;
      
      const formattedMessages = history.flatMap((chat) => [
        { text: chat.message, isUser: true, timestamp: chat.createdAt },
        {
          text: chat.response,
          isUser: false,
          sentiment: chat.sentiment,
          moodScore: chat.moodScore,
          timestamp: chat.createdAt,
        },
      ]);
      
      setMessages(formattedMessages.reverse());
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message immediately
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
      let response;
      if (isAuthenticated()) {
        response = await chatAPI.sendMessage({ message: userMessage });
      } else {
        response = await chatAPI.sendAnonymousMessage({ message: userMessage });
      }

      const aiResponse = response.data.data;

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          text: aiResponse.response,
          isUser: false,
          sentiment: aiResponse.sentiment,
          moodScore: aiResponse.moodScore,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I'm sorry, I'm having trouble connecting right now. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md py-4 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Chat with Mood AI
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isAuthenticated()
              ? 'Your conversation is being saved'
              : '💡 Anonymous mode - Login to save your chat history'}
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto px-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-4">
          {loadingHistory ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading chat history...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-6">
                <span className="text-5xl">🧠</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                How are you feeling today?
              </h2>
              <p className="text-gray-600 mb-8 max-w-md">
                I'm here to listen and support you. Share what's on your mind, and let's talk about it together.
              </p>
              <div className="grid md:grid-cols-3 gap-4 w-full max-w-2xl">
                {[
                  { emoji: '😊', text: "I'm feeling great!" },
                  { emoji: '😐', text: "I'm okay, just thinking..." },
                  { emoji: '😔', text: "I'm feeling down..." },
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(suggestion.text)}
                    className="card hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    <div className="text-4xl mb-2">{suggestion.emoji}</div>
                    <p className="text-sm text-gray-700">{suggestion.text}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  message={msg.text}
                  isUser={msg.isUser}
                  sentiment={msg.sentiment}
                  moodScore={msg.moodScore}
                  timestamp={msg.timestamp}
                />
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-6 py-4 shadow-lg border-2 border-purple-100">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Form */}
        <div className="py-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;