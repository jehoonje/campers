// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppContent from './AppContent'; // 메인 앱 내용

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
