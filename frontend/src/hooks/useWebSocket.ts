import { useState, useEffect, useCallback, useRef } from 'react';
import { websocketService, WebSocketMessage } from '../services/websocket';

const WS_URL = process.env.WS_URL || 'ws://localhost:8000/ws/chat';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const wsRef = useRef<typeof websocketService | null>(null);
  const accumulatedMessageRef = useRef('');
  const isMountedRef = useRef(true);
  const handlersRef = useRef<{
    handleMessage: ((message: WebSocketMessage) => void) | null;
    handleError: ((error: Event) => void) | null;
    handleConnect: (() => void) | null;
  }>({ handleMessage: null, handleError: null, handleConnect: null });

  useEffect(() => {
    wsRef.current = websocketService;
    accumulatedMessageRef.current = ''; // Reset on mount
    isMountedRef.current = true;

    if (!handlersRef.current.handleMessage) {
      handlersRef.current.handleMessage = (message: WebSocketMessage) => {
        if (!isMountedRef.current) return;

        if (message.type === 'message') {
          accumulatedMessageRef.current += message.content || '';
          setCurrentMessage(accumulatedMessageRef.current);
          setIsLoading(true);
        } else if (message.type === 'done') {
          setIsLoading(false);
          const finalMessage = accumulatedMessageRef.current;
          if (finalMessage) {
            setMessages((prev) => {
              const newMessage: WebSocketMessage = {
                type: 'message',
                content: finalMessage,
              };
              return [...prev, newMessage];
            });
          }
          accumulatedMessageRef.current = '';
          setCurrentMessage('');
        } else if (message.type === 'error') {
          setIsLoading(false);
          setMessages((prev) => [...prev, message]);
          accumulatedMessageRef.current = '';
          setCurrentMessage('');
        }
      };

      handlersRef.current.handleError = (error: Event) => {
        if (!isMountedRef.current) return;
        setIsConnected(false);

        if (error.type === 'auth-error' || (error as any).message?.includes('Session expired')) {
          setAuthError('Your session has expired. Please log in again.');
        }
      };

      handlersRef.current.handleConnect = () => {
        if (!isMountedRef.current) return;
        setIsConnected(true);
      };
    }

    websocketService.connect(
      WS_URL,
      handlersRef.current.handleMessage!,
      handlersRef.current.handleError!,
      handlersRef.current.handleConnect!
    );

    setTimeout(() => {
      if (websocketService.isConnected() && isMountedRef.current) {
        setIsConnected(true);
      }
    }, 100);

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || !wsRef.current.isConnected()) {
      return;
    }
    wsRef.current.send(message);
    setIsLoading(true);
    setCurrentMessage('');
  }, []);

  return {
    isConnected,
    messages,
    currentMessage,
    isLoading,
    authError,
    sendMessage,
  };
};
