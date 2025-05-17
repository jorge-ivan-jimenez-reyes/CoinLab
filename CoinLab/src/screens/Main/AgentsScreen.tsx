import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>CoinLab</Text>
        <Text style={styles.subtitle}>Agentes</Text>
      </View>
      
      <View style={styles.content}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    lineHeight: 22,
  },
  listContainer: {
    paddingBottom: 20,
  },
  agentCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  agentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  agentDescription: {
    fontSize: 14,
    color: '#CCCCCC',
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
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
  },
});

export default AgentsScreen; 