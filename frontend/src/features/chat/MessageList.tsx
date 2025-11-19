import React, { useEffect, useRef } from 'react';
import { useMessageList } from './MessageList.ts';
import Loading from '../../common/Loading';
import './MessageList.css';

interface Message {
  type: 'user' | 'assistant' | 'error';
  content: string;
}

interface MessageListProps {
  messages: Message[];
  currentMessage: string;
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentMessage, isLoading }) => {
  const { displayMessages } = useMessageList({ messages, currentMessage });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages, currentMessage]);

  return (
    <div className="message-list">
      {displayMessages.length === 0 && (
        <div className="empty-state">
          <p>Start a conversation by asking a question!</p>
        </div>
      )}
      {displayMessages.map((msg, index) => (
        <div key={index} className={`message message-${msg.type}`}>
          <div className="message-content">{msg.content}</div>
        </div>
      ))}
      {isLoading && currentMessage && (
        <div className="message message-assistant">
          <div className="message-content">
            {currentMessage}
            <span className="typing-indicator">▋</span>
          </div>
        </div>
      )}
      {isLoading && !currentMessage && (
        <div className="message message-assistant">
          <div className="message-content">
            <Loading size="small" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

