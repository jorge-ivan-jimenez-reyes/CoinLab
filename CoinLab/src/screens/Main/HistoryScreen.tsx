import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets/index';
import { ResponsiveScreenLayout } from '../../components/Layout';

interface Transaction {
  id: string;
  agentName: string;
  actionType: 'Venta' | 'Compra';
  amount: string;
  cryptocurrency: string;
  timestamp?: string;
}

const transactionData: Transaction[] = [
  {
    id: '1',
    agentName: 'Agente 1',
    actionType: 'Venta',
    amount: '$20,000',
    cryptocurrency: 'Bitcoin',
    timestamp: '15 min ago'
  },
  {
    id: '2',
    agentName: 'Agente 1',
    actionType: 'Compra',
    amount: '$2,000',
    cryptocurrency: 'Bitcoin',
    timestamp: '30 min ago'
  },
  {
    id: '3',
    agentName: 'Agente 1',
    actionType: 'Venta',
    amount: '$3,006.89',
    cryptocurrency: 'Bitcoin',
    timestamp: '1 hour ago'
  },
  {
    id: '4',
    agentName: 'Agente 1',
    actionType: 'Compra',
    amount: '$20,000',
    cryptocurrency: 'Etherium',
    timestamp: '2 hours ago'
  },
  {
    id: '5',
    agentName: 'Agente 1',
    actionType: 'Compra',
    amount: '$2,000',
    cryptocurrency: 'Etherium',
    timestamp: '3 hours ago'
  },
  {
    id: '6',
    agentName: 'Agente 1',
    actionType: 'Venta',
    amount: '$3,006.89',
    cryptocurrency: 'Bitcoin',
    timestamp: '5 hours ago'
  }
];

const HistoryScreen = () => {
  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionRow}>
      <View style={styles.agentSection}>
        <Image source={IMAGES.USER_ICON} style={styles.agentIcon} />
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>{item.agentName}</Text>
          <Text style={styles.actionType}>{item.actionType}</Text>
        </View>
      </View>
      
      <View style={styles.amountSection}>
        <Text style={styles.amount}>{item.amount}</Text>
        <Text style={styles.cryptocurrency}>{item.cryptocurrency}</Text>
      </View>
    </View>
  );

  const HeaderComponent = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Transacciones</Text>
      {transactionData.length > 0 && (
        <Text style={styles.lastUpdated}>
          Actualizado: {transactionData[0].timestamp}
        </Text>
      )}
    </View>
  );
  
  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <ResponsiveScreenLayout
      title="Historial de Transacciones"
      backgroundImage={IMAGES.CARD_BACKGROUND}
      profit="Total Operaciones"
      amount={transactionData.length.toString()}
      currencySymbol=""
      disableColorChange={true}
    >
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          data={transactionData}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={HeaderComponent}
          ItemSeparatorComponent={renderSeparator}
        />
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={36} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </ResponsiveScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  flatList: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  lastUpdated: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    width: '100%',
  },
  agentSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentIcon: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 15,
    resizeMode: 'contain',
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
  actionType: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  amountSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cryptocurrency: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    width: '100%',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  }
});

export default HistoryScreen; 