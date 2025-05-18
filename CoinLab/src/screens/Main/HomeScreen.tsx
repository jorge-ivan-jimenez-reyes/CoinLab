import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Dimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../../theme/colors';
import { HeaderCard } from '../../components/Header';
import { IMAGES } from '../../assets/index';

// Obtener dimensiones para hacer el header responsivo
const { height } = Dimensions.get('window');
// Calcular la altura para los estados contraído y expandido
const COLLAPSED_HEIGHT = Math.min(height * 0.09, 75);
const EXPANDED_HEIGHT = Math.min(height * 0.20, 160);
// Margen superior para evitar la barra de estado
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : 24;
// Padding adicional para asegurar que los elementos no se corten
const SAFE_PADDING = 5;

const HomeScreen = () => {
  // Estado para el espacio reservado para el header
  const [headerSpacing, setHeaderSpacing] = useState(COLLAPSED_HEIGHT);
  // Estado para seguir si el header está expandido
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  // Manejar cambios de altura
  const handleHeaderHeightChange = (height: number) => {
    console.log(`Home - Header height changed to: ${height}`);
    setHeaderSpacing(height);
  };

  // Manejar cambios de estado expandido/contraído
  const handleHeaderExpand = (expanded: boolean) => {
    console.log(`Home - Header expanded state: ${expanded}`);
    setIsHeaderExpanded(expanded);
    // También podemos actualizar el espacio inmediatamente para evitar retrasos
    const newHeight = expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
    console.log(`Home - Setting header spacing to: ${newHeight}`);
    setHeaderSpacing(newHeight);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Vista con padding superior para reservar espacio para el header */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={[styles.contentContainer, { paddingTop: headerSpacing + STATUS_BAR_HEIGHT + SAFE_PADDING }]}
        showsVerticalScrollIndicator={false}
      >
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
      
      {/* Header que se coloca encima usando position:absolute */}
      <View style={styles.headerContainer}>
        <HeaderCard 
          title="Home" 
          backgroundImage={IMAGES.CARD_BACKGROUND}
          onHeightChange={handleHeaderHeightChange}
          onExpand={handleHeaderExpand}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT, // Usar la constante para el margen superior
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
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