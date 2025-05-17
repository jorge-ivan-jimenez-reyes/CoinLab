import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../theme/colors';

// Obtener las dimensiones de la pantalla
const { width, height } = Dimensions.get('window');

// Definimos los colores para el gradiente
const GRADIENT_COLORS = ['#26318A', '#344190', '#3F4B9F'] as const;

interface HeaderCardProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundImage?: any; // Opcional: imagen de fondo
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  title = '',
  showBackButton = true,
  onBackPress,
  backgroundImage,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleProfilePress = () => {
    // Navegar al perfil - implementar según la navegación
    console.log('Navegar al perfil');
    // navigation.navigate('Profile');
  };

  const renderCardContent = () => (
    <View style={styles.contentContainer}>
      <View style={styles.topSection}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={styles.iconButton} onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={28} color={COLORS.white} />
            </TouchableOpacity>
          )}
          
          <View style={styles.titleContainer}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Ionicons name="person-circle-outline" size={36} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="card-outline" size={28} color={COLORS.white} />
          <Text style={styles.actionText}>Tarjetas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="eye-outline" size={28} color={COLORS.white} />
          <Text style={styles.actionText}>Ver</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="analytics-outline" size={28} color={COLORS.white} />
          <Text style={styles.actionText}>Análisis</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          style={styles.cardContainer}
          imageStyle={styles.backgroundImage}
        >
          {renderCardContent()}
        </ImageBackground>
      ) : (
        <LinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardContainer}
        >
          {renderCardContent()}
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  cardContainer: {
    borderRadius: 20,
    height: height * 0.22, // 22% de la altura de la pantalla
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  contentContainer: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  backgroundImage: {
    borderRadius: 20,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  titleContainer: {
    marginLeft: 10,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 5,
  },
  profileButton: {
    padding: 5,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  actionText: {
    color: COLORS.white,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default HeaderCard; 