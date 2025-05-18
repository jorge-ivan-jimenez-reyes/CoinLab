import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Animated, Platform, PanResponder, StatusBar, SafeAreaView, ScrollView, Easing } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../theme/colors';
import { useHeader } from '../../context/HeaderContext';

// Obtener las dimensiones de la pantalla y ajustar dinámicamente
const { width, height } = Dimensions.get('window');

// Definimos los colores para el gradiente - Fondo negro 
const GRADIENT_COLORS = ['#171717', '#171717', '#171717'] as const;
const BACKGROUND_COLOR = '#171717';

// Manejo del espacio superior para distintas plataformas
const IS_IOS = Platform.OS === 'ios';
const NOTCH_SPACE = IS_IOS ? 44 : StatusBar.currentHeight || 0; 

// Ajustar alturas basadas en el tamaño de la pantalla - Más compactas
const COLLAPSED_HEIGHT = Math.min(height * 0.08, 70) + NOTCH_SPACE; // Más pequeño cuando contraído
const EXPANDED_HEIGHT = height * 0.38 + NOTCH_SPACE; // Más responsivo al tamaño de la pantalla
const DRAG_THRESHOLD = 20; 

// Valor fijo para el border radius
const BORDER_RADIUS = 35; // Valor intermedio más equilibrado

// Configuración de animación para una experiencia fluida
const SPRING_CONFIG = {
  friction: 8,     
  tension: 40,     
  useNativeDriver: false // Desactivar native driver para todas las animaciones
};

