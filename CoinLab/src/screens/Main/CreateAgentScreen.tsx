import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets/index';
import { ResponsiveScreenLayout } from '../../components/Layout';
import { useData } from '../../context/DataContext';

const CreateAgentScreen = () => {
  const navigation = useNavigation();
  const { addAgent } = useData();
  
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [investment, setInvestment] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  // Opciones para criptomonedas
  const cryptoOptions = [
    { id: 'bitcoin', name: 'Bitcoin', selected: true },
    { id: 'ethereum', name: 'Ethereum', selected: false },
    { id: 'binance', name: 'Binance', selected: false },
    { id: 'doge', name: 'Doge', selected: false },
    { id: 'solana', name: 'Solana', selected: false },
  ];
  
  const [cryptos, setCryptos] = useState(cryptoOptions);
  
  // Manejar la selección de criptomonedas
  const toggleCrypto = (id: string) => {
    setCryptos(
      cryptos.map(crypto => 
        crypto.id === id 
          ? { ...crypto, selected: !crypto.selected } 
          : crypto
      )
    );
  };
  
  // Crear un nuevo agente
  const handleCreateAgent = () => {
    // Validar campos requeridos
    if (!name.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el agente');
      return;
    }
    
    if (!investment.trim()) {
      Alert.alert('Error', 'Por favor ingresa una cantidad de inversión');
      return;
    }
    
    // Verificar que al menos una criptomoneda esté seleccionada
    const selectedCryptos = cryptos.filter(crypto => crypto.selected);
    if (selectedCryptos.length === 0) {
      Alert.alert('Error', 'Debes seleccionar al menos una criptomoneda');
      return;
    }
    
    // Formatear inversión
    const formattedInvestment = parseFloat(investment.replace(/[^0-9.]/g, '')).toFixed(2);
    
    // Crear objeto de agente
    const newAgent = {
      name,
      description: description || `Agente de trading para ${selectedCryptos.map(c => c.name).join(', ')}`,
      status: isActive ? 'active' : 'inactive' as 'active' | 'inactive',
      investment: formattedInvestment,
      profit: '+0.00',
      profitPercentage: '+0.00%'
    };
    
    // Añadir agente y navegar de vuelta
    addAgent(newAgent);
    Alert.alert('Éxito', 'Agente creado correctamente', [
      {
        text: 'OK',
        onPress: () => navigation.goBack()
      }
    ]);
  };
  
  // Manejar el regreso a la pantalla anterior
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  return (
    <ResponsiveScreenLayout
      title="Crear Agente"
      backgroundImage={IMAGES.CARD_BACKGROUND}
      profit="Nuevo Agente"
      amount="Configuración"
      showBackButton={true}
      onBackPress={handleBackPress}
      disableColorChange={true}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Sección de datos básicos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Básica</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre del Agente</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Agente Alpha"
                placeholderTextColor={COLORS.textLight}
                value={name}
                onChangeText={setName}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descripción (Opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe el propósito de este agente"
                placeholderTextColor={COLORS.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Inversión Inicial (USD)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                placeholderTextColor={COLORS.textLight}
                value={investment}
                onChangeText={setInvestment}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.switchContainer}>
              <Text style={styles.inputLabel}>Estado Inicial</Text>
              <View style={styles.statusRow}>
                <Text style={styles.statusText}>
                  {isActive ? 'Activo' : 'Inactivo'}
                </Text>
                <Switch
                  value={isActive}
                  onValueChange={setIsActive}
                  trackColor={{ false: '#767577', true: '#00ffa8' }}
                  thumbColor={isActive ? '#fff' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
            </View>
          </View>
          
          {/* Sección de criptomonedas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Criptomonedas</Text>
            <Text style={styles.sectionSubtitle}>Selecciona las criptomonedas para este agente</Text>
            
            {cryptos.map(crypto => (
              <TouchableOpacity
                key={crypto.id}
                style={styles.cryptoOption}
                onPress={() => toggleCrypto(crypto.id)}
              >
                <View style={styles.cryptoInfo}>
                  <Ionicons
                    name={
                      crypto.id === 'bitcoin' ? 'logo-bitcoin' :
                      crypto.id === 'ethereum' ? 'diamond-outline' :
                      crypto.id === 'doge' ? 'paw-outline' :
                      'logo-bitcoin'
                    }
                    size={24}
                    color={COLORS.text}
                  />
                  <Text style={styles.cryptoName}>{crypto.name}</Text>
                </View>
                <View style={[
                  styles.checkbox,
                  crypto.selected && styles.checkboxSelected
                ]}>
                  {crypto.selected && (
                    <Ionicons name="checkmark" size={16} color={COLORS.white} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Botones de acción */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleBackPress}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={handleCreateAgent}
            >
              <Text style={styles.createButtonText}>Crear Agente</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ResponsiveScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  switchContainer: {
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statusText: {
    fontSize: 16,
    color: COLORS.text,
  },
  cryptoOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cryptoName: {
    fontSize: 18,
    color: COLORS.text,
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#00ffa8',
    borderColor: '#00ffa8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  createButton: {
    backgroundColor: '#171717',
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  }
});

export default CreateAgentScreen; 