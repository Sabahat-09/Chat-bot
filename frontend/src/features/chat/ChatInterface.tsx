import React from 'react';
import { useChatInterface } from './ChatInterface.ts';
import MessageList from './MessageList.tsx';
import MessageInput from './MessageInput.tsx';
import Loading from '../../common/Loading';
import { useAuthStore } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import './ChatInterface.css';

const ChatInterface: React.FC = () => {
  const { messages, currentMessage, isLoading, authError, historyLoaded, sendMessage, isConnected } = useChatInterface();
  const { user, logout } = useAuthStore();
  const { isAdmin } = useRole();

  // Auto-logout when session expires
  React.useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, 3000); // Give user 3 seconds to see the error message
      return () => clearTimeout(timer);
    }
  }, [authError, logout]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 className="chat-title">AI Customer Support</h1>
        <div className="chat-header-actions">
          {isAdmin && (
            <a href="/admin/documents" className="admin-link">
              Manage Documents
            </a>
          )}
          <span className="user-info">{user?.email}</span>
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      <div className="chat-content">
        {authError && (
          <div className="auth-error-banner" style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            margin: '12px',
            borderRadius: '4px',
            border: '1px solid #fcc',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {authError} Redirecting to login...
          </div>
        )}
        {!historyLoaded ? (
          <div className="loading-history" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            color: '#666'
          }}>
            <Loading size="small" text="Loading chat history..." />
          </div>
        ) : (
          <MessageList messages={messages} currentMessage={currentMessage} isLoading={isLoading} />
        )}
        {!isConnected && !authError && historyLoaded && (
          <div className="connection-status">
            <Loading size="small" text="Connecting..." />
          </div>
        )}
        <MessageInput onSend={sendMessage} disabled={!isConnected || isLoading || !historyLoaded} />
      </div>
    </div>
  );
};

export default ChatInterface;

