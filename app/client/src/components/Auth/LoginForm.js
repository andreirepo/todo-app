import React, { useState } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../../common/thunks/authThunks';
import './Auth.css';

const LoginForm = ({ onLogin, onSwitchToRegister, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  return (
    <div className="auth-container" data-id="login-form">
      <div className="auth-header">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="auth-input"
            data-id="email-input"
            value={email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div className="auth-field">
          <label htmlFor="password" className="auth-label">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="auth-input password-input"
              data-id="password-input"
              value={password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        {error && <div className="auth-error" data-id="error-message">{error}</div>}
        
        <button 
          type="submit" 
          className="auth-button"
          data-id="sign-in-button"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      
      <div className="auth-switch">
        <p className="auth-switch-text">Don't have an account?</p>
        <button 
          type="button" 
          className="auth-switch-button"
          onClick={onSwitchToRegister}
        >
          Create an account
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  error: state.auth.error
});

const mapDispatchToProps = (dispatch) => ({
  onLogin: (userData) => dispatch(loginUser(userData))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);