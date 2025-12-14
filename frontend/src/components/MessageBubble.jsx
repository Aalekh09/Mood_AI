import React from 'react';

const MessageBubble = ({ message, isUser, sentiment, moodScore, timestamp }) => {
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'text-green-600';
      case 'NEGATIVE':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return '😊';
      case 'NEGATIVE':
        return '😔';
      default:
        return '😐';
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
      <div className={isUser ? 'message-user' : 'message-ai'}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        
        {!isUser && sentiment && (
          <div className="mt-3 pt-3 border-t border-purple-100 flex items-center justify-between text-xs">
            <span className={`font-semibold ${getSentimentColor(sentiment)}`}>
              {getSentimentEmoji(sentiment)} {sentiment}
            </span>
            {moodScore && (
              <span className="text-gray-600">
                Mood: {(moodScore * 100).toFixed(0)}%
              </span>
            )}
          </div>
        )}
        
        {timestamp && (
          <p className={`text-xs mt-2 ${isUser ? 'text-purple-200' : 'text-gray-400'}`}>
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;