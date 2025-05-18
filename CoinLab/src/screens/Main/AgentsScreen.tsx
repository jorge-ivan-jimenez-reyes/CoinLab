import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets/index';
import { ResponsiveScreenLayout } from '../../components/Layout';

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

  const ListHeaderComponent = () => (
    <View style={styles.header}>
      <Text style={styles.sectionTitle}>Agentes Disponibles</Text>
      <Text style={styles.sectionDescription}>
        Los agentes son algoritmos automatizados que te ayudan a gestionar tus inversiones.
      </Text>
    </View>
  );

  return (
    <ResponsiveScreenLayout
      title="Agentes"
      backgroundImage={IMAGES.CARD_BACKGROUND}
      profit="Rendimiento Total"
      amount="12,458.37"
      amountLabel="USD"
      contentPadding={0}
    >
      <FlatList
        style={styles.flatList}
        data={agentsData}
        renderItem={renderAgentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeaderComponent />}
      />
    </ResponsiveScreenLayout>
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
    borderWidth: 0,
    borderTopWidth: 0,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 60,
    width: '100%',
    borderWidth: 0,
    borderTopWidth: 0,
    paddingTop: 0,
  },
  header: {
    marginBottom: 10,
    width: '100%',
    marginTop: 0,
    borderWidth: 0,
    borderTopWidth: 0,
    paddingTop: 0,
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
  agentCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    width: '100%',
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