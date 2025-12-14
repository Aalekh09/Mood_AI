import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="mb-8 animate-bounce-slow">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-6xl">🧠</span>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-slideUp">
            Welcome to Mood AI
          </h1>
          <p className="text-2xl text-gray-600 mb-4 animate-slideUp">
            Your Personal Mental Wellness Companion
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto animate-slideUp">
            Talk to our AI-powered assistant about your feelings, track your mood patterns, 
            and get personalized emotional support whenever you need it.
          </p>
          
          <div className="flex justify-center space-x-4 animate-slideUp">
            {isAuthenticated() ? (
              <Link to="/chat" className="btn-primary text-lg px-8 py-4">
                Start Chatting →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-4">
                  Get Started Free
                </Link>
                <Link to="/chat" className="btn-secondary text-lg px-8 py-4">
                  Try Anonymous Chat
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card text-center transform hover:scale-105 transition-transform duration-300 animate-slideUp">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI-Powered Chat</h3>
            <p className="text-gray-600">
              Have natural conversations with our empathetic AI assistant trained to understand and support you.
            </p>
          </div>

          <div className="card text-center transform hover:scale-105 transition-transform duration-300 animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mood Tracking</h3>
            <p className="text-gray-600">
              Track your emotional patterns over time with detailed analytics and insights.
            </p>
          </div>

          <div className="card text-center transform hover:scale-105 transition-transform duration-300 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Private & Secure</h3>
            <p className="text-gray-600">
              Your conversations are private and secure. Use anonymous mode for complete privacy.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '📝', title: 'Sign Up', desc: 'Create your free account' },
              { step: '2', icon: '💭', title: 'Share', desc: 'Express your feelings' },
              { step: '3', icon: '🤖', title: 'AI Response', desc: 'Get empathetic support' },
              { step: '4', icon: '📈', title: 'Track', desc: 'Monitor your progress' },
            ].map((item, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">{item.step}</span>
                </div>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 card">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">24/7</h4>
              <p className="text-gray-600">Always Available</p>
            </div>
            <div>
              <h4 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-2">100%</h4>
              <p className="text-gray-600">Confidential</p>
            </div>
            <div>
              <h4 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">AI</h4>
              <p className="text-gray-600">Powered</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center card bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
          <p className="text-lg mb-6 text-purple-100">
            Join thousands of users who trust Mood AI for their mental wellness.
          </p>
          <Link to="/register" className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white mt-20 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2025 Mood AI by <span className="font-semibold text-purple-600">Aalekh Kumar</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Manav Rachna University | B.Tech CSE (2026)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;