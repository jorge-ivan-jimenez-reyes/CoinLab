import './global.css';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './src/navigation/AppNavigation';
import { AuthProvider } from './src/context/AuthContext';
import { HeaderProvider } from './src/context/HeaderContext';
import { DataProvider } from './src/context/DataContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <HeaderProvider>
          <DataProvider>
            <AppNavigation />
          </DataProvider>
        </HeaderProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
