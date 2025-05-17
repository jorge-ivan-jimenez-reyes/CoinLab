import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../../theme/colors';

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  coin: string;
  amount: string;
  price: string;
  date: string;
}

const transactionsData: Transaction[] = [
  {
    id: '1',
    type: 'buy',
    coin: 'Bitcoin',
    amount: '0.05 BTC',
    price: '$3,241.50',
    date: '15 Oct 2023'
  },
  {
    id: '2',
    type: 'sell',
    coin: 'Ethereum',
    amount: '1.2 ETH',
    price: '$2,145.32',
    date: '10 Oct 2023'
  },
  {
    id: '3',
    type: 'buy',
    coin: 'Solana',
    amount: '10 SOL',
    price: '$840.50',
    date: '5 Oct 2023'
  },
  {
    id: '4',
    type: 'buy',
    coin: 'Cardano',
    amount: '100 ADA',
    price: '$120.80',
    date: '28 Sep 2023'
  },
  {
    id: '5',
    type: 'sell',
    coin: 'Bitcoin',
    amount: '0.02 BTC',
    price: '$1,297.44',
    date: '20 Sep 2023'
  }
];

const HistoryScreen = () => {
  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <Text style={styles.coinName}>{item.coin}</Text>
        <Text 
          style={[
            styles.transactionType, 
            { color: item.type === 'buy' ? COLORS.success : COLORS.error }
          ]}
        >
          {item.type === 'buy' ? 'Compra' : 'Venta'}
        </Text>
      </View>
      
      <View style={styles.transactionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Monto:</Text>
          <Text style={styles.detailValue}>{item.amount}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Precio:</Text>
          <Text style={styles.detailValue}>{item.price}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fecha:</Text>
          <Text style={styles.detailValue}>{item.date}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>CoinLab</Text>
        <Text style={styles.subtitle}>Historial</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Historial de Transacciones</Text>
        <Text style={styles.sectionDescription}>
          Revisa el historial completo de tus operaciones.
        </Text>
        
        <FlatList
          data={transactionsData}
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
  transactionCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  coinName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDetails: {
    borderTopWidth: 1,
    borderTopColor: COLORS.mediumGray,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.mediumGray,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default HistoryScreen; 