const TIMING_CONFIG = {
  duration: 200,
  useNativeDriver: false // Desactivar native driver para todas las animaciones
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
  // Usar el contexto global en lugar del estado local
  const { isHeaderExpanded, toggleHeader } = useHeader();
  // Mantenemos una referencia al estado expandido del contexto
  const expanded = isHeaderExpanded;
  
  // Crear todas las referencias de animación con useNativeDriver: false explícitamente
  const heightAnim = useRef(new Animated.Value(expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT)).current;
  const lastNotifiedHeight = useRef(expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT);
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
        // Responder más rápido a los movimientos verticales
        return Math.abs(gestureState.dy) > 3; 
      },
      onPanResponderGrant: () => {
        // Resetear el valor de arrastre al iniciar
        dragY.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Limitar arrastre para evitar valores extremos, pero mantener sensibilidad
        const drag = expanded 
          ? Math.max(-15, Math.min(gestureState.dy, 40)) 
          : Math.max(-40, Math.min(gestureState.dy, 15)); 
        
        dragY.setValue(drag); 
      },
      onPanResponderRelease: (_, gestureState) => {
        // Resetear valor de arrastre inmediatamente
        dragY.setValue(0);
        
        // Aumentar sensibilidad a la velocidad y reducir umbral de distancia
        const velocityThreshold = 0.2;
        const distanceThreshold = 15;
        
        const shouldExpand = !expanded && 
          (gestureState.dy < -distanceThreshold || gestureState.vy < -velocityThreshold);
        const shouldCollapse = expanded && 
          (gestureState.dy > distanceThreshold || gestureState.vy > velocityThreshold);
        
        console.log(`Gesto completado: ${shouldExpand ? 'expandir' : shouldCollapse ? 'contraer' : 'mantener'}, 
          velocidad: ${gestureState.vy.toFixed(2)}, distancia: ${gestureState.dy.toFixed(2)}`);
        
        if (shouldExpand) {
          toggleHeader(true);
        } else if (shouldCollapse) {
          toggleHeader(false);
        } else {
          resetToCurrentState();
        }
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

    // Notificar altura inicial y estado expandido basado en el contexto global
    const initialHeight = expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
    notifyHeightChange(initialHeight);
    
    // Informar al componente padre sobre el estado actual
    if (onExpand) {
      onExpand(expanded);
    }
    
    // Actualizar alturas si cambian las dimensiones
    const handleDimensionsChange = () => {
      const { height: newHeight } = Dimensions.get('window');
      const newCollapsed = Math.min(newHeight * 0.08, 70) + NOTCH_SPACE;
      const newExpanded = newHeight * 0.38 + NOTCH_SPACE;
      
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
  }, [hideStatusBar, expanded]);

  // Animar directamente los cambios de altura cuando cambia el estado
  useEffect(() => {
    console.log(`Actualizando altura con estado: ${expanded ? 'expandido' : 'contraído'}`);
    const targetHeight = expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
    
    // Iniciar una nueva animación de altura con prioridad sobre cualquier otra
    isAnimating.current = true;
    
    // Usar Animated.timing para una respuesta más precisa y predecible
    Animated.timing(heightAnim, {
      toValue: targetHeight,
      duration: 250, // Duración fija para previsibilidad
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Curva de aceleración suave
      useNativeDriver: false
    }).start(() => {
      isAnimating.current = false;
      console.log(`Animación de altura completada: ${targetHeight}`);
    });
  }, [expanded]);
  
  // Notificar cambios y animar opacidad cuando cambia el estado
  useEffect(() => {
    // Animar la opacidad de la información de forma independiente - más rápida
    Animated.timing(infoOpacity, {
      toValue: expanded ? 1 : 0,
      duration: 120, // Más rápido para una respuesta inmediata
      easing: Easing.linear, // Lineal para cambio de opacidad
      useNativeDriver: false
    }).start();
  }, [expanded]);

  const resetToCurrentState = () => {
    console.log(`Manteniendo estado actual: ${expanded ? 'expandido' : 'contraído'}`);
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
  
  // Componentes Animados
  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

  // Función para cambiar el estado usando el contexto global
  const toggleExpanded = (newExpanded = !expanded) => {
    // Si ya estamos en el estado deseado, no hacemos nada
    if (newExpanded === expanded) return;
    
    // Incluso si estamos animando, permitimos cambiar el estado para mayor responsividad
    console.log(`Cambiando estado local a: ${newExpanded ? 'expandido' : 'contraído'}`);
    
    // Detener cualquier animación en curso
    heightAnim.stopAnimation();
    infoOpacity.stopAnimation();
    
    // Forzar valores inmediatos para una respuesta más rápida
    const targetHeight = newExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
    const targetOpacity = newExpanded ? 1 : 0;
    
    // Notificar inmediatamente para evitar retrasos en la interfaz
    if (onExpand) {
      onExpand(newExpanded);
    }
    notifyHeightChange(targetHeight);
    
    // Usar el toggleHeader del contexto para cambiar el estado global
    toggleHeader(newExpanded);
  };

  return (
    <Animated.View 
      style={[
        styles.absoluteContainer,
        { 
          height: dynamicHeight,
          shadowOpacity: 0,
          borderBottomLeftRadius: BORDER_RADIUS,
          borderBottomRightRadius: BORDER_RADIUS,
          borderBottomWidth: 0,
          borderWidth: 0
        } 
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        delayPressIn={0}
        style={styles.fullTouchContainer}
        {...panResponder.panHandlers}
        onPress={() => {
          console.log('Toque directo detectado');
          toggleExpanded();
        }}
      >
        {backgroundImage ? (
          <AnimatedImageBackground
            source={backgroundImage}
            style={[
              styles.cardContainer, 
              { 
                height: dynamicHeight,
                borderBottomLeftRadius: BORDER_RADIUS,
                borderBottomRightRadius: BORDER_RADIUS,
                borderBottomWidth: 0,
                borderWidth: 0
              }
            ]}
            imageStyle={[
              styles.backgroundImage,
              {
                borderBottomLeftRadius: BORDER_RADIUS,
                borderBottomRightRadius: BORDER_RADIUS,
                borderBottomWidth: 0
              }
            ]}
            resizeMode="cover"
          >
            <View style={styles.contentWrapper}>
              <View style={styles.innerContent}>
                <View style={[
                  styles.topSection,
                  expanded ? styles.expandedTopSection : styles.collapsedTopSection
                ]}>
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
                
                <Animated.View 
                  style={[
                    styles.financialInfoContainer,
                    expanded ? styles.expandedFinancialContainer : styles.collapsedFinancialContainer
                  ]}
                >
                  <Text style={styles.profitLabel}>{profit}</Text>
                  
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>{amount}</Text>
                    <Text style={styles.currencyText}> {amountLabel}</Text>
                  </View>
                  
                  <Text style={styles.titleText}>{title}</Text>
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
                borderBottomLeftRadius: BORDER_RADIUS,
                borderBottomRightRadius: BORDER_RADIUS,
                borderBottomWidth: 0,
                borderWidth: 0
              }
            ]}
          >
            <View style={styles.contentWrapper}>
              <View style={styles.innerContent}>
                <View style={[
                  styles.topSection,
                  expanded ? styles.expandedTopSection : styles.collapsedTopSection
                ]}>
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
                
                <Animated.View 
                  style={[
                    styles.financialInfoContainer,
                    expanded ? styles.expandedFinancialContainer : styles.collapsedFinancialContainer
                  ]}
                >
                  <Text style={styles.profitLabel}>{profit}</Text>
                  
                  <View style={styles.amountContainer}>
                    <Text style={styles.amountText}>{amount}</Text>
                    <Text style={styles.currencyText}> {amountLabel}</Text>
                  </View>
                  
                  <Text style={styles.titleText}>{title}</Text>
                </Animated.View>
              </View>
            </View>
          </AnimatedLinearGradient>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  absoluteContainer: {
    width: '100%',
    zIndex: 999,
    overflow: 'hidden',
    position: 'absolute',
    top: -NOTCH_SPACE,
    left: 0,
    right: 0,
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: BACKGROUND_COLOR,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    elevation: 0,
    borderBottomWidth: 0,
    borderWidth: 0,
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    paddingTop: NOTCH_SPACE + 2,
    backgroundColor: BACKGROUND_COLOR,
  },
  innerContent: {
    flex: 1,
    padding: 16,
    paddingTop: IS_IOS ? 12 : 10,
    paddingBottom: 0,
    backgroundColor: BACKGROUND_COLOR,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  expandedTopSection: {
    marginBottom: 16,
    minHeight: 40,
  },
  collapsedTopSection: {
    marginBottom: 0,
    minHeight: 32,
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
    padding: 8,
  },
  profileButton: {
    padding: 8,
  },
  fullTouchContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  dragIndicatorContainer: {
    width: 0,
    height: 0,
    position: 'absolute',
    opacity: 0,
    display: 'none'
  },
  dragIndicator: {
    width: 0,
    height: 0,
    opacity: 0,
    display: 'none'
  },
  expandTouchArea: {
    display: 'none',
  },
  financialInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BACKGROUND_COLOR,
    height: 'auto',
  },
  cardContainer: {
    width: '100%',
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
    paddingBottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    backgroundColor: BACKGROUND_COLOR,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    marginTop: 15,
  },
  amountText: {
    color: COLORS.white,
    fontSize: 42,
    fontWeight: 'bold',
    includeFontPadding: false,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  currencyText: {
    color: COLORS.white,
    fontSize: 20,
    opacity: 0.9,
    alignSelf: 'flex-end',
    marginBottom: 5,
    includeFontPadding: false,
  },
  profitLabel: {
    color: COLORS.white,
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 8,
    includeFontPadding: false,
  },
  titleText: {
    color: COLORS.white,
    fontSize: 16,
    opacity: 0.8,
    marginTop: 15,
    marginBottom: 0,
  },
  collapsedFinancialContainer: {
    opacity: 0,
    maxHeight: 0,
    overflow: 'hidden',
    marginTop: 0,
    marginBottom: 0,
    transform: [{scale: 0.95}],
  },
  expandedFinancialContainer: {
    opacity: 1,
    maxHeight: 200,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 0,
    transform: [{scale: 1}],
    paddingBottom: 0,
  },
  });
  
export default HeaderCard; 