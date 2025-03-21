import React from 'react';
import TodoList from '../TodoList/TodoList';
import { ToastContainer } from 'react-toastify';
import './App.css';

const App = () => (
  <div className="container">
    <TodoList />
    <ToastContainer
      position="top-right" 
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={false}
      rtl={false}
      pauseOnFocusLoss
    />
  </div>
);

export default App;