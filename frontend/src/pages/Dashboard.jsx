import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChats: 0,
    avgMoodScore: 0,
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await chatAPI.getChatHistory();
      const history = response.data.data;
      setChatHistory(history);
      calculateStats(history);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (history) => {
    const total = history.length;
    const positive = history.filter((chat) => chat.sentiment === 'POSITIVE').length;
    const negative = history.filter((chat) => chat.sentiment === 'NEGATIVE').length;
    const neutral = history.filter((chat) => chat.sentiment === 'NEUTRAL').length;
    
    const avgMood = history.reduce((sum, chat) => sum + (chat.moodScore || 0), 0) / (total || 1);

    setStats({
      totalChats: total,
      avgMoodScore: avgMood,
      positiveCount: positive,
      negativeCount: negative,
      neutralCount: neutral,
    });
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;

    try {
      await chatAPI.deleteChat(chatId);
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Your Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {user?.fullName}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <p className="text-sm opacity-90 mb-2">Total Conversations</p>
            <p className="text-4xl font-bold">{stats.totalChats}</p>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <p className="text-sm opacity-90 mb-2">Average Mood</p>
            <p className="text-4xl font-bold">{(stats.avgMoodScore * 100).toFixed(0)}%</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <p className="text-sm opacity-90 mb-2">Positive Moments</p>
            <p className="text-4xl font-bold">{stats.positiveCount}</p>
          </div>

          <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <p className="text-sm opacity-90 mb-2">Needs Support</p>
            <p className="text-4xl font-bold">{stats.negativeCount}</p>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mood Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">😊 Positive</span>
                <span className="text-sm text-gray-600">{stats.positiveCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.positiveCount / stats.totalChats) * 100 || 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">😐 Neutral</span>
                <span className="text-sm text-gray-600">{stats.neutralCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.neutralCount / stats.totalChats) * 100 || 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">😔 Negative</span>
                <span className="text-sm text-gray-600">{stats.negativeCount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.negativeCount / stats.totalChats) * 100 || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Conversations */}
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Conversations</h2>
          {chatHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-600 mb-4">No conversations yet</p>
              <button
                onClick={() => navigate('/chat')}
                className="btn-primary"
              >
                Start Chatting
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.slice(0, 10).map((chat) => (
                <div
                  key={chat.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 mb-1">You:</p>
                      <p className="text-sm text-gray-600 mb-3">{chat.message}</p>
                      <p className="text-sm font-semibold text-purple-600 mb-1">Mood AI:</p>
                      <p className="text-sm text-gray-600">{chat.response}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-3 py-1 rounded-full font-semibold ${
                      chat.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-700' :
                      chat.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {chat.sentiment}
                    </span>
                    <span className="text-gray-500">
                      {new Date(chat.createdAt).toLocaleDateString()} at{' '}
                      {new Date(chat.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;