import React from 'react';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';

const AppPovider: React.FC = ({ children }) => {
  return (
    <>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </>
  );
};

export default AppPovider;
