import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, Animated, Platform, PanResponder, StatusBar, SafeAreaView, ScrollView, Easing, Image, InteractionManager } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '../../theme/colors';
import { useHeader } from '../../context/HeaderContext';
import { useAuth } from '../../context/AuthContext';

// Obtener las dimensiones de la pantalla y ajustar dinámicamente
const { width, height } = Dimensions.get('window');

// Definimos los colores para el gradiente - Fondo oscuro para coincidir con el diseño
const GRADIENT_COLORS = ['rgba(30, 30, 36, 0.9)', 'rgba(30, 30, 36, 0.95)', 'rgba(30, 30, 36, 1)'] as const;
const BACKGROUND_COLOR = '#1E1E24';

// Manejo del espacio superior para distintas plataformas
const IS_IOS = Platform.OS === 'ios';
const NOTCH_SPACE = IS_IOS ? 50 : StatusBar.currentHeight || 0; // Aumentar más el espacio para el notch

// Ajustar alturas basadas en el tamaño de la pantalla - Más espacio vertical
const COLLAPSED_HEIGHT = Math.min(height * 0.12, 110) + NOTCH_SPACE; // Aumentar altura cuando está contraído
const EXPANDED_HEIGHT = height * 0.39 + NOTCH_SPACE; // Mantener para modo expandido
const DRAG_THRESHOLD = 20;

// Valor fijo para el border radius
const BORDER_RADIUS = 35; // Valor intermedio más equilibrado

// Configuración de animación para una experiencia fluida
const SPRING_CONFIG = {
  friction: 8,     
  tension: 40,     
  useNativeDriver: false // Height animations require useNativeDriver: false
};

const TIMING_CONFIG = {
  duration: 300,
  useNativeDriver: false // Height animations require useNativeDriver: false
};

