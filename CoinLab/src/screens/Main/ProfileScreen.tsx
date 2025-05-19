import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../theme/colors';
import { ResponsiveScreenLayout } from '../../components/Layout';
import { IMAGES } from '../../assets';
import { useData } from '../../context/DataContext';

// Interface for MenuItemProps
interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useData();

  // Function to handle logout
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: () => {
            // This would use Auth Context in a real implementation
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' as never }],
            });
          } 
        }
      ]
    );
  };

  const MenuItem: React.FC<MenuItemProps> = ({ icon, title, subtitle, onPress }) => {
    return (
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={COLORS.textLight} />
      </TouchableOpacity>
    );
  };

  return (
    <ResponsiveScreenLayout
      title="Tu Perfil"
      amount={user.name}
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
        <View style={styles.menuContainer}>
          <MenuItem
            icon={<Ionicons name="shield-outline" size={30} color={COLORS.text} />}
            title="Centro de seguridad"
            subtitle="Cambia y/o actualiza tu contraseña y usuario"
            onPress={() => navigation.navigate('SecurityCenter' as never)}
          />
          
          <MenuItem
            icon={<Ionicons name="person-outline" size={30} color={COLORS.text} />}
            title="Datos personales"
            subtitle="Cambia y/o actualiza tu contraseña y usuario"
            onPress={() => navigation.navigate('PersonalData' as never)}
          />
          
          <MenuItem
            icon={<Ionicons name="lock-closed-outline" size={30} color={COLORS.text} />}
            title="Cerrar sesión"
            subtitle=""
            onPress={handleLogout}
          />

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={24} color={COLORS.text} />
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
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
  menuContainer: {
    borderRadius: 10,
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 10,
  }
});

export default ProfileScreen; 