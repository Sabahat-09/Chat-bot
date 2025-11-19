import { useState, FormEvent, KeyboardEvent } from 'react';

interface UseMessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const useMessageInput = ({ onSend, disabled }: UseMessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return {
    message,
    setMessage,
    handleSubmit,
    handleKeyPress,
  };
};

