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
const COLLAPSED_HEIGHT = Math.min(height * 0.09, 75); // Ligeramente aumentado para asegurar visibilidad
const EXPANDED_HEIGHT = Math.min(height * 0.20, 160);
const DRAG_THRESHOLD = 50; // Umbral para determinar cuando completar el arrastre

interface HeaderCardProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundImage?: any; // Opcional: imagen de fondo
  onHeightChange?: (height: number) => void; // Callback para informar cambios de altura
  onExpand?: (isExpanded: boolean) => void; // Nuevo callback para informar del estado expandido
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  title = '',
  showBackButton = true,
  onBackPress,
  backgroundImage,
  onHeightChange,
  onExpand,
}) => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const arrowRotation = useRef(new Animated.Value(0)).current;
  
  // Valor para seguir el arrastre manual
  const dragY = useRef(new Animated.Value(0)).current;
  
  // Notificar altura actual al padre - función auxiliar
  const notifyHeightChange = (height: number) => {
    if (onHeightChange) {
      // Asegurarse de que el valor esté dentro de los límites
      const boundedHeight = Math.max(COLLAPSED_HEIGHT, Math.min(EXPANDED_HEIGHT, height));
      onHeightChange(boundedHeight);
    }
  };
  
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
      onPanResponderMove: (_, gestureState) => {
        // Actualizar el valor de arrastre
        dragY.setValue(gestureState.dy);
        
        // Calcular la altura actual durante el arrastre
        const baseHeight = expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
        const dragAmount = gestureState.dy;
        const newHeight = baseHeight + dragAmount;
        
        // Notificar al componente padre sobre el cambio de altura durante el arrastre
        notifyHeightChange(newHeight);
      },
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
    // Inicializar valores
    heightAnim.setValue(COLLAPSED_HEIGHT);
    arrowRotation.setValue(0);
    
    // Notificar la altura inicial
    notifyHeightChange(COLLAPSED_HEIGHT);
    
    // Actualizar alturas si cambian las dimensiones de la pantalla
    const handleDimensionsChange = () => {
      const { height: newHeight } = Dimensions.get('window');
      const newCollapsed = Math.min(newHeight * 0.08, 70);
      const newExpanded = Math.min(newHeight * 0.20, 160);
      
      // Actualizar con los nuevos valores
      heightAnim.setValue(expanded ? newExpanded : newCollapsed);
      
      // Notificar al componente padre
      notifyHeightChange(expanded ? newExpanded : newCollapsed);
    };
    
    // Escuchar cambios de dimensión (como rotación de pantalla)
    Dimensions.addEventListener('change', handleDimensionsChange);
    
    return () => {
      // Remover listener al desmontar
      // Dimensions.removeEventListener('change', handleDimensionsChange);
    };
  }, []);

  // Escuchar cambios en el estado expandido
  useEffect(() => {
    // Cuando cambia el estado expandido, actualizar altura y notificar
    if (expanded) {
      heightAnim.setValue(EXPANDED_HEIGHT);
      notifyHeightChange(EXPANDED_HEIGHT);
    } else {
      heightAnim.setValue(COLLAPSED_HEIGHT);
      notifyHeightChange(COLLAPSED_HEIGHT);
    }
    
    // Notificar al componente padre sobre el cambio de estado
    if (onExpand) {
      onExpand(expanded);
    }
  }, [expanded]);

  // Escuchar cambios en la altura animada (para gestos y animaciones en curso)
  useEffect(() => {
    const listener = heightAnim.addListener(({ value }) => {
      notifyHeightChange(value);
    });

    return () => {
      heightAnim.removeListener(listener);
    };
  }, []);

  const resetToCurrentState = () => {
    // Regresar a la altura actual según el estado
    Animated.spring(heightAnim, {
      toValue: expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
      friction: 6,
      useNativeDriver: false,
    }).start(() => {
      // Notificar la altura final después de la animación
      notifyHeightChange(expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT);
    });
  };

  const toggleExpanded = (newExpanded = !expanded) => {
    console.log("toggleExpanded called with value:", newExpanded);
    
    // Cambiar el estado
    setExpanded(newExpanded);
    
    // Cambiar la altura 
    const targetHeight = newExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
    
    // Animar con spring para efecto natural
    Animated.spring(heightAnim, {
      toValue: targetHeight,
      friction: 6,
      tension: 40,
      useNativeDriver: false
    }).start();
    
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
    <View style={styles.contentContainer}>
      <View style={styles.topSection}>
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity style={styles.iconButton} onPress={handleBackPress}>
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
          
          <View style={styles.titleContainer}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Ionicons name="person-circle-outline" size={32} color={COLORS.white} />
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
          onPress={handleToggleExpand}
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

  // Función auxiliar para expandir/contraer
  const handleToggleExpand = () => {
    console.log("Expand button pressed, toggling state");
    toggleExpanded();
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { height: dynamicHeight } // Usar altura dinámica que responde al arrastre
      ]}
      {...panResponder.panHandlers} // Mover el panResponder aquí para que funcione en toda la tarjeta
    >
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
      
      {/* Botón de expandir visible en toda la tarjeta */}
      <TouchableOpacity 
        style={styles.expandTouchArea}
        onPress={handleToggleExpand}
        activeOpacity={0.9}
      >
        <View style={styles.dragIndicator} />
      </TouchableOpacity>
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
    top: 0, // Aquí ya no necesitamos margen, lo manejaremos en cada pantalla
    left: 0,
    right: 0,
  },
  cardContainer: {
    borderRadius: 16, // Reducimos ligeramente el radio para un aspecto más limpio
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
    padding: 12,
    position: 'relative',
  },
  backgroundImage: {
    borderRadius: 16,
    width: '100%',
    height: '100%',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    minHeight: 40,
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
    marginTop: 12,
    overflow: 'hidden',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  titleContainer: {
    marginLeft: 8,
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 4,
  },
  profileButton: {
    padding: 4,
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
  expandTouchArea: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 101,
  },
});

export default HeaderCard; 