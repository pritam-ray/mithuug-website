import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export const ChatWidget: React.FC = () => {
  // Feature temporarily disabled - can be re-enabled in the future
  return null;
  
  const { user } = useAuth();
  const {
    currentSession,
    messages,
    unreadCount,
    loading,
    isChatOpen,
    isTyping,
    createSession,
    sendMessage,
    closeSession,
    setIsChatOpen
  } = useChat();
  
  const [messageInput, setMessageInput] = useState('');
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [subject, setSubject] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isChatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    await createSession(subject);
    setSubject('');
    setShowNewChatForm(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentSession) return;

    await sendMessage(messageInput);
    setMessageInput('');
  };

  const handleToggleChat = () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!isChatOpen && !currentSession) {
      setShowNewChatForm(true);
    }

    setIsChatOpen(!isChatOpen);
  };

  const handleCloseSession = async () => {
    if (window.confirm('Are you sure you want to close this chat session?')) {
      await closeSession();
    }
  };

  if (!user) {
    return (
      <button
        onClick={handleToggleChat}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all z-50"
        aria-label="Login to chat"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={handleToggleChat}
        className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all z-50"
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
      >
        {isChatOpen ? (
          <X size={24} />
        ) : (
          <>
            <MessageCircle size={24} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-black text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Customer Support</h3>
              {currentSession && (
                <p className="text-xs text-gray-300">
                  Status: {currentSession.status === 'active' ? 'Connected' : 'Waiting...'}
                </p>
              )}
            </div>
            <button
              onClick={handleToggleChat}
              className="hover:bg-gray-800 p-1 rounded"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages area */}
          {currentSession ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        message.is_system_message
                          ? 'bg-gray-100 text-gray-600 text-sm italic'
                          : message.sender_id === user.id
                          ? 'bg-black text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      {message.attachment_url && (
                        <a
                          href={message.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline mt-1 block"
                        >
                          View attachment
                        </a>
                      )}
                      <p className="text-xs mt-1 opacity-70">
                        {format(new Date(message.created_at), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 rounded-lg p-3 flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-gray-600">Typing...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={handleCloseSession}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Close Session
                  </button>
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={currentSession.status === 'closed'}
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || currentSession.status === 'closed'}
                    className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : showNewChatForm ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <form onSubmit={handleStartChat} className="w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What can we help you with?
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Order issue, Product question..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewChatForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Starting...
                      </>
                    ) : (
                      'Start Chat'
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <MessageCircle size={48} className="text-gray-400 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-800 mb-2">No active chat</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Start a new conversation with our support team
                </p>
                <button
                  onClick={() => setShowNewChatForm(true)}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Start New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
