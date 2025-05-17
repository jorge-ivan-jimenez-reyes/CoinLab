import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Navigators
import AuthNavigation from './AuthNavigation';
import MainNavigation from './MainNavigation';

// Context
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const AppNavigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigation} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation; 