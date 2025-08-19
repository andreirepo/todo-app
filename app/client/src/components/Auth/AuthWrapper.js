import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { loadUser, logoutUser } from '../../common/thunks/authThunks';
import { clearErrors } from '../../common/reducers/auth';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import TodoList from '../TodoList/TodoList';
import './Auth.css';

const AuthWrapper = ({ 
  isAuthenticated, 
  loading, 
  user, 
  token,
  onLoadUser, 
  onLogout,
  onClearErrors
}) => {
  const [showRegister, setShowRegister] = useState(false);

  // Load user on component mount if token exists
  useEffect(() => {
    if (token && !user) {
      onLoadUser();
    }
  }, [token, user, onLoadUser]);

  // Clear errors when switching between forms
  useEffect(() => {
    onClearErrors();
  }, [showRegister, onClearErrors]);

  // Show loading spinner while checking authentication
  if (loading && isAuthenticated === null) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
        <div className="auth-loading-text">Loading...</div>
      </div>
    );
  }

  // Show todo app if user is authenticated
  if (isAuthenticated && user) {
    return (
      <div className="todo-app">
        <header className="todo-header">
          <div className="todo-header-content">
            <h1>My Todo App</h1>
            <p>Welcome back, {user.name}!</p>
          </div>
          <button
            onClick={onLogout}
            className="logout-button"
          >
            Logout
          </button>
        </header>
        <div className="todo-content">
          <TodoList />
        </div>
      </div>
    );
  }

  // Show authentication forms if not authenticated
  return (
    <div>
      {showRegister ? (
        <RegisterForm 
          onSwitchToLogin={() => setShowRegister(false)}
        />
      ) : (
        <LoginForm 
          onSwitchToRegister={() => setShowRegister(true)}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  user: state.auth.user,
  token: state.auth.token
});

const mapDispatchToProps = (dispatch) => ({
  onLoadUser: () => dispatch(loadUser()),
  onLogout: () => dispatch(logoutUser()),
  onClearErrors: () => dispatch(clearErrors())
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthWrapper);