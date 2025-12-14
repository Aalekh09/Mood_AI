import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, chatsRes, analyticsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllChats(),
        adminAPI.getAnalytics(),
      ]);

      setUsers(usersRes.data.data);
      setChats(chatsRes.data.data);
      setAnalytics(analyticsRes.data.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminAPI.deleteUser(userId);
      loadAdminData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;

    try {
      await adminAPI.deleteChat(chatId);
      loadAdminData();
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
          <p className="text-gray-600">Loading admin panel...</p>
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
            Admin Panel
          </h1>
          <p className="text-gray-600">Manage users, chats, and view analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <p className="text-sm opacity-90 mb-2">Total Users</p>
            <p className="text-4xl font-bold">{analytics?.totalUsers || 0}</p>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <p className="text-sm opacity-90 mb-2">Total Chats</p>
            <p className="text-4xl font-bold">{analytics?.totalChats || 0}</p>
          </div>

          <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <p className="text-sm opacity-90 mb-2">Active Today</p>
            <p className="text-4xl font-bold">
              {chats.filter(chat => {
                const today = new Date().toDateString();
                return new Date(chat.createdAt).toDateString() === today;
              }).length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="flex border-b border-gray-200">
            {['overview', 'users', 'chats'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">System Overview</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Recent Activity</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {chats.filter(chat => {
                        const lastHour = new Date(Date.now() - 60 * 60 * 1000);
                        return new Date(chat.createdAt) > lastHour;
                      }).length} chats in the last hour
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">User Roles</p>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {users.filter(u => u.role === 'USER').length}
                        </p>
                        <p className="text-xs text-gray-600">Regular Users</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {users.filter(u => u.role === 'ADMIN').length}
                        </p>
                        <p className="text-xs text-gray-600">Admins</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">All Users</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{user.fullName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {user.role !== 'ADMIN' && (
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'chats' && (
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">All Chats</h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">User ID: {chat.user?.id}</p>
                          <p className="text-sm font-semibold text-gray-800 mb-1">Message:</p>
                          <p className="text-sm text-gray-600 mb-2">{chat.message}</p>
                          <p className="text-sm font-semibold text-purple-600 mb-1">Response:</p>
                          <p className="text-sm text-gray-600">{chat.response}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteChat(chat.id)}
                          className="ml-4 text-red-500 hover:text-red-700"
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
{new Date(chat.createdAt).toLocaleString()}
</span>
</div>
</div>
))}
</div>
</div>
)}
</div>
</div>
</div>
</div>
);
};
export default AdminPanel;