// Importar la imagen de fondo por defecto y la imagen de puntos
const DEFAULT_BACKGROUND_IMAGE = require('../../assets/card.png');
const DOTS_IMAGE = require('../../assets/componente.png');

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
  backgroundImage = DEFAULT_BACKGROUND_IMAGE,
  onHeightChange,
  onExpand,
  amount = '25,006.89',
  amountLabel = 'USD',
  profit = 'Beneficio Total',
  profitPercentage = '',
  currencySymbol = '$',
  hideStatusBar = true, // Ocultar barra de estado por defecto
}) => {
  const navigation = useNavigation<any>();
  // Usar el contexto global en lugar del estado local
  const { isHeaderExpanded, toggleHeader, isTransitioning } = useHeader();
  const { isAuthenticated } = useAuth();
  // Mantenemos una referencia al estado expandido del contexto
  const expanded = isHeaderExpanded;
  
  // Crear todas las referencias de animación con useNativeDriver: false para animar altura
  const heightAnim = useRef(new Animated.Value(expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT)).current;
  const lastNotifiedHeight = useRef(expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT);
  const isAnimating = useRef(false);
  const initialRender = useRef(true);
  
  // Valor para seguir el arrastre manual
  const dragY = useRef(new Animated.Value(0)).current;
  
  // Opacidad animada para la información financiera
  const infoOpacity = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  
  // Memoizar la altura para minimizar recálculos
  const targetHeight = useMemo(() => 
    expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
  [expanded]);

  // Calcular valores animados para mejorar el efecto visual
  const scaleAnim = useRef(new Animated.Value(expanded ? 1 : 0.98)).current;
  const borderRadiusAnim = useRef(new Animated.Value(BORDER_RADIUS)).current;
  
  // Notificar altura actual al padre - evitar notificaciones innecesarias
  const notifyHeightChange = useCallback((height: number) => {
    if (initialRender.current || 
        (onHeightChange && Math.abs(lastNotifiedHeight.current - height) > 2)) {
      lastNotifiedHeight.current = height;
      
      if (onHeightChange) {
        requestAnimationFrame(() => {
          onHeightChange(height);
        });
      }
      
      initialRender.current = false;
    }
  }, [onHeightChange]);
  
  // Configurar el PanResponder para manejar gestos de arrastre - deshabilitar durante transiciones
  const panResponder = useMemo(() => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isTransitioning,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // No responder a gestos durante la transición
        if (isTransitioning) return false;
        
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
        // No procesar el gesto si estamos en transición
        if (isTransitioning) return;
        
        // Resetear valor de arrastre inmediatamente
        dragY.setValue(0);
        
        // Aumentar sensibilidad a la velocidad y reducir umbral de distancia
        const velocityThreshold = 0.2;
        const distanceThreshold = 15;
        
        const shouldExpand = !expanded && 
          (gestureState.dy < -distanceThreshold || gestureState.vy < -velocityThreshold);
        const shouldCollapse = expanded && 
          (gestureState.dy > distanceThreshold || gestureState.vy > velocityThreshold);
        
        if (shouldExpand) {
          toggleHeader(true);
        } else if (shouldCollapse) {
          toggleHeader(false);
        } else {
          resetToCurrentState();
        }
      },
    }),
  [expanded, toggleHeader, isTransitioning]);

  // Inicializar el componente
  useEffect(() => {
    // Ocultar barra de estado para extenderse hasta arriba
    if (hideStatusBar) {
      StatusBar.setHidden(true, 'fade');
    } else {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#171717');
        StatusBar.setTranslucent(true);
      }
    }

    // Pre-cargar la altura para evitar el destello negro
    heightAnim.setValue(expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT);

    // Notificar altura inicial y estado expandido basado en el contexto global
    notifyHeightChange(targetHeight);
    
    // Informar al componente padre sobre el estado actual
    if (onExpand) {
      onExpand(expanded);
    }
    
    // Actualizar alturas si cambian las dimensiones
    const handleDimensionsChange = () => {
      const { height: newHeight } = Dimensions.get('window');
      const newCollapsed = Math.min(newHeight * 0.08, 70) + NOTCH_SPACE;
      const newExpanded = newHeight * 0.38 + NOTCH_SPACE;
      
      const newTargetHeight = expanded ? newExpanded : newCollapsed;
      
      // Use LayoutAnimation for smoother transitions when dimensions change
      Animated.timing(heightAnim, {
        toValue: newTargetHeight,
        duration: 0, // Instant update for dimension changes
        useNativeDriver: false // Height animations require useNativeDriver: false
      }).start();
      
      notifyHeightChange(newTargetHeight);
    };
    
    const dimensionListener = Dimensions.addEventListener('change', handleDimensionsChange);
    
    return () => {
      // Remove listener properly
      dimensionListener.remove();
      
      // No restauramos la barra de estado al desmontar para evitar parpadeos
    };
  }, [hideStatusBar, expanded, notifyHeightChange, targetHeight, onExpand]);

  // Asegurar que la barra de estado permanezca oculta durante las transiciones
  useEffect(() => {
    // En iOS, asegurarnos de que la barra sigue oculta durante transiciones
    StatusBar.setHidden(true, 'fade');
  }, [isTransitioning]);

  // Animar directamente los cambios de altura cuando cambia el estado
  useEffect(() => {
    const newTargetHeight = targetHeight;
    
    // No iniciar una nueva animación si ya está en transición
    if (isAnimating.current) return;
    
    isAnimating.current = true;

    // Configurar animación con reatardo cero para evitar parpadeos
    const config = {
      toValue: newTargetHeight,
      duration: 300, // Reducir la duración para una animación más rápida 
      useNativeDriver: false, // Height animations require useNativeDriver: false
      delay: 0,
      isInteraction: true,
    };

    // Usar InteractionManager para evitar problemas de renderizado
    InteractionManager.runAfterInteractions(() => {
      // Usar Animated.timing para una respuesta más precisa y predecible
      const heightAnimation = Animated.timing(heightAnim, config);
    
      // Animar la opacidad de la información
      const opacityAnimation = Animated.timing(infoOpacity, {
        toValue: expanded ? 1 : 0,
        duration: 250, // Hacer más rápida la transición de opacidad
        useNativeDriver: false, // Set to false for consistency
        delay: 0
      });

      // Animar la escala para el efecto visual
      const scaleAnimation = Animated.timing(scaleAnim, {
        toValue: expanded ? 1 : 0.98,
        duration: 300,
        useNativeDriver: false, // Set to false for consistency
      });
    
      // Ejecutar animaciones en paralelo para mejor efecto visual
      Animated.parallel([
        heightAnimation,
        opacityAnimation,
        scaleAnimation
      ]).start(() => {
        isAnimating.current = false;
        notifyHeightChange(newTargetHeight);
      });
    });
    
  }, [expanded, targetHeight, notifyHeightChange, scaleAnim]);

  const resetToCurrentState = useCallback(() => {
    // Stay at current state, no change needed
  }, []);

  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation, onBackPress]);

  const handleProfilePress = useCallback(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } else {
      // Aquí puedes agregar navegación al perfil cuando se implemente
      // navigation.navigate('Profile');
    }
  }, [navigation, isAuthenticated]);
  
  // Calcular altura dinámica basada en arrastre - desactivar durante transiciones
  const dynamicHeight = useMemo(() => {
    if (isTransitioning) {
      return heightAnim; // Durante la transición, usar solo la altura animada, sin drag
    }
    
    // Use layout-only animation for height
    return Animated.add(
      heightAnim,
      dragY.interpolate({
        inputRange: [-50, 0, 50],
        outputRange: [25, 0, -25],
        extrapolate: 'clamp',
      })
    );
  }, [heightAnim, dragY, isTransitioning]);
  
  // Componentes Animados
  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
  const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

  // Función para cambiar el estado usando el contexto global
  const toggleExpanded = useCallback((newExpanded = !expanded) => {
    // Si ya estamos en el estado deseado o en transición, no hacemos nada
    if (newExpanded === expanded || isTransitioning) return;
    
    // Usar el toggleHeader del contexto para cambiar el estado global
    toggleHeader(newExpanded);
  }, [expanded, toggleHeader, isTransitioning]);

  // Memoizar el estilo de contenedor para evitar recálculos frecuentes
  const containerStyle = useMemo(() => [
    styles.absoluteContainer,
    { 
      height: dynamicHeight, // Height animation requires useNativeDriver: false
      shadowOpacity: 0,
      borderBottomLeftRadius: BORDER_RADIUS, // Mantener bordes redondeados siempre
      borderBottomRightRadius: BORDER_RADIUS, // Mantener bordes redondeados siempre
      borderBottomWidth: 0,
      borderWidth: 0,
      backgroundColor: BACKGROUND_COLOR, // Añadir color de fondo aquí también
      overflow: 'hidden' as const, // Asegurar que no se desborde el contenido
    } 
  ], [dynamicHeight]);

  // Memoizar el estilo del contenedor de la tarjeta
  const animatedCardStyle = useMemo(() => [
    styles.cardContainer, 
    { 
      height: dynamicHeight, // Height animation requires useNativeDriver: false
      backgroundColor: BACKGROUND_COLOR,
      borderBottomLeftRadius: BORDER_RADIUS, // Mantener bordes redondeados siempre
      borderBottomRightRadius: BORDER_RADIUS, // Mantener bordes redondeados siempre
      transform: [
        { scale: scaleAnim }
      ],
      opacity: 1, // Asegurar que sea visible siempre
    }
  ], [dynamicHeight, scaleAnim]);

  // Memoizar el estilo de la sección superior
  const topSectionStyle = useMemo(() => [
    styles.topSection,
    expanded ? styles.expandedTopSection : styles.collapsedTopSection
  ], [expanded]);

  // Memoizar el estilo del contenedor financiero
  const financialContainerStyle = useMemo(() => [
    styles.financialInfoContainer,
    expanded ? styles.expandedFinancialContainer : styles.collapsedFinancialContainer,
    { opacity: infoOpacity }
  ], [expanded, infoOpacity]);

  // Memoizar la posición de los puntos basada en el estado expandido
  const dotsStyle = useMemo(() => [
    styles.dotsImage,
    expanded ? styles.dotsExpandedPosition : styles.dotsCollapsedPosition
  ], [expanded]);

  // Memoizar el estilo del gradiente
  const gradientStyle = useMemo(() => [
    styles.gradientOverlay,
    {
      borderBottomLeftRadius: BORDER_RADIUS,
      borderBottomRightRadius: BORDER_RADIUS
    }
  ], []);

  return (
    <Animated.View style={containerStyle}>
      <TouchableOpacity
        activeOpacity={0.9}
        delayPressIn={0}
        style={[styles.fullTouchContainer, { backgroundColor: BACKGROUND_COLOR }]}
        {...panResponder.panHandlers}
        onPress={() => !isTransitioning && toggleExpanded()}
        disabled={isTransitioning}
      >
        <Animated.View style={animatedCardStyle}>
          {/* Garantizar que el fondo sea consistente */}
          <View style={[styles.solidBackground, { backgroundColor: BACKGROUND_COLOR }]} />
          
          {/* Imagen de puntos */}
          <Image 
            source={DOTS_IMAGE} 
            style={dotsStyle} 
            resizeMode="contain"
          />
          
          {/* Gradiente para mejorar la visualización */}
          <LinearGradient
            colors={GRADIENT_COLORS}
            style={gradientStyle}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          
          <View style={styles.contentWrapper}>
            <View style={styles.innerContent}>
              <View style={topSectionStyle}>
                <View style={styles.leftSection}>
                  {showBackButton && (
                    <TouchableOpacity 
                      style={styles.navButton} 
                      onPress={handleBackPress}
                      disabled={isTransitioning}
                    >
                      <Ionicons name="chevron-back" size={expanded ? 26 : 24} color={COLORS.white} />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.navButton}
                    disabled={isTransitioning}
                  >
                    <Ionicons name="card-outline" size={expanded ? 26 : 24} color={COLORS.white} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.navButton}
                    disabled={isTransitioning}
                  >
                    <Ionicons name="eye-outline" size={expanded ? 26 : 24} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.rightSection}>
                  <TouchableOpacity 
                    style={styles.profileButton} 
                    onPress={handleProfilePress}
                    disabled={isTransitioning}
                  >
                    <Ionicons name="person-circle-outline" size={expanded ? 30 : 27} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Animated.View style={financialContainerStyle}>
                {title ? (
                  <Text style={styles.titleText}>{title}</Text>
                ) : null}
                
                <View style={styles.amountContainer}>
                  <Text style={styles.amountText}>{amount}</Text>
                  <Text style={styles.currencyText}> {amountLabel}</Text>
                </View>
                
                {profit ? (
                  <Text style={styles.profitLabel}>{profit}</Text>
                ) : null}
                
                {profitPercentage ? (
                  <View style={styles.profitPercentageContainer}>
                    <Text style={styles.profitPercentage}>{profitPercentage}</Text>
                    {currencySymbol ? (
                      <Text style={styles.profitCurrency}>{currencySymbol}</Text>
                    ) : null}
                  </View>
                ) : null}
              </Animated.View>
            </View>
          </View>

          {/* Indicador de expansión */}
          {!expanded && (
            <View style={styles.expansionIndicatorContainer}>
              <View style={styles.expansionIndicator} />
            </View>
          )}
        </Animated.View>
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
    paddingTop: IS_IOS ? NOTCH_SPACE + 5 : NOTCH_SPACE + 2, // Aumentar en iOS
    backgroundColor: 'transparent',
    zIndex: 2, // Colocar por encima del gradiente
    position: 'relative',
  },
  innerContent: {
    flex: 1,
    padding: 16,
    paddingTop: IS_IOS ? 12 : 10,
    paddingBottom: 8, // Agregar padding inferior para espacio con bordes redondeados
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: IS_IOS ? 20 : 10, // Aumentar padding superior para evitar el notch
    paddingHorizontal: 16, // Aumentar padding horizontal para alejar los iconos de los bordes
  },
  expandedTopSection: {
    marginBottom: 16,
    minHeight: 44,
    paddingTop: IS_IOS ? 30 : 25, // Aumentar cuando expandido
  },
  collapsedTopSection: {
    marginBottom: 5, // Agregar espacio para el indicador
    minHeight: 50, // Aumentar altura mínima para tener más espacio
    paddingTop: IS_IOS ? 28 : 20, // Aumentar para posicionar los iconos más abajo
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 20, // Aumentar espacio entre iconos
    paddingLeft: 14, // Mover más a la derecha
  },
  rightSection: {
    alignItems: 'flex-end',
    paddingRight: 14, // Mover más a la izquierda
  },
  navButton: {
    padding: 12, // Aumentar el área táctil
  },
  profileButton: {
    padding: 12, // Aumentar el área táctil
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
    backgroundColor: 'transparent',
    height: 'auto',
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    overflow: 'hidden',
    borderBottomWidth: 0,
    borderWidth: 0,
    position: 'relative',
  },
  solidBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BACKGROUND_COLOR,
    opacity: 1, // Asegurar que sea visible siempre
  },
  dotsImage: {
    position: 'absolute',
    width: 130,
    height: 130,
    opacity: 0.95,
  },
  dotsExpandedPosition: {
    top: 70,
    right: 0,
  },
  dotsCollapsedPosition: {
    top: 40,
    right: 0,
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
    marginBottom: 0,
    marginTop: 10,
    includeFontPadding: false,
  },
  titleText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.9,
    marginTop: 0,
    marginBottom: 5,
  },
  collapsedFinancialContainer: {
    opacity: 0,
    maxHeight: 0,
    overflow: 'hidden',
    marginTop: 0,
    marginBottom: 0,
    transform: [{scale: 0.95}],
    display: 'none', // Ocultar completamente cuando está contraído
  },
  expandedFinancialContainer: {
    opacity: 1,
    maxHeight: 200,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 0,
    transform: [{scale: 1}],
    paddingBottom: 0,
    display: 'flex', // Mostrar cuando está expandido
  },
  profitPercentageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  profitPercentage: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 0,
  },
  profitCurrency: {
    color: COLORS.white,
    fontSize: 16,
    opacity: 0.9,
    marginLeft: 5,
    marginBottom: 3,
  },
  expansionIndicatorContainer: {
    position: 'absolute',
    bottom: 10, // Ajustar para mejor posición
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 8,
    zIndex: 3,
  },
  expansionIndicator: {
    width: 65, // Hacer más ancho para mayor visibilidad
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Aumentar opacidad para mejor visibilidad
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
    zIndex: 1,
  },
});
  
export default React.memo(HeaderCard); 