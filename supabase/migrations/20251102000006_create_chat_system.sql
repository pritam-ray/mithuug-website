-- Create chat_status enum
CREATE TYPE chat_status AS ENUM ('active', 'closed', 'waiting');

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status chat_status DEFAULT 'waiting',
  subject TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_system_message BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_admin_id ON chat_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message_at ON chat_sessions(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_sessions
-- Users can view their own chat sessions
CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own chat sessions
CREATE POLICY "Users can create own chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own chat sessions
CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for chat_messages
-- Users can view messages in their chat sessions
CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Users can create messages in their chat sessions
CREATE POLICY "Users can create own chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = session_id
      AND chat_sessions.user_id = auth.uid()
    )
    AND sender_id = auth.uid()
  );

-- Function to update last_message_at on chat_sessions
CREATE OR REPLACE FUNCTION update_session_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_sessions
  SET last_message_at = NEW.created_at
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_message_at when a new message is created
CREATE TRIGGER trigger_update_session_last_message
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_session_last_message();

-- Function to create a new chat session
CREATE OR REPLACE FUNCTION create_chat_session(
  p_user_id UUID,
  p_subject TEXT
)
RETURNS UUID AS $$
DECLARE
  v_session_id UUID;
BEGIN
  INSERT INTO chat_sessions (user_id, subject, status)
  VALUES (p_user_id, p_subject, 'waiting')
  RETURNING id INTO v_session_id;
  
  -- Create system message
  INSERT INTO chat_messages (session_id, sender_id, message, is_system_message)
  VALUES (
    v_session_id,
    p_user_id,
    'Chat session started. A support agent will be with you shortly.',
    TRUE
  );
  
  RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to assign admin to chat session
CREATE OR REPLACE FUNCTION assign_chat_admin(
  p_session_id UUID,
  p_admin_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_sessions
  SET admin_id = p_admin_id, status = 'active'
  WHERE id = p_session_id;
  
  -- Create system message
  INSERT INTO chat_messages (session_id, sender_id, message, is_system_message)
  VALUES (
    p_session_id,
    p_admin_id,
    'Support agent has joined the chat.',
    TRUE
  );
END;
$$ LANGUAGE plpgsql;

-- Function to close chat session
CREATE OR REPLACE FUNCTION close_chat_session(
  p_session_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_sessions
  SET status = 'closed', closed_at = NOW()
  WHERE id = p_session_id;
  
  -- Create system message
  INSERT INTO chat_messages (session_id, sender_id, message, is_system_message)
  SELECT 
    p_session_id,
    user_id,
    'Chat session has been closed.',
    TRUE
  FROM chat_sessions
  WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  p_session_id UUID,
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE chat_messages
  SET read_at = NOW()
  WHERE session_id = p_session_id
    AND sender_id != p_user_id
    AND read_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_message_count(
  p_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO v_count
  FROM chat_messages cm
  JOIN chat_sessions cs ON cm.session_id = cs.id
  WHERE cs.user_id = p_user_id
    AND cm.sender_id != p_user_id
    AND cm.read_at IS NULL;
  
  RETURN v_count;
END;
$$ LANGUAGE plpgsql;
