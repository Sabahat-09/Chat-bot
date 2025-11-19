import { useAuthStore } from './useAuth';

export const useRole = () => {
  const user = useAuthStore((state) => state.user);

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  return {
    isAdmin,
    isUser,
    role: user?.role,
  };
};

