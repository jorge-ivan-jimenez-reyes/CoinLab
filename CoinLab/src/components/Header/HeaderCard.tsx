import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../theme/colors';
import { GRADIENTS } from '../../assets';

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
    <>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity style={styles.iconButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="card-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="eye-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>
      
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
          <Ionicons name="person-circle-outline" size={32} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </>
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
          colors={['#26318A', '#344190', '#3F4B9F']}
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
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  cardContainer: {
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  backgroundImage: {
    borderRadius: 15,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  iconButton: {
    marginRight: 15,
    padding: 5,
  },
  profileButton: {
    padding: 5,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default HeaderCard; 