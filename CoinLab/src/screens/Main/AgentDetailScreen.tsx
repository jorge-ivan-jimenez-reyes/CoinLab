import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import { LineChart } from 'react-native-chart-kit';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets/index';
import { ResponsiveScreenLayout } from '../../components/Layout';
import { useData, Agent } from '../../context/DataContext';

// Get screen dimensions
const screenWidth = Dimensions.get('window').width;

// Define route param list type
type AgentDetailRouteProp = RouteProp<{
  AgentDetail: {
    agentId: string;
  };
}, 'AgentDetail'>;

const AgentDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AgentDetailRouteProp>();
  const { agentId } = route.params;
  const { agents } = useData();
  
  // State for chart data
  const [chartData, setChartData] = useState({
    labels: ["", "", "", "", "", ""],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0]
      }
    ]
  });
  
  // State for price display
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [previousPrice, setPreviousPrice] = useState<number>(0);
  const [priceChange, setPriceChange] = useState<string>('+0.00%');
  const [isIncreasing, setIsIncreasing] = useState<boolean>(true);
  
  // State for chart period
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  
  // Refs for animation
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const dataPointsRef = useRef<number[]>([]);
  const labelsRef = useRef<string[]>([]);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Generate initial chart data based on agent ID and selected period
  useEffect(() => {
    // Clear previous interval if it exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const seed = parseInt(agentId, 10) || 1;
    const basePrice = 5000 + (seed * 100);
    setCurrentPrice(basePrice);
    setPreviousPrice(basePrice);
    
    // Initialize data points based on the selected period
    const initializeChartData = () => {
      let dataPoints: number[] = [];
      let labels: string[] = [];
      
      // Generate different data points based on the selected period
      switch(selectedPeriod) {
        case '1D':
          labels = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];
          dataPoints = Array(9).fill(0).map((_, i) => {
            return basePrice + Math.sin(i/4) * 200 + (Math.random() * 100 - 50);
          });
          break;
        case '7D':
          labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          dataPoints = Array(7).fill(0).map((_, i) => {
            return basePrice + Math.sin(i/3) * 300 + (Math.random() * 150 - 75);
          });
          break;
        case '1M':
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
          dataPoints = Array(4).fill(0).map((_, i) => {
            return basePrice + Math.sin(i/2) * 400 + (Math.random() * 200 - 100);
          });
          break;
        case '3M':
          labels = ["Jan", "Feb", "Mar"];
          dataPoints = Array(3).fill(0).map((_, i) => {
            return basePrice + Math.sin(i/1.5) * 500 + (Math.random() * 250 - 125);
          });
          break;
        case '6M':
          labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
          dataPoints = Array(6).fill(0).map((_, i) => {
            return basePrice + Math.sin(i/3) * 600 + (Math.random() * 300 - 150);
          });
          break;
        case '1Y':
          labels = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
          dataPoints = Array(6).fill(0).map((_, i) => {
            return basePrice + Math.sin(i/4) * 800 + (Math.random() * 400 - 200);
          });
          break;
        default:
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
          dataPoints = Array(4).fill(0).map((_, i) => {
            return basePrice + Math.sin(i/2) * 400 + (Math.random() * 200 - 100);
          });
      }
      
      // Store the data in refs
      dataPointsRef.current = dataPoints;
      labelsRef.current = labels;
      
      // Set initial chart data
      setChartData({
        labels,
        datasets: [{ data: dataPoints }]
      });
      
      // Set current price to the last data point
      const lastPrice = dataPoints[dataPoints.length - 1];
      setCurrentPrice(lastPrice);
      setPreviousPrice(basePrice);
      
      // Calculate price change percentage
      const changePercent = ((lastPrice - basePrice) / basePrice) * 100;
      setPriceChange((changePercent >= 0 ? '+' : '') + changePercent.toFixed(2) + '%');
      setIsIncreasing(changePercent >= 0);
      
      // Start the live update simulation
      startLiveUpdates(dataPoints, labels);
    };
    
    initializeChartData();
  }, [agentId, selectedPeriod]);
  
  // Function to simulate live updates
  const startLiveUpdates = (initialData: number[], labels: string[]) => {
    // Create a copy of the initial data
    const dataPoints = [...initialData];
    const lastPrice = dataPoints[dataPoints.length - 1];
    
    // Start the interval to update the chart
    timerRef.current = setInterval(() => {
      // Generate a new data point with a slight random change
      const lastDataPoint = dataPoints[dataPoints.length - 1];
      const volatility = lastDataPoint * 0.005; // 0.5% volatility
      const change = (Math.random() - 0.5) * volatility * 2;
      let newPrice = lastDataPoint + change;
      
      // Ensure price doesn't go too low
      newPrice = Math.max(newPrice, lastDataPoint * 0.95);
      
      // Update the data array
      dataPoints.push(newPrice);
      if (dataPoints.length > 30) {
        dataPoints.shift();
      }
      
      // Update labels by shifting them if we have more than the initial set
      const newLabels = [...labels];
      if (dataPoints.length > labels.length) {
        // For live data, we can use timestamps as labels
        const now = new Date();
        newLabels.push(`${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
        if (newLabels.length > 30) {
          newLabels.shift();
        }
      }
      
      // Update chart data
      setChartData({
        labels: newLabels.slice(-dataPoints.length),
        datasets: [{ data: dataPoints }]
      });
      
      // Update price displays
      setPreviousPrice(currentPrice);
      setCurrentPrice(newPrice);
      
      // Calculate price change percentage
      const basePrice = initialData[0];
      const changePercent = ((newPrice - basePrice) / basePrice) * 100;
      setPriceChange((changePercent >= 0 ? '+' : '') + changePercent.toFixed(2) + '%');
      setIsIncreasing(newPrice >= currentPrice);
      
    }, 2000); // Update every 2 seconds
  };
  
  // Find the agent with the matching ID
  const agent = agents.find(a => a.id === agentId);
  
  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  // Change chart period
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };
  
  // If agent not found, display error message
  if (!agent) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Agente no encontrado</Text>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>Regresar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Determine cryptocurrencies based on agent ID
  const getCryptocurrencies = (id: string) => {
    switch(id) {
      case '1': return ['Bitcoin', 'Ethereum', 'XRP'];
      case '2': return ['Binance', 'Cardano'];
      case '3': return ['Bitcoin', 'Ethereum'];
      case '4': return ['Doge', 'Solana', 'Polygon'];
      case '5': return ['Binance', 'Cardano', 'Ethereum'];
      default: return ['Bitcoin'];
    }
  };
  
  const cryptos = getCryptocurrencies(agent.id);
  
  // Generate mock chart data for display purposes
  const mockChartData = {
    intensity: 'Media',
    timeElapsed: '2 días, 16:52',
  };
  
  // Format price as currency
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };
  
  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: '#1E2129',
    backgroundGradientTo: '#1E2129',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(49, 208, 170, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '3',
      strokeWidth: '1',
      stroke: '#31D0AA',
    },
    propsForBackgroundLines: {
      stroke: 'rgba(255, 255, 255, 0.1)',
    },
  };
  
  return (
    <ResponsiveScreenLayout
      title={agent.name}
      backgroundImage={IMAGES.CARD_BACKGROUND}
      profit="Dinero Disponible"
      amount={agent.investment}
      amountLabel="USD"
      profitPercentage={agent.profit + ' (' + agent.profitPercentage + ')'}
      showBackButton={true}
      onBackPress={handleBackPress}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Live Price Display */}
          <View style={styles.livePriceContainer}>
            <Text style={styles.livePriceLabel}>Precio Actual</Text>
            <Text style={styles.livePrice}>{formatCurrency(currentPrice)}</Text>
            <Text style={[
              styles.priceChange,
              isIncreasing ? styles.priceUp : styles.priceDown
            ]}>
              {priceChange} {isIncreasing ? '↑' : '↓'}
            </Text>
          </View>
          
          {/* Chart component */}
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              withShadow={false}
              yAxisSuffix=""
              style={styles.chart}
            />
            
            {/* Time period selector */}
            <View style={styles.periodSelector}>
              {['1D', '7D', '1M', '3M', '6M', '1Y'].map(period => (
                <TouchableOpacity 
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.activePeriodButton
                  ]}
                  onPress={() => handlePeriodChange(period)}
                >
                  <Text 
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period && styles.activePeriodButtonText
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Trading metrics */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Intensidad</Text>
              <Text style={styles.metricValue}>{mockChartData.intensity}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Tiempo Transcurrido</Text>
              <Text style={styles.metricValue}>{mockChartData.timeElapsed}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Monedas</Text>
              <View style={styles.cryptoIconsContainer}>
                {cryptos.map((crypto, index) => (
                  <View key={index} style={styles.cryptoIcon}>
                    <Ionicons
                      name={
                        crypto === 'Bitcoin' ? 'logo-bitcoin' :
                        crypto === 'Ethereum' ? 'diamond-outline' :
                        crypto === 'Doge' ? 'paw-outline' :
                        'logo-bitcoin'
                      }
                      size={20}
                      color="#000"
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
          
          {/* Agent description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Descripción</Text>
            <Text style={styles.descriptionText}>{agent.description}</Text>
          </View>
          
          {/* Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status</Text>
            <View style={[
              styles.statusBadge,
              agent.status === 'active' ? styles.activeStatus :
              agent.status === 'paused' ? styles.pausedStatus :
              styles.inactiveStatus
            ]}>
              <Text style={styles.statusText}>
                {agent.status === 'active' ? 'Activo' :
                 agent.status === 'paused' ? 'Pausado' :
                 'Inactivo'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ResponsiveScreenLayout>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  container: {
    paddingHorizontal: 15,
    width: '100%',
  },
  livePriceContainer: {
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  livePriceLabel: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
    marginBottom: 5,
  },
  livePrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  priceChange: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceUp: {
    color: '#4CAF50',
  },
  priceDown: {
    color: '#F44336',
  },
  chartContainer: {
    width: '100%',
    backgroundColor: '#1E2129',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  chart: {
    marginHorizontal: -10,
    borderRadius: 10,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  periodButton: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  activePeriodButton: {
    backgroundColor: 'rgba(49, 208, 170, 0.2)',
  },
  periodButtonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activePeriodButtonText: {
    color: '#31D0AA',
  },
  metricsContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  metricLabel: {
    fontSize: 18,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  metricValue: {
    fontSize: 18,
    color: COLORS.text,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  cryptoIconsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  cryptoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cryptoIconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  descriptionContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  statusContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeStatus: {
    backgroundColor: '#E6F7ED',
  },
  pausedStatus: {
    backgroundColor: '#FFF8E6',
  },
  inactiveStatus: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AgentDetailScreen; 