import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets/index';
import { ResponsiveScreenLayout } from '../../components/Layout';

const HomeScreen = () => {
  return (
    <ResponsiveScreenLayout
      title="Home"
      backgroundImage={IMAGES.CARD_BACKGROUND}
      profit="Beneficio Total"
      amount="25,006.89"
      amountLabel="USD"
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
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
        </View>
      </ScrollView>
    </ResponsiveScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  cardContainer: {
    paddingHorizontal: 15,
    width: '100%',
  },
  card: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    width: '100%',
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
    width: '100%',
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
    width: '100%',
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