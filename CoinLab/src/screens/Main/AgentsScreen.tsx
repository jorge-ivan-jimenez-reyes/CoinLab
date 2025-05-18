import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets/index';
import { ResponsiveScreenLayout } from '../../components/Layout';
import { Ionicons } from 'react-native-vector-icons';
import { useData, Agent } from '../../context/DataContext';

const AgentsScreen = () => {
  const { agents, agentPortfolio, addAgent } = useData();

  const renderAgentItem = ({ item }: { item: Agent }) => (
    <View style={styles.agentCard}>
      <View style={styles.leftContent}>
        <Image source={IMAGES.USER_ICON} style={styles.agentIcon} />
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>{item.name}</Text>
          <Text style={styles.agentType}>Criptomonedas</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.agentAmount}>${item.investment}</Text>
        <Text style={styles.cryptoNames}>
          {item.id === '1' ? 'Bitcoin, Etherium' : 
           item.id === '2' ? 'Binance' : 
           'Doge'}
        </Text>
      </View>
    </View>
  );

  const handleAddAgent = () => {
    const newAgent = {
      name: 'Nuevo Agente',
      description: 'Descripción del nuevo agente',
      status: 'inactive' as const,
      investment: '0.00',
      profit: '+0.00',
      profitPercentage: '+0.00%'
    };
    
    addAgent(newAgent);
  };

  const HeaderComponent = () => (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Agentes</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddAgent}
        >
          <View style={styles.addButtonContent}>
            <Ionicons name="add" size={18} color={COLORS.white} />
            <Text style={styles.addButtonText}>Nuevo Agente</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListSeparator = () => <View style={styles.separator} />;

  return (
    <ResponsiveScreenLayout
      title="Cantidad total en agentes"
      backgroundImage={IMAGES.CARD_BACKGROUND}
      profit="Beneficio Total"
      amount={agentPortfolio.totalInvested}
      amountLabel="USD"
      profitPercentage="+$2,125.78 (5.6%)"
    >
      <FlatList
        style={styles.flatList}
        data={agents.slice(0, 3)} // Limitamos a 3 agentes para coincidir con el diseño
        renderItem={renderAgentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<HeaderComponent />}
        ItemSeparatorComponent={ListSeparator}
      />
    </ResponsiveScreenLayout>
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 60,
  },
  header: {
    paddingVertical: 15,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  agentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    marginRight: 15,
    resizeMode: 'cover',
  },
  agentInfo: {
    justifyContent: 'center',
  },
  agentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  agentType: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  agentAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cryptoNames: {
    fontSize: 16,
    color: COLORS.text,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#222222',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  }
});

export default AgentsScreen; 