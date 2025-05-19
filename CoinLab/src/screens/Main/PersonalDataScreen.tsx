import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../theme/colors';
import { ResponsiveScreenLayout } from '../../components/Layout';
import { IMAGES } from '../../assets';
import { useData } from '../../context/DataContext';

// Interface para el componente de campo de datos
interface DataFieldProps {
  icon: string;
  label: string;
  value: string;
  editable?: boolean;
  onPress?: () => void;
}

const PersonalDataScreen = () => {
  const navigation = useNavigation();
  const { user } = useData();

  // Función para guardar los cambios (placeholder)
  const handleSaveChanges = () => {
    // Aquí iría la lógica para guardar cambios en los datos personales
    navigation.goBack();
  };

  // Componente para mostrar y editar campos de datos
  const DataField: React.FC<DataFieldProps> = ({ 
    icon, 
    label, 
    value, 
    editable = true,
    onPress
  }) => {
    return (
      <TouchableOpacity 
        style={styles.fieldContainer}
        onPress={onPress}
        activeOpacity={editable ? 0.7 : 1}
        disabled={!editable}
      >
        <View style={styles.fieldIconContainer}>
          <Ionicons name={icon} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.fieldContent}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <TextInput
            style={styles.fieldValue}
            value={value}
            editable={false}
            pointerEvents="none"
          />
        </View>
        {editable && (
          <Ionicons name="chevron-forward" size={22} color={COLORS.textLight} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ResponsiveScreenLayout
      title="Datos personales"
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
          <Text style={styles.sectionTitle}>Información básica</Text>
          
          {/* Nombre completo */}
          <DataField
            icon="person-outline"
            label="Nombre completo"
            value={user.name}
            onPress={() => {}}
          />
          
          {/* Correo electrónico */}
          <DataField
            icon="mail-outline"
            label="Correo electrónico"
            value="usuario@ejemplo.com"
            onPress={() => {}}
          />
          
          {/* Teléfono */}
          <DataField
            icon="call-outline"
            label="Teléfono"
            value="+52 (55) 1234 5678"
            onPress={() => {}}
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Dirección</Text>
          
          {/* Calle y número */}
          <DataField
            icon="home-outline"
            label="Calle y número"
            value="Av. Insurgentes Sur 1234"
            onPress={() => {}}
          />
          
          {/* Colonia */}
          <DataField
            icon="location-outline"
            label="Colonia"
            value="Del Valle"
            onPress={() => {}}
          />
          
          {/* Ciudad y estado */}
          <DataField
            icon="business-outline"
            label="Ciudad y estado"
            value="Ciudad de México, CDMX"
            onPress={() => {}}
          />
          
          {/* Código postal */}
          <DataField
            icon="map-outline"
            label="Código postal"
            value="03100"
            onPress={() => {}}
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Ajustes de cuenta</Text>
          
          {/* ID de usuario */}
          <DataField
            icon="id-card-outline"
            label="ID de usuario"
            value="2589631"
            editable={false}
          />
          
          {/* Fecha de registro */}
          <DataField
            icon="calendar-outline"
            label="Fecha de registro"
            value="15/03/2023"
            editable={false}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSaveChanges}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>Guardar cambios</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
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
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  fieldIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    marginRight: 15,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 3,
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    padding: 0,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PersonalDataScreen; 