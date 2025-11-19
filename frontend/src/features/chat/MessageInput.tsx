import React from 'react';
import { useMessageInput } from './MessageInput.ts';
import Button from '../../common/Button';
import './MessageInput.css';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false }) => {
  const { message, setMessage, handleSubmit, handleKeyPress } = useMessageInput({ onSend, disabled });

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
        />
        <Button type="submit" disabled={disabled || !message.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;

