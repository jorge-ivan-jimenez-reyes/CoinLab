import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ImageSourcePropType } from 'react-native';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets/index';
import { ResponsiveScreenLayout } from '../../components/Layout';
import { Ionicons } from 'react-native-vector-icons';

// Types for cryptocurrency data
interface Cryptocurrency {
  id: string;
  name: string;
  icon: ImageSourcePropType;
  agresividad?: string;
  intensidad?: string;
  tiempo: string;
  price: string;
  percentage: string;
  priceUp: boolean;
}

// Types for movement data
interface Movement {
  id: string;
  type: string;
  action: string;
  icon: ImageSourcePropType;
  amount: string;
  currency: string;
  priceUp: boolean;
}

// Sample data for cryptocurrencies
const cryptocurrencies: Cryptocurrency[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    icon: IMAGES.BITCOIN, 
    agresividad: 'Baja',
    tiempo: '2 días',
    price: '+$1297.98',
    percentage: '7.87%',
    priceUp: true
  },
  {
    id: 'ethereum',
    name: 'Etherum',
    icon: IMAGES.ETHEREUM,
    intensidad: 'Alta',
    tiempo: '17 días',
    price: '+$827.8',
    percentage: '23.21%',
    priceUp: true
  }
];

// Sample data for recent movements
const recentMovements: Movement[] = [
  {
    id: 'movement1',
    type: 'Largo Plazo',
    action: 'Venta',
    icon: IMAGES.USER_ICON,
    amount: '-$340.8',
    currency: 'Bitcoin',
    priceUp: false
  }
];

const CryptoCard: React.FC<{ crypto: Cryptocurrency }> = ({ crypto }) => {
  return (
    <View style={styles.cryptoCard}>
      <View style={styles.cryptoLeft}>
        <Image source={crypto.icon} style={styles.cryptoIcon} />
        <View style={styles.cryptoInfo}>
          <Text style={styles.cryptoName}>{crypto.name}</Text>
          <Text style={styles.cryptoDetails}>
            {crypto.agresividad ? `Agresividad: ${crypto.agresividad}` : `Intensidad: ${crypto.intensidad}`}
          </Text>
          <Text style={styles.cryptoDetails}>Tiempo: {crypto.tiempo}</Text>
        </View>
      </View>
      <View style={styles.cryptoRight}>
        <Text style={[styles.cryptoPrice, crypto.priceUp ? styles.priceUp : styles.priceDown]}>
          {crypto.price}
        </Text>
        <View style={styles.percentageContainer}>
          <Ionicons 
            name={crypto.priceUp ? "arrow-up" : "arrow-down"} 
            size={16} 
            color={crypto.priceUp ? COLORS.success : COLORS.error} 
          />
          <Text style={styles.percentage}>
            {crypto.percentage}
          </Text>
        </View>
      </View>
    </View>
  );
};

const MovementCard: React.FC<{ movement: Movement }> = ({ movement }) => {
  return (
    <View style={styles.movementCard}>
      <View style={styles.movementLeft}>
        <Image source={movement.icon} style={styles.userIcon} />
        <View style={styles.movementInfo}>
          <Text style={styles.movementType}>{movement.type}</Text>
          <Text style={styles.movementAction}>{movement.action}</Text>
        </View>
      </View>
      <View style={styles.movementRight}>
        <Text style={[styles.movementAmount, movement.priceUp ? styles.priceUp : styles.priceDown]}>
          {movement.amount}
        </Text>
        <Text style={styles.movementCurrency}>{movement.currency}</Text>
      </View>
    </View>
  );
};

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
          {/* Mercado Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mercado</Text>
            
            {cryptocurrencies.map(crypto => (
              <CryptoCard key={crypto.id} crypto={crypto} />
            ))}
          </View>
          
          {/* Últimos Movimientos Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
            
            {recentMovements.map(movement => (
              <MovementCard key={movement.id} movement={movement} />
            ))}
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
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  cardContainer: {
    paddingHorizontal: 15,
    width: '100%',
  },
  section: {
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    marginTop: 10,
  },
  // Crypto card styles
  cryptoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cryptoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoIcon: {
    width: 45,
    height: 45,
    marginRight: 15,
    borderRadius: 22.5,
    resizeMode: 'contain',
    padding: 5,
  },
  cryptoInfo: {
    justifyContent: 'center',
  },
  cryptoName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cryptoDetails: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  cryptoRight: {
    alignItems: 'flex-end',
  },
  cryptoPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 2,
    color: COLORS.text,
  },
  priceUp: {
    color: COLORS.success,
  },
  priceDown: {
    color: COLORS.error,
  },
  // Movement card styles
  movementCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  movementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 45,
    height: 45,
    marginRight: 15,
    borderRadius: 22.5,
    resizeMode: 'contain',
    padding: 5,
  },
  movementInfo: {
    justifyContent: 'center',
  },
  movementType: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  movementAction: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  movementRight: {
    alignItems: 'flex-end',
  },
  movementAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  movementCurrency: {
    fontSize: 14,
    color: COLORS.text,
  },
});

export default HomeScreen; 