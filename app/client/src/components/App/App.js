import React from 'react';
import AuthWrapper from '../Auth/AuthWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => (
  <div className="app">
    <div className="container">
      <AuthWrapper />
    </div>
    <footer className="app-footer">
      <p className="footer-text">
        Built with ❤️ by <a href="https://github.com/andreirepo" target="_blank" rel="noopener noreferrer" className="footer-link">Andrei</a>
      </p>
    </footer>
    <ToastContainer
      position="top-right" 
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={false}
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      closeOnClick={true}
      closeButton={true}
    />
  </div>
);

export default App;