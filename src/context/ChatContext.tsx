import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_id: string;
  message: string;
  is_system_message: boolean;
  attachment_url?: string;
  read_at?: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  admin_id?: string;
  status: 'active' | 'closed' | 'waiting';
  subject?: string;
  last_message_at: string;
  created_at: string;
  closed_at?: string;
}

interface ChatContextType {
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  unreadCount: number;
  loading: boolean;
  isChatOpen: boolean;
  isTyping: boolean;
  createSession: (subject: string) => Promise<void>;
  sendMessage: (message: string, attachmentUrl?: string) => Promise<void>;
  closeSession: () => Promise<void>;
  markMessagesAsRead: () => Promise<void>;
  loadMessages: (sessionId: string) => Promise<void>;
  setIsChatOpen: (isOpen: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Load current active session
  const loadCurrentSession = useCallback(async () => {
    if (!user) {
      setCurrentSession(null);
      setMessages([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'waiting'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading chat session:', error);
        return;
      }

      if (data) {
        setCurrentSession(data);
        await loadMessages(data.id);
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
    }
  }, [user]);

  // Load messages for a session
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

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('get_unread_message_count', { p_user_id: user.id });

      if (error) {
        console.error('Error loading unread count:', error);
        return;
      }

      setUnreadCount(data || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, [user]);

  // Create new chat session
  const createSession = async (subject: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('create_chat_session', {
          p_user_id: user.id,
          p_subject: subject
        });

      if (error) {
        console.error('Error creating chat session:', error);
        showToast('Failed to create chat session', 'error');
        return;
      }

      // Fetch the newly created session
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', data)
        .single();

      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        return;
      }

      setCurrentSession(sessionData);
      await loadMessages(data);
      setIsChatOpen(true);
      showToast('Chat session started', 'success');
    } catch (error) {
      console.error('Error creating chat session:', error);
      showToast('Failed to create chat session', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (message: string, attachmentUrl?: string) => {
    if (!user || !currentSession) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSession.id,
          sender_id: user.id,
          message,
          attachment_url: attachmentUrl,
          is_system_message: false
        });

      if (error) {
        console.error('Error sending message:', error);
        showToast('Failed to send message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
    }
  };

  // Close chat session
  const closeSession = async () => {
    if (!currentSession) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .rpc('close_chat_session', { p_session_id: currentSession.id });

      if (error) {
        console.error('Error closing chat session:', error);
        showToast('Failed to close chat session', 'error');
        return;
      }

      setCurrentSession(null);
      setMessages([]);
      setIsChatOpen(false);
      showToast('Chat session closed', 'success');
    } catch (error) {
      console.error('Error closing chat session:', error);
      showToast('Failed to close chat session', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async () => {
    if (!user || !currentSession) return;

    try {
      const { error } = await supabase
        .rpc('mark_messages_as_read', {
          p_session_id: currentSession.id,
          p_user_id: user.id
        });

      if (error) {
        console.error('Error marking messages as read:', error);
      }

      await loadUnreadCount();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Subscribe to new messages
  useEffect(() => {
    if (!currentSession) return;

    const subscription = supabase
      .channel(`chat:${currentSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${currentSession.id}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMessage]);
          
          // Show typing indicator briefly if message is from admin
          if (newMessage.sender_id !== user?.id) {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 1000);
          }
          
          // Update unread count if chat is not open
          if (!isChatOpen && newMessage.sender_id !== user?.id) {
            loadUnreadCount();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentSession, user, isChatOpen, loadUnreadCount]);

  // Subscribe to session updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel(`sessions:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const updatedSession = payload.new as ChatSession;
          setCurrentSession(updatedSession);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Load initial data
  useEffect(() => {
    if (user) {
      loadCurrentSession();
      loadUnreadCount();
    }
  }, [user, loadCurrentSession, loadUnreadCount]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isChatOpen && currentSession) {
      markMessagesAsRead();
    }
  }, [isChatOpen, currentSession]);

  const value = {
    currentSession,
    messages,
    unreadCount,
    loading,
    isChatOpen,
    isTyping,
    createSession,
    sendMessage,
    closeSession,
    markMessagesAsRead,
    loadMessages,
    setIsChatOpen
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
