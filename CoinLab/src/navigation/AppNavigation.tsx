import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainNavigation from './MainNavigation';
import AuthNavigation from './AuthNavigation';
import AgentDetailScreen from '../screens/Main/AgentDetailScreen';

// Define stack navigator params
export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  AgentDetail: { agentId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Main"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Main" component={MainNavigation} />
        <Stack.Screen name="Auth" component={AuthNavigation} />
        <Stack.Screen name="AgentDetail" component={AgentDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation; 