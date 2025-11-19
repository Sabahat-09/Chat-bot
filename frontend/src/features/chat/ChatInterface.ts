import { useState, useMemo, useRef, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { WebSocketMessage } from '../../services/websocket';
import { chatApi, ChatHistoryItem } from '../../services/chatApi';

interface ChatMessage {
  type: 'user' | 'assistant' | 'error';
  content: string;
  id?: string;
}

export const useChatInterface = () => {
  const { isConnected, messages: wsMessages, currentMessage, isLoading, authError, sendMessage: wsSendMessage } = useWebSocket();
  const [userMessages, setUserMessages] = useState<ChatMessage[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [historicalMessages, setHistoricalMessages] = useState<ChatMessage[]>([]);
  const messageIdCounter = useRef(0);
  const pendingUserMessages = useRef<Map<number, ChatMessage>>(new Map());

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await chatApi.getChatHistory(50);
        const convertedMessages: ChatMessage[] = [];
        history.forEach((item: ChatHistoryItem) => {
          convertedMessages.push({
            type: 'user',
            content: item.message,
            id: `history-user-${item.id}`
          });
          convertedMessages.push({
            type: 'assistant',
            content: item.response,
            id: `history-assistant-${item.id}`
          });
        });
        setHistoricalMessages(convertedMessages);
        setHistoryLoaded(true);
      } catch (error) {
        setHistoryLoaded(true);
      }
    };

    loadHistory();
  }, []);

  // Track when assistant messages arrive to pair them with user messages
  useEffect(() => {
    if (wsMessages.length > 0) {
      const lastWsMessage = wsMessages[wsMessages.length - 1];
      // When a new assistant message arrives, it corresponds to the oldest pending user message
      const pendingEntries = Array.from(pendingUserMessages.current.entries());
      if (pendingEntries.length > 0) {
        const [id, userMsg] = pendingEntries[0];
        pendingUserMessages.current.delete(id);
      }
    }
  }, [wsMessages]);

  const messages = useMemo(() => {
    const combined: ChatMessage[] = [...historicalMessages];
    const maxLength = Math.max(userMessages.length, wsMessages.length);

    for (let i = 0; i < maxLength; i++) {
      if (i < userMessages.length) {
        combined.push(userMessages[i]);
      }

      if (i < wsMessages.length) {
        const wsMsg = wsMessages[i];
        if (wsMsg.type === 'error') {
          combined.push({
            type: 'error',
            content: wsMsg.error || 'An error occurred',
          });
        } else if (wsMsg.type === 'message') {
          combined.push({
            type: 'assistant',
            content: wsMsg.content || '',
          });
        }
      }
    }

    return combined;
  }, [historicalMessages, userMessages, wsMessages]);

  const sendMessage = (message: string) => {
    const id = messageIdCounter.current++;
    const userMessage: ChatMessage = { type: 'user', content: message, id: `user-${id}` };

    setUserMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.content === message && lastMessage.type === 'user') {
        return prev;
      }
      const exists = prev.some(msg => msg.content === message && msg.type === 'user' && msg.id !== userMessage.id);
      if (exists) {
        return prev;
      }
      return [...prev, userMessage];
    });

    wsSendMessage(message);
  };

  return {
    messages,
    currentMessage,
    isLoading,
    authError,
    historyLoaded,
    sendMessage,
    isConnected,
  };
};

