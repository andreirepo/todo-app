import React, { useState } from 'react';
import { connect } from 'react-redux';
import { registerUser } from '../../common/thunks/authThunks';
import './Auth.css';

const RegisterForm = ({ onRegister, onSwitchToLogin, loading, error }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [validationError, setValidationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    // Clear validation error and submit
    setValidationError('');
    onRegister({ name, email, password });
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start organizing your tasks today</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="name" className="auth-label">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="auth-input"
            value={name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="auth-input"
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
              value={password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Minimum 6 characters"
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

        <div className="auth-field">
          <label htmlFor="confirmPassword" className="auth-label">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              className="auth-input password-input"
              value={confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        
        {(error || validationError) && (
          <div className="auth-error">
            {validationError || error}
          </div>
        )}
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      
      <div className="auth-switch">
        <p className="auth-switch-text">Already have an account?</p>
        <button 
          type="button" 
          className="auth-switch-button"
          onClick={onSwitchToLogin}
        >
          Sign in instead
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
  onRegister: (userData) => dispatch(registerUser(userData))
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);