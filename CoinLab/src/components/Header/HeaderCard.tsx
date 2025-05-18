import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Animated, Easing, Platform, PanResponder } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../theme/colors';

// Obtener las dimensiones de la pantalla y ajustar dinámicamente
const { width, height } = Dimensions.get('window');

// Definimos los colores para el gradiente
const GRADIENT_COLORS = ['#26318A', '#344190', '#3F4B9F'] as const;

// Ajustar alturas de manera responsiva basada en el tamaño de la pantalla
const COLLAPSED_HEIGHT = Math.min(height * 0.08, 70); // Reducido significativamente
const EXPANDED_HEIGHT = Math.min(height * 0.20, 160); // También reducido
const DRAG_THRESHOLD = 50; // Umbral para determinar cuando completar el arrastre

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
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const arrowRotation = useRef(new Animated.Value(0)).current;
  
  // Valor para seguir el arrastre manual
  const dragY = useRef(new Animated.Value(0)).current;
  
  // Configurar el PanResponder para manejar gestos de arrastre
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        // Cuando inicia el gesto, capturar valor actual
        dragY.setValue(0);
      },
      onPanResponderMove: Animated.event(
        [null, { dy: dragY }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        // Al soltar, determinar si expandir o colapsar
        if (!expanded && gestureState.dy < -DRAG_THRESHOLD) {
          // Arrastre hacia arriba cuando está colapsado
          toggleExpanded(true);
        } else if (expanded && gestureState.dy > DRAG_THRESHOLD) {
          // Arrastre hacia abajo cuando está expandido
          toggleExpanded(false);
        } else {
          // Volver al estado actual si no supera el umbral
          resetToCurrentState();
        }
      },
    })
  ).current;

  // Inicializar el componente
  useEffect(() => {
    heightAnim.setValue(COLLAPSED_HEIGHT);
    arrowRotation.setValue(0);
    
    // Actualizar alturas si cambian las dimensiones de la pantalla
    const handleDimensionsChange = () => {
      const { height: newHeight } = Dimensions.get('window');
      const newCollapsed = Math.min(newHeight * 0.13, 100);
      const newExpanded = Math.min(newHeight * 0.28, 220);
      
      // Actualizar con los nuevos valores
      heightAnim.setValue(expanded ? newExpanded : newCollapsed);
    };
    
    // Escuchar cambios de dimensión (como rotación de pantalla)
    Dimensions.addEventListener('change', handleDimensionsChange);
    
    return () => {
      // Remover listener al desmontar
      // Dimensions.removeEventListener('change', handleDimensionsChange);
    };
  }, []);

  const resetToCurrentState = () => {
    // Regresar a la altura actual según el estado
    Animated.spring(heightAnim, {
      toValue: expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
      friction: 6,
      useNativeDriver: false,
    }).start();
  };

  const toggleExpanded = (newExpanded = !expanded) => {
    setExpanded(newExpanded);
    
    console.log(`Toggling expanded: ${newExpanded ? 'expanding' : 'collapsing'}`);
    
    // Animar la altura con spring para efecto más natural
    Animated.spring(heightAnim, {
      toValue: newExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
      friction: 6, // Menos fricción para movimiento más suave
      tension: 40, // Menos tensión para rebote más natural
      useNativeDriver: false,
    }).start(() => {
      console.log(`Animation completed. Height: ${newExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT}`);
    });
    
    // Animar la rotación de la flecha
    Animated.timing(arrowRotation, {
      toValue: newExpanded ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

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

  // Interpolaciones para animaciones
  const arrowRotateStyle = {
    transform: [
      {
        rotate: arrowRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };
  
  // Calcular la altura dinámica basada en el arrastre
  const dynamicHeight = Animated.add(
    heightAnim,
    dragY.interpolate({
      inputRange: [-100, 0, 100],
      outputRange: [50, 0, -50],  // Limitar cuánto puede estirarse
      extrapolate: 'clamp',
    })
  );

  const renderCardContent = () => (
    <View style={styles.contentContainer} {...panResponder.panHandlers}>
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
      
      {/* Sección de botones de acción - Visible solo cuando está expandido */}
      <Animated.View style={[
        styles.bottomSection,
        { 
          opacity: heightAnim.interpolate({
            inputRange: [COLLAPSED_HEIGHT, COLLAPSED_HEIGHT + (EXPANDED_HEIGHT - COLLAPSED_HEIGHT) * 0.3, EXPANDED_HEIGHT],
            outputRange: [0, 0.5, 1],
            extrapolate: 'clamp',
          }),
          maxHeight: heightAnim.interpolate({
            inputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
            outputRange: [0, 100],
            extrapolate: 'clamp',
          }),
        }
      ]}>
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
      </Animated.View>
      
      {/* Indicador de arrastre / expandir en el centro inferior */}
      <View style={styles.expandButtonContainer}>
        <TouchableOpacity 
          style={styles.expandButton} 
          onPress={() => toggleExpanded()}
          activeOpacity={0.7}
        >
          <Animated.View style={arrowRotateStyle}>
            <Ionicons 
              name="chevron-down" 
              size={24} 
              color={COLORS.white} 
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Componentes Animados
  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

  return (
    <Animated.View style={[
      styles.container,
      { height: dynamicHeight } // Usar altura dinámica que responde al arrastre
    ]}>
      {backgroundImage ? (
        <AnimatedImageBackground
          source={backgroundImage}
          style={[
            styles.cardContainer,
            { height: dynamicHeight }
          ]}
          imageStyle={styles.backgroundImage}
          resizeMode="cover" // Asegurar que la imagen cubra todo el espacio
        >
          {renderCardContent()}
        </AnimatedImageBackground>
      ) : (
        <AnimatedLinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.cardContainer,
            { height: dynamicHeight }
          ]}
        >
          {renderCardContent()}
        </AnimatedLinearGradient>
      )}
      
      {/* Línea de indicación de arrastre */}
      <View style={styles.dragIndicator} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    zIndex: 10,
    overflow: 'visible',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  cardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 18,
    position: 'relative',
  },
  backgroundImage: {
    borderRadius: 20,
    width: '100%',
    height: '100%',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  expandButtonContainer: {
    position: 'absolute',
    bottom: -15,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  expandButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 15,
    padding: 5,
    paddingHorizontal: 15,
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
    overflow: 'hidden',
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
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  dragIndicator: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 101,
  },
});

export default HeaderCard; 