import React from 'react';
import { useLogin } from './Login.ts';
import Button from '../../common/Button';
import Input from '../../common/Input';
import './Login.css';

const Login: React.FC = () => {
  const {
    email,
    password,
    error,
    isLoading,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLogin();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
            error={error}
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            error={error}
          />
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <p className="auth-link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

