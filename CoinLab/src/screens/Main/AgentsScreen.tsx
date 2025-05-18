import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Dimensions, Animated, Platform } from 'react-native';
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

interface Agent {
  id: string;
  name: string;
  description: string;
}

const agentsData: Agent[] = [
  { id: '1', name: 'Agente Alpha', description: 'Especializado en trading automático de Bitcoin' },
  { id: '2', name: 'Agente Beta', description: 'Enfocado en detección de patrones en altcoins' },
  { id: '3', name: 'Agente Delta', description: 'Algoritmo de inversión a largo plazo' },
  { id: '4', name: 'Agente Gamma', description: 'Estrategias de trading de alta frecuencia' },
  { id: '5', name: 'Agente Omega', description: 'Análisis de sentimiento en redes sociales' },
];

const AgentsScreen = () => {
  // Estado para el espacio reservado para el header
  const [headerSpacing, setHeaderSpacing] = useState(COLLAPSED_HEIGHT);
  // Estado para seguir si el header está expandido
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);

  // Manejar cambios de altura
  const handleHeaderHeightChange = (height: number) => {
    console.log(`Header height changed to: ${height}`);
    setHeaderSpacing(height);
  };

  // Manejar cambios de estado expandido/contraído
  const handleHeaderExpand = (expanded: boolean) => {
    console.log(`Header expanded state: ${expanded}`);
    setIsHeaderExpanded(expanded);
    // También podemos actualizar el espacio inmediatamente para evitar retrasos
    const newHeight = expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
    console.log(`Setting header spacing to: ${newHeight}`);
    setHeaderSpacing(newHeight);
  };

  const renderAgentItem = ({ item }: { item: Agent }) => (
    <View style={styles.agentCard}>
      <Text style={styles.agentName}>{item.name}</Text>
      <Text style={styles.agentDescription}>{item.description}</Text>
      <View style={styles.agentStatus}>
        <View style={styles.statusIndicator} />
        <Text style={styles.statusText}>Activo</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Vista con padding superior para reservar espacio para el header */}
      <View style={[styles.content, { paddingTop: headerSpacing + STATUS_BAR_HEIGHT + SAFE_PADDING }]}>
        <Text style={styles.sectionTitle}>Agentes Disponibles</Text>
        <Text style={styles.sectionDescription}>
          Los agentes son algoritmos automatizados que te ayudan a gestionar tus inversiones.
        </Text>
        
        <FlatList
          data={agentsData}
          renderItem={renderAgentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
      
      {/* Header que se coloca encima usando position:absolute */}
      <View style={styles.headerContainer}>
        <HeaderCard 
          title="Agentes" 
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
    top: STATUS_BAR_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
    lineHeight: 22,
  },
  listContainer: {
    paddingBottom: 20,
  },
  agentCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  agentDescription: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  agentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.success,
  },
});

export default AgentsScreen; 