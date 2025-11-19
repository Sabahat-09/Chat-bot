import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../hooks/useAuth';

export const useRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password);
      navigate('/chat');
    } catch (err: any) {
      // Handle different error response formats
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response?.data?.detail) {
        // If detail is a string, use it directly
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        }
        // If detail is an array (validation errors), extract messages
        else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail
            .map((e: any) => e.msg || JSON.stringify(e))
            .join(', ');
        }
        // If detail is an object, stringify it
        else if (typeof err.response.data.detail === 'object') {
          errorMessage = JSON.stringify(err.response.data.detail);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    confirmPassword,
    error,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  };
};

