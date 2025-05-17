import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../../theme/colors';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>CoinLab</Text>
        <Text style={styles.subtitle}>Home</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bienvenido a CoinLab</Text>
          <Text style={styles.cardText}>
            Tu plataforma de criptomonedas donde podrás monitorear precios,
            gestionar tu portafolio y más.
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Funcionalidades</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Monitoreo de Precios</Text>
            <Text style={styles.featureText}>
              Sigue los precios de las principales criptomonedas en tiempo real.
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Portafolio</Text>
            <Text style={styles.featureText}>
              Gestiona tus inversiones en un solo lugar.
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Alertas</Text>
            <Text style={styles.featureText}>
              Configura alertas para precios específicos.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mediumGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
});

export default HomeScreen; 