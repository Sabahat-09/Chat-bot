interface Message {
  type: 'user' | 'assistant' | 'error';
  content: string;
}

interface UseMessageListProps {
  messages: Message[];
  currentMessage: string;
}

export const useMessageList = ({ messages }: UseMessageListProps) => {
  const displayMessages = [...messages];

  return {
    displayMessages,
  };
};

