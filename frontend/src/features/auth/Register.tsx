import React from 'react';
import { useRegister } from './Register.ts';
import Button from '../../common/Button';
import Input from '../../common/Input';
import './Register.css';

const Register: React.FC = () => {
  const {
    email,
    password,
    confirmPassword,
    error,
    isLoading,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  } = useRegister();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Register</h1>
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
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={error}
          />
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <p className="auth-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;

