import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './componenet/context/AuthProvider';
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const store = configureStore({
  reducer: {}
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);


