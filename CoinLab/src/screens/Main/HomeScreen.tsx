import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets/index';
import { ResponsiveScreenLayout } from '../../components/Layout';
import { Ionicons } from 'react-native-vector-icons';
import { useData, Movement, Agent } from '../../context/DataContext';

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

const CryptoCard: React.FC<{ crypto: Cryptocurrency }> = ({ crypto }) => {
  return (
    <View style={styles.cryptoCard}>
      <View style={styles.cryptoLeft}>
        <Image source={crypto.icon} style={styles.cryptoIcon} />
        <View style={styles.cryptoInfo}>
          <Text style={styles.cryptoName}>{crypto.name}</Text>
          <View style={styles.cryptoDetailsContainer}>
            <Text style={styles.cryptoDetails}>
              {crypto.agresividad ? `Agresividad: ${crypto.agresividad}` : `Intensidad: ${crypto.intensidad}`}
            </Text>
            <Text style={styles.cryptoDetails}>Tiempo: {crypto.tiempo}</Text>
          </View>
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
          <Text style={[styles.percentage, crypto.priceUp ? styles.priceUp : styles.priceDown]}>
            {crypto.percentage}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Component to display agent as a movement
const AgentMovementCard: React.FC<{ agent: Agent, index: number }> = ({ agent, index }) => {
  // Determine cryptocurrency and action based on agent name
  const getCryptoCurrency = (agentName: string) => {
    if (agentName.includes('Alpha')) return 'Bitcoin';
    if (agentName.includes('Beta')) return 'Ethereum';
    if (agentName.includes('Delta')) return 'Bitcoin';
    if (agentName.includes('Gamma')) return 'Doge';
    if (agentName.includes('Omega')) return 'Binance';
    return 'Bitcoin';
  };
  
  const getAction = (agentName: string, index: number) => {
    // Specific actions based on agent names
    if (agentName.includes('Alpha')) return 'Compra';
    if (agentName.includes('Beta')) return 'Inversión';
    if (agentName.includes('Delta')) return 'Venta';
    
    const actions = ['Compra', 'Venta', 'Inversión'];
    return actions[index % actions.length];
  };
  
  const getMovementType = (status: string) => {
    // Movement type based on agent status
    switch(status) {
      case 'active': return 'Trading';
      case 'paused': return 'Largo Plazo';
      case 'inactive': return 'Alta Frecuencia';
      default: return 'Trading';
    }
  };

  const currency = getCryptoCurrency(agent.name);
  const action = getAction(agent.name, index);
  const movementType = getMovementType(agent.status);
  
  // Use actual profit data from agent for price direction
  const priceUp = agent.profit.startsWith('+');
  const amount = priceUp ? `+$${agent.investment}` : `-$${agent.investment}`;
  
  return (
    <View style={styles.movementCard}>
      <View style={styles.movementLeft}>
        <Image source={IMAGES.USER_ICON} style={styles.userIcon} />
        <View style={styles.movementInfo}>
          <Text style={styles.movementType}>{agent.name}</Text>
          <Text style={styles.movementAction}>{action}</Text>
        </View>
      </View>
      <View style={styles.movementRight}>
        <Text style={[styles.movementAmount, priceUp ? styles.priceUp : styles.priceDown]}>
          {amount}
        </Text>
        <Text style={styles.movementCurrency}>{currency}</Text>
      </View>
    </View>
  );
};

const HomeScreen = () => {
  const { user, agents } = useData();
  
  // Get the last 3 agents to display as movements
  const lastThreeAgents = agents.slice(0, 3);

  return (
    <ResponsiveScreenLayout
      title="Welcome Back"
      amount={user.name}
      amountLabel=""
      profit="Cantidad disponible"
      profitPercentage={user.availableBalance}
      currencySymbol="USD"
      backgroundImage={IMAGES.CARD_BACKGROUND}
      showBackButton={false}
      disableColorChange={true}
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
          
          {/* Separator line */}
          <View style={styles.separator} />
          
          {/* Últimos Movimientos Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
            
            {lastThreeAgents.map((agent, index) => (
              <AgentMovementCard key={agent.id} agent={agent} index={index} />
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
  separator: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    width: '100%',
    marginVertical: 10,
  },
  // Crypto card styles
  cryptoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
  },
  cryptoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 25,
    resizeMode: 'contain',
  },
  cryptoInfo: {
    justifyContent: 'center',
  },
  cryptoName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  cryptoDetailsContainer: {
    marginTop: 4,
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
    fontSize: 24,
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
  },
  priceUp: {
    color: '#4CAF50',
  },
  priceDown: {
    color: COLORS.error,
  },
  // Movement card styles
  movementCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
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
    fontSize: 16,
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
    fontSize: 16,
    color: COLORS.text,
  },
});

export default HomeScreen; 