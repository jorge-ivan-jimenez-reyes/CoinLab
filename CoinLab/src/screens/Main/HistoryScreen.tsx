import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets/index';
import { ResponsiveScreenLayout } from '../../components/Layout';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  coin: string;
  amount: string;
  price: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

const transactionData: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    coin: 'Bitcoin',
    amount: '0.05 BTC',
    price: '$2,350',
    date: '22/06/2023',
    status: 'completed'
  },
  {
    id: '2',
    type: 'sell',
    coin: 'Ethereum',
    amount: '1.2 ETH',
    price: '$1,860',
    date: '20/06/2023',
    status: 'completed'
  },
  {
    id: '3',
    type: 'transfer',
    coin: 'USDT',
    amount: '500 USDT',
    price: '$500',
    date: '18/06/2023',
    status: 'completed'
  },
  {
    id: '4',
    type: 'buy',
    coin: 'Cardano',
    amount: '500 ADA',
    price: '$145',
    date: '15/06/2023',
    status: 'pending'
  },
  {
    id: '5',
    type: 'sell',
    coin: 'Solana',
    amount: '10 SOL',
    price: '$230',
    date: '10/06/2023',
    status: 'failed'
  }
];

const HistoryScreen = () => {
  const getIconName = (type: Transaction['type']) => {
    switch (type) {
      case 'buy': return 'arrow-down-outline';
      case 'sell': return 'arrow-up-outline';
      case 'transfer': return 'swap-horizontal-outline';
      default: return 'help-outline';
    }
  };

  const getIconColor = (type: Transaction['type']) => {
    switch (type) {
      case 'buy': return COLORS.success;
      case 'sell': return COLORS.danger;
      case 'transfer': return COLORS.primary;
      default: return COLORS.mediumGray;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return COLORS.success;
      case 'pending': return COLORS.warning;
      case 'failed': return COLORS.danger;
      default: return COLORS.mediumGray;
    }
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={getIconName(item.type)} 
          size={24} 
          color={getIconColor(item.type)} 
        />
      </View>
      
      <View style={styles.transactionDetails}>
        <View style={styles.transactionHeader}>
          <Text style={styles.coinName}>{item.coin}</Text>
          <Text style={styles.amount}>{item.amount}</Text>
        </View>
        
        <View style={styles.transactionFooter}>
          <Text style={styles.date}>{item.date}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.statusIndicator, {backgroundColor: getStatusColor(item.status)}]} />
    </View>
  );

  const ListHeaderComponent = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filtros:</Text>
      <View style={styles.filterPills}>
        <View style={[styles.filterPill, styles.activePill]}>
          <Text style={styles.activePillText}>Todos</Text>
        </View>
        <View style={styles.filterPill}>
          <Text style={styles.pillText}>Compras</Text>
        </View>
        <View style={styles.filterPill}>
          <Text style={styles.pillText}>Ventas</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ResponsiveScreenLayout
      title="Historial"
      backgroundImage={IMAGES.CARD_BACKGROUND}
      profit="Total Transacciones"
      amount="256"
      amountLabel="USD"
      contentPadding={0}
    >
      <FlatList
        style={styles.flatList}
        data={transactionData}
        renderItem={renderTransactionItem}
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
  filterContainer: {
    marginBottom: 20,
    width: '100%',
    marginTop: 0,
    borderWidth: 0,
    borderTopWidth: 0,
    paddingTop: 0,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  filterPills: {
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    marginRight: 10,
  },
  activePill: {
    backgroundColor: COLORS.primary,
  },
  pillText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  activePillText: {
    color: COLORS.white,
    fontWeight: '500',
  },
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  coinName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  amount: {
    fontSize: 16,
    color: COLORS.text,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
});

export default HistoryScreen; 