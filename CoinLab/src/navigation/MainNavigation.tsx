import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Screens
import HomeScreen from '../screens/Main/HomeScreen';
import AgentsScreen from '../screens/Main/AgentsScreen';
import HelpScreen from '../screens/Main/HelpScreen';
import HistoryScreen from '../screens/Main/HistoryScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';

// Theme
import COLORS from '../theme/colors';

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: 'transparent',
          borderTopWidth: 0,
          height: 75,
          paddingBottom: 8,
          paddingTop: 12,
          elevation: 0,
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowOffset: { height: 0, width: 0 },
          position: 'absolute',
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            style={styles.tabBarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: -5,
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size + 5} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Agents" 
        component={AgentsScreen} 
        options={{
          tabBarLabel: 'Agentes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" color={color} size={size + 5} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="Help" 
        component={HelpScreen} 
        options={{
          tabBarLabel: 'Ayuda',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-outline" color={color} size={size + 5} />
          ),
        }}
      />
      
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{
          tabBarLabel: 'Historial',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size + 5} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarGradient: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});

export default MainNavigation; 