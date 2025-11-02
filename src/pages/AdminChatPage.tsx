import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { format } from 'date-fns';
import SEO from '../components/SEO';

interface ChatSession {
  id: string;
  user_id: string;
  admin_id?: string;
  status: 'active' | 'closed' | 'waiting';
  subject?: string;
  last_message_at: string;
  created_at: string;
  closed_at?: string;
  user_email?: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  sender_id: string;
  message: string;
  is_system_message: boolean;
  attachment_url?: string;
  read_at?: string;
  created_at: string;
}

export default function AdminChatPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'waiting' | 'active' | 'closed'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat sessions
  const loadSessions = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('chat_sessions')
        .select(`
          *,
          user:auth.users!chat_sessions_user_id_fkey(email)
        `)
        .order('last_message_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading sessions:', error);
        return;
      }

      // Map user email to sessions
      const sessionsWithEmail = (data || []).map((session: any) => ({
        ...session,
        user_email: session.user?.email || 'Unknown'
      }));

      setSessions(sessionsWithEmail);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load messages for selected session
  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Assign admin to session
  const assignToMe = async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .rpc('assign_chat_admin', {
          p_session_id: sessionId,
          p_admin_id: user.id
        });

      if (error) {
        console.error('Error assigning admin:', error);
        showToast('Failed to assign chat', 'error');
        return;
      }

      showToast('Chat assigned successfully', 'success');
      loadSessions();
    } catch (error) {
      console.error('Error assigning admin:', error);
      showToast('Failed to assign chat', 'error');
    }
  };

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedSession || !user) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: selectedSession.id,
          sender_id: user.id,
          message: messageInput,
          is_system_message: false
        });

      if (error) {
        console.error('Error sending message:', error);
        showToast('Failed to send message', 'error');
        return;
      }

      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
    }
  };

  // Close session
  const handleCloseSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .rpc('close_chat_session', { p_session_id: sessionId });

      if (error) {
        console.error('Error closing session:', error);
        showToast('Failed to close chat', 'error');
        return;
      }

      showToast('Chat closed successfully', 'success');
      setSelectedSession(null);
      loadSessions();
    } catch (error) {
      console.error('Error closing session:', error);
      showToast('Failed to close chat', 'error');
    }
  };

  // Subscribe to new messages
  useEffect(() => {
    if (!selectedSession) return;

    const subscription = supabase
      .channel(`admin_chat:${selectedSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${selectedSession.id}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedSession]);

  // Subscribe to session updates
  useEffect(() => {
    const subscription = supabase
      .channel('admin_sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions'
        },
        () => {
          loadSessions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [filter]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, [filter]);

  // Load messages when session is selected
  useEffect(() => {
    if (selectedSession) {
      loadMessages(selectedSession.id);
    }
  }, [selectedSession]);

  return (
    <>
      <SEO
        title="Admin - Live Chat"
        description="Manage customer support chats"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Live Chat Support</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sessions List */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow">
              {/* Filter tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  {(['all', 'waiting', 'active', 'closed'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`flex-1 px-4 py-3 text-sm font-medium capitalize ${
                        filter === status
                          ? 'border-b-2 border-black text-black'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sessions */}
              <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center p-8 text-gray-500">
                    <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No {filter !== 'all' ? filter : ''} chats</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        selectedSession?.id === session.id ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{session.user_email}</p>
                          <p className="text-xs text-gray-600 truncate">{session.subject}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            session.status === 'waiting'
                              ? 'bg-yellow-100 text-yellow-800'
                              : session.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {format(new Date(session.last_message_at), 'MMM d, HH:mm')}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
              {selectedSession ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedSession.user_email}</h3>
                      <p className="text-sm text-gray-600">{selectedSession.subject}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedSession.status === 'waiting' && selectedSession.admin_id !== user?.id && (
                        <button
                          onClick={() => assignToMe(selectedSession.id)}
                          className="px-3 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
                        >
                          Assign to Me
                        </button>
                      )}
                      {selectedSession.status !== 'closed' && (
                        <button
                          onClick={() => handleCloseSession(selectedSession.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                        >
                          Close Chat
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg p-3 ${
                            message.is_system_message
                              ? 'bg-gray-100 text-gray-600 text-sm italic'
                              : message.sender_id === user?.id
                              ? 'bg-black text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {format(new Date(message.created_at), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  {selectedSession.status !== 'closed' && (
                    <div className="p-4 border-t border-gray-200">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <button
                          type="submit"
                          disabled={!messageInput.trim()}
                          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Send size={20} />
                          Send
                        </button>
                      </form>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MessageCircle size={64} className="mx-auto mb-4 text-gray-300" />
                    <p>Select a chat to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
