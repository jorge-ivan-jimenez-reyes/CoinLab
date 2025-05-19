import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../theme/colors';
import { ResponsiveScreenLayout } from '../../components/Layout';
import { IMAGES } from '../../assets';
import { useData } from '../../context/DataContext';

// Interface for SwitchOptionProps
interface SwitchOptionProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SecurityCenterScreen = () => {
  const navigation = useNavigation();
  const { user } = useData();

  // Estado para los toggles
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Componente para opciones con switch
  const SwitchOption: React.FC<SwitchOptionProps> = ({ 
    title, 
    description, 
    value, 
    onValueChange 
  }) => {
    return (
      <View style={styles.optionContainer}>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>{title}</Text>
          <Text style={styles.optionDescription}>{description}</Text>
        </View>
        <Switch
          trackColor={{ false: COLORS.mediumGray, true: COLORS.primary }}
          thumbColor={COLORS.background}
          ios_backgroundColor={COLORS.mediumGray}
          onValueChange={onValueChange}
          value={value}
        />
      </View>
    );
  };

  return (
    <ResponsiveScreenLayout
      title="Centro de seguridad"
      amount=""
      amountLabel=""
      profit=""
      profitPercentage=""
      currencySymbol=""
      backgroundImage={IMAGES.CARD_BACKGROUND}
      showBackButton={true}
      onBackPress={() => navigation.goBack()}
      disableColorChange={true}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ajustes de seguridad</Text>
          
          {/* Cambiar contraseña */}
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => {}} 
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed-outline" size={26} color={COLORS.primary} />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Cambiar contraseña</Text>
                <Text style={styles.optionDescription}>Actualiza tu contraseña regularmente para mayor seguridad</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={22} color={COLORS.textLight} />
          </TouchableOpacity>
          
          {/* Autenticación biométrica */}
          <SwitchOption
            title="Autenticación biométrica"
            description="Utiliza tu huella dactilar o reconocimiento facial para acceder"
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
          />
          
          {/* Verificación en dos pasos */}
          <SwitchOption
            title="Verificación en dos pasos"
            description="Añade una capa adicional de seguridad a tu cuenta"
            value={twoFactorEnabled}
            onValueChange={setTwoFactorEnabled}
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Actividad reciente</Text>
          
          {/* Último inicio de sesión */}
          <View style={styles.activityItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="time-outline" size={26} color={COLORS.primary} />
            </View>
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityTitle}>Último inicio de sesión</Text>
              <Text style={styles.activityTime}>Hoy, 14:32</Text>
              <Text style={styles.activityDevice}>iPhone 12 • Ciudad de México</Text>
            </View>
          </View>
          
          {/* Dispositivo actual */}
          <View style={styles.activityItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="phone-portrait-outline" size={26} color={COLORS.primary} />
            </View>
            <View style={styles.activityTextContainer}>
              <Text style={styles.activityTitle}>Dispositivo actual</Text>
              <Text style={styles.activityTime}>Sesión activa</Text>
              <Text style={styles.activityDevice}>iPhone 12 • iOS 15.4</Text>
            </View>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 20,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  iconContainer: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 23,
    marginRight: 15,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  optionDescription: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 2,
  },
  activityDevice: {
    fontSize: 13,
    color: COLORS.textLight,
  },
});

export default SecurityCenterScreen; 