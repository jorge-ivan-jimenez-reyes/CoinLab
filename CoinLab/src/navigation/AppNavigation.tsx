import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigation from './MainNavigation';
import AuthNavigation from './AuthNavigation';
import AgentDetailScreen from '../screens/Main/AgentDetailScreen';
import { useAuth } from '../context/AuthContext';

// Define stack navigator params
export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  AgentDetail: { agentId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isAuthenticated ? "Main" : "Auth"}
        screenOptions={{ headerShown: false }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainNavigation} />
            <Stack.Screen name="AgentDetail" component={AgentDetailScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigation} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation; 