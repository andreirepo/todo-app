import React from 'react';
import { createRoot } from 'react-dom/client';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import { configureStore } from '../src/common/store/index';
import App from '../src/components/App/App';

const store = configureStore();
const persistor = persistStore(store);

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
