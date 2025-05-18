import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Animated, Easing, Platform, PanResponder, StatusBar } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../theme/colors';

// Obtener las dimensiones de la pantalla y ajustar dinámicamente
const { width, height } = Dimensions.get('window');

// Definimos los colores para el gradiente - Fondo negro 
const GRADIENT_COLORS = ['#171717', '#1A1A1A', '#212121'] as const;

// Manejo del espacio superior para distintas plataformas
const IS_IOS = Platform.OS === 'ios';
const NOTCH_SPACE = IS_IOS ? 44 : StatusBar.currentHeight || 0; 

// Ajustar alturas basadas en el tamaño de la pantalla
const COLLAPSED_HEIGHT = Math.min(height * 0.10, 80) + NOTCH_SPACE; // Altura reducida cuando está contraído
const EXPANDED_HEIGHT = Math.min(height * 0.35, 250) + NOTCH_SPACE; // Altura aumentada cuando está expandido
const DRAG_THRESHOLD = 25; 

// Configuración de animación para una experiencia fluida
const SPRING_CONFIG = {
  friction: 8,     
  tension: 40,     
  useNativeDriver: false
};

interface HeaderCardProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundImage?: any; 
  onHeightChange?: (height: number) => void; 
  onExpand?: (isExpanded: boolean) => void; 
  amount?: string;
  amountLabel?: string;
  profit?: string;
  profitPercentage?: string;
  currencySymbol?: string;
  hideStatusBar?: boolean;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  title = 'Historial',
  showBackButton = true,
  onBackPress,
  backgroundImage,
  onHeightChange,
  onExpand,
  amount = '25,006.89',
  amountLabel = 'USD',
  profit = 'Beneficio Total',
  profitPercentage = '',
  currencySymbol = '$',
  hideStatusBar = true, // Ocultar barra de estado por defecto
}) => {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState(false);
  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const lastNotifiedHeight = useRef(COLLAPSED_HEIGHT);
  const isAnimating = useRef(false);
  const initialRender = useRef(true);
  
  // Valor para seguir el arrastre manual
  const dragY = useRef(new Animated.Value(0)).current;
  
  // Opacidad animada para la información financiera
  const infoOpacity = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  
  // Notificar altura actual al padre - evitar notificaciones innecesarias
  const notifyHeightChange = (height: number) => {
    if (initialRender.current || 
        (onHeightChange && Math.abs(lastNotifiedHeight.current - height) > 2)) {
      lastNotifiedHeight.current = height;
      
      if (onHeightChange) {
        onHeightChange(height);
      }
      
      initialRender.current = false;
    }
  };
  
  // Configurar el PanResponder para manejar gestos de arrastre
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5; 
      },
      onPanResponderGrant: () => {
        dragY.setValue(0);
        isAnimating.current = true;
      },
      onPanResponderMove: (_, gestureState) => {
        // Limitar arrastre para evitar valores extremos
        const drag = expanded 
          ? Math.max(-20, Math.min(gestureState.dy * 0.8, 50)) 
          : Math.max(-50, Math.min(gestureState.dy * 0.8, 20)); 
        
        dragY.setValue(drag); 
      },
      onPanResponderRelease: (_, gestureState) => {
        // Resetear valor de arrastre inmediatamente
        dragY.setValue(0);
        
        const velocityThreshold = 0.3;
        const shouldExpand = !expanded && 
          (gestureState.dy < -DRAG_THRESHOLD || gestureState.vy < -velocityThreshold);
        const shouldCollapse = expanded && 
          (gestureState.dy > DRAG_THRESHOLD || gestureState.vy > velocityThreshold);
        
        // Pequeño retraso para actualización de interfaz
        requestAnimationFrame(() => {
          isAnimating.current = false;
          
          if (shouldExpand) {
            toggleExpanded(true);
          } else if (shouldCollapse) {
            toggleExpanded(false);
          } else {
            resetToCurrentState();
          }
        });
      },
    })
  ).current;

  // Inicializar el componente
  useEffect(() => {
    // Ocultar barra de estado para extenderse hasta arriba
    if (hideStatusBar) {
      StatusBar.setHidden(true);
    } else {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#171717');
        StatusBar.setTranslucent(true);
      }
    }

    // Iniciar expandido por defecto para mostrar toda la información
    setExpanded(true);
    
    heightAnim.setValue(EXPANDED_HEIGHT);
    lastNotifiedHeight.current = EXPANDED_HEIGHT;
    infoOpacity.setValue(1); // Comenzar visible
    
    // Notificar altura inicial
    notifyHeightChange(EXPANDED_HEIGHT);
    
    // Actualizar alturas si cambian las dimensiones
    const handleDimensionsChange = () => {
      const { height: newHeight } = Dimensions.get('window');
      const newCollapsed = Math.min(newHeight * 0.10, 80) + NOTCH_SPACE;
      const newExpanded = Math.min(newHeight * 0.35, 250) + NOTCH_SPACE;
      
      const targetHeight = expanded ? newExpanded : newCollapsed;
      heightAnim.setValue(targetHeight);
      
      notifyHeightChange(targetHeight);
    };
    
    Dimensions.addEventListener('change', handleDimensionsChange);
    
    return () => {
      // Restaurar barra de estado al desmontar
      if (hideStatusBar) {
        StatusBar.setHidden(false);
      }
    };
  }, [hideStatusBar]);

  // Escuchar cambios en el estado expandido
  useEffect(() => {
    if (isAnimating.current) return; 
    
    isAnimating.current = true;
    
    // Notificar cambio de estado al padre
    if (onExpand) {
      onExpand(expanded);
    }
    
    const targetHeight = expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
    notifyHeightChange(targetHeight);
    
    // Animar la altura
    Animated.spring(heightAnim, {
      toValue: targetHeight,
      ...SPRING_CONFIG
    }).start(() => {
      isAnimating.current = false;
    });
    
    // Animar la opacidad de la información
    Animated.timing(infoOpacity, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  }, [expanded]);

  const resetToCurrentState = () => {
    if (isAnimating.current) return; 
    
    isAnimating.current = true;
    
    const targetHeight = expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
    notifyHeightChange(targetHeight);
    
    Animated.spring(heightAnim, {
      toValue: targetHeight,
      ...SPRING_CONFIG
    }).start(() => {
      isAnimating.current = false;
    });
  };

  const toggleExpanded = (newExpanded = !expanded) => {
    if (newExpanded === expanded || isAnimating.current) return;
    setExpanded(newExpanded);
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleProfilePress = () => {
    console.log('Navegar al perfil');
    // navigation.navigate('Profile');
  };
  
  // Calcular altura dinámica basada en arrastre
  const dynamicHeight = Animated.add(
    heightAnim,
    dragY.interpolate({
      inputRange: [-50, 0, 50],
      outputRange: [25, 0, -25],
      extrapolate: 'clamp',
    })
  );
  
  // Animación de la sombra y border radius
  const shadowOpacity = heightAnim.interpolate({
    inputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
    outputRange: [0.3, 0],
    extrapolate: 'clamp'
  });
  
  const borderRadius = heightAnim.interpolate({
    inputRange: [COLLAPSED_HEIGHT, EXPANDED_HEIGHT],
    outputRange: [20, 30],
    extrapolate: 'clamp'
  });

  // Componentes Animados
  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

  return (
    <Animated.View 
      style={[
        styles.absoluteContainer,
        { 
          height: dynamicHeight,
          shadowOpacity: shadowOpacity,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius 
        } 
      ]}
    >
      {backgroundImage ? (
        <AnimatedImageBackground
          source={backgroundImage}
          style={[
            styles.cardContainer, 
            { 
              height: dynamicHeight,
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius
            }
          ]}
          imageStyle={[
            styles.backgroundImage,
            {
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius
            }
          ]}
          resizeMode="cover"
        >
          <View style={styles.contentWrapper}>
            <View style={styles.innerContent}>
              <View style={styles.topSection}>
                <View style={styles.leftSection}>
                  {showBackButton && (
                    <TouchableOpacity style={styles.navButton} onPress={handleBackPress}>
                      <Ionicons name="chevron-back" size={22} color={COLORS.white} />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="card-outline" size={22} color={COLORS.white} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="eye-outline" size={22} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.rightSection}>
                  <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
                    <Ionicons name="person-circle-outline" size={26} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Información financiera - se muestra solo cuando está expandido */}
              <Animated.View 
                style={[
                  styles.financialInfoContainer,
                  { 
                    opacity: infoOpacity, 
                    maxHeight: infoOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 200]
                    }) 
                  }
                ]}
              >
                <Text style={styles.titleText}>{title}</Text>
                
                <View style={styles.amountContainer}>
                  <Text style={styles.amountText}>{amount}</Text>
                  <Text style={styles.currencyText}> {amountLabel}</Text>
                </View>
                
                <Text style={styles.profitLabel}>{profit}</Text>
              </Animated.View>
            </View>
          </View>
        </AnimatedImageBackground>
      ) : (
        <AnimatedLinearGradient
          colors={GRADIENT_COLORS}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.cardContainer, 
            { 
              height: dynamicHeight,
              borderBottomLeftRadius: borderRadius,
              borderBottomRightRadius: borderRadius
            }
          ]}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.innerContent}>
              <View style={styles.topSection}>
                <View style={styles.leftSection}>
                  {showBackButton && (
                    <TouchableOpacity style={styles.navButton} onPress={handleBackPress}>
                      <Ionicons name="chevron-back" size={22} color={COLORS.white} />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="card-outline" size={22} color={COLORS.white} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="eye-outline" size={22} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.rightSection}>
                  <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
                    <Ionicons name="person-circle-outline" size={26} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Información financiera - se muestra solo cuando está expandido */}
              <Animated.View 
                style={[
                  styles.financialInfoContainer,
                  { 
                    opacity: infoOpacity, 
                    maxHeight: infoOpacity.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 200]
                    }) 
                  }
                ]}
              >
                <Text style={styles.titleText}>{title}</Text>
                
                <View style={styles.amountContainer}>
                  <Text style={styles.amountText}>{amount}</Text>
                  <Text style={styles.currencyText}> {amountLabel}</Text>
                </View>
                
                <Text style={styles.profitLabel}>{profit}</Text>
              </Animated.View>
            </View>
          </View>
        </AnimatedLinearGradient>
      )}
      
      {/* Área táctil para deslizar con barra indicadora */}
      <TouchableOpacity 
        style={styles.expandTouchArea}
        onPress={() => toggleExpanded()}
        activeOpacity={0.9}
        {...panResponder.panHandlers}
      >
        <View style={styles.dragIndicator} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    width: '100%',
    zIndex: 999, // Incrementar el z-index para estar encima de todo
    overflow: 'visible',
    position: 'absolute',
    top: -NOTCH_SPACE, // Posición negativa para cubrir el notch
    left: 0,
    right: 0,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 8,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    paddingTop: NOTCH_SPACE + 5, // Aumentar ligeramente para evitar cortes en iOS
  },
  innerContent: {
    flex: 1,
    padding: 16,
    paddingTop: IS_IOS ? 20 : 16, // Más espacio en la parte superior
  },
  cardContainer: {
    width: '100%',
    borderRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16, // Aumentar espacio
    minHeight: 40, // Aumentar altura mínima
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 15,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  navButton: {
    padding: 8, // Aumentar área táctil
  },
  profileButton: {
    padding: 8, // Aumentar área táctil
  },
  dragIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 70,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Más visible
    zIndex: 1001,
  },
  expandTouchArea: {
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  financialInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20, // Más espacio arriba
    marginBottom: 20, // Más espacio abajo
    overflow: 'visible', // Cambiar a visible para evitar recortes
  },
  titleText: {
    color: COLORS.white,
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 10, // Aumentar espacio
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10, // Aumentar espacio
  },
  amountText: {
    color: COLORS.white,
    fontSize: 42,
    fontWeight: 'bold',
    includeFontPadding: false, // Evitar recortes en el texto
  },
  currencyText: {
    color: COLORS.white,
    fontSize: 20,
    opacity: 0.9,
    alignSelf: 'flex-end',
    marginBottom: 5,
    includeFontPadding: false, // Evitar recortes en el texto
  },
  profitLabel: {
    color: COLORS.white,
    fontSize: 18,
    opacity: 0.8,
    marginTop: 10, // Aumentar espacio
    includeFontPadding: false, // Evitar recortes en el texto
  },
});

export default HeaderCard; 