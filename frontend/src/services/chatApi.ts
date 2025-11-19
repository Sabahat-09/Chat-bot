import api from './api';

export interface ChatHistoryItem {
  id: number;
  message: string;
  response: string;
  created_at: string;
}

export const chatApi = {
  /**
   * Fetch chat history for the current user
   * @param limit Maximum number of messages to fetch (default: 50)
   * @returns Array of chat history items
   */
  async getChatHistory(limit: number = 50): Promise<ChatHistoryItem[]> {
    try {
      const response = await api.get<ChatHistoryItem[]>('/chat/history', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('[ChatAPI] Error fetching chat history:', error);
      throw error;
    }
  }
};
