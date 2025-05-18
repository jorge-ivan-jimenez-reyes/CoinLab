import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from 'react-native-vector-icons';
import COLORS from '../../theme/colors';
import { HeaderCard } from '../../components/Header';
import { IMAGES } from '../../assets/index';

// Obtener dimensiones para hacer el header responsivo
const { height } = Dimensions.get('window');
// Calcular la altura máxima que necesitamos para el contenedor
const HEADER_CONTAINER_HEIGHT = Math.min(height * 0.08, 70); // Reducido para eliminar el espacio en blanco

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.headerContainer}>
        <HeaderCard 
          title="Historial" 
          backgroundImage={IMAGES.CARD_BACKGROUND}
        />
      </View>
      
      <View style={styles.content}>
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
        
        <FlatList
          data={transactionData}
          renderItem={renderTransactionItem}
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
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    height: HEADER_CONTAINER_HEIGHT,
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: HEADER_CONTAINER_HEIGHT - 10, // Reducir el espacio para acercar el contenido al header
  },
  filterContainer: {
    marginBottom: 20,
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
  listContainer: {
    paddingBottom: 20,
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
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
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
    marginBottom: 6,
  },
  coinName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
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
    color: COLORS.textLight,
    fontWeight: '500',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default HistoryScreen; 