import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';

// Screens
import HomeScreen from '../screens/Main/HomeScreen';
import AgentsScreen from '../screens/Main/AgentsScreen';
import HelpScreen from '../screens/Main/HelpScreen';
import HistoryScreen from '../screens/Main/HistoryScreen';

// Theme
import COLORS from '../theme/colors';

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.navBar,
          borderTopColor: COLORS.navBar,
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 6,
          paddingTop: 4,
          elevation: 0,
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: { height: 0, width: 0 },
        },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: '#777777',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 2,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size + 3} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Agents" 
        component={AgentsScreen} 
        options={{
          tabBarLabel: 'Agentes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" color={color} size={size + 3} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Help" 
        component={HelpScreen} 
        options={{
          tabBarLabel: 'Ayuda',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="help-circle-outline" color={color} size={size + 3} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{
          tabBarLabel: 'Historial',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" color={color} size={size + 3} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigation; 