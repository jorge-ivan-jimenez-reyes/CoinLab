import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, SafeAreaView, Dimensions, Platform, StatusBar, StyleSheet, Animated } from 'react-native';
import { HeaderCard } from '../Header';
import { useHeader } from '../../context/HeaderContext';
import COLORS from '../../theme/colors';

// Obtener dimensiones para hacer el header responsivo
const { height, width } = Dimensions.get('window');
// Calcular la altura para los estados contraído y expandido
const COLLAPSED_HEIGHT = Math.min(height * 0.12, 90) + (Platform.OS === 'ios' ? 40 : StatusBar.currentHeight || 0);
const EXPANDED_HEIGHT = height * 0.30 + (Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0);
// Margen superior para evitar la barra de estado
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
// Padding adicional para asegurar que los elementos no se corten
const SAFE_PADDING = 15;
// Valor para el border radius - debe coincidir con HeaderCard
const BORDER_RADIUS = 35;

// Color de fondo para el header - debe coincidir con el de HeaderCard
const HEADER_BACKGROUND_COLOR = '#1E1E24';

// Imagen de fondo por defecto
const DEFAULT_BACKGROUND_IMAGE = require('../../assets/card.png');

interface ResponsiveScreenLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  backgroundImage?: any;
  amount?: string;
  amountLabel?: string;
  profit?: string;
  profitPercentage?: string;
  currencySymbol?: string;
  hideStatusBar?: boolean;
  headerOffset?: number;
  contentPadding?: number;
  disableColorChange?: boolean;
}

const ResponsiveScreenLayout: React.FC<ResponsiveScreenLayoutProps> = ({
  children,
  title = '',
  showBackButton = true,
  onBackPress,
  backgroundImage = DEFAULT_BACKGROUND_IMAGE,
  amount,
  amountLabel,
  profit,
  profitPercentage,
  currencySymbol,
  hideStatusBar = true,
  headerOffset = 0,
  contentPadding = 15,
  disableColorChange = false,
}) => {
  // Usar el estado global del header
  const { isHeaderExpanded } = useHeader();
  // Referencia a la altura animada
  const paddingAnim = useRef(new Animated.Value(
    isHeaderExpanded ? EXPANDED_HEIGHT + 25 : COLLAPSED_HEIGHT + 15
  )).current;
  
  // Estado para el espacio reservado para el header
  const [headerSpacing, setHeaderSpacing] = useState(
    isHeaderExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT
  );

  // Efecto para actualizar el espacio cuando cambia el estado global
  useEffect(() => {
    // Animar el cambio de espacio para reducir parpadeos
    Animated.timing(paddingAnim, {
      toValue: isHeaderExpanded ? EXPANDED_HEIGHT + 25 : COLLAPSED_HEIGHT + 15,
      duration: 400,
      useNativeDriver: false,
    }).start();
    
    // Actualizar el estado para mantener la consistencia
    setHeaderSpacing(isHeaderExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT);
  }, [isHeaderExpanded]);

  // Manejar cambios de altura en tiempo real
  const handleHeaderHeightChange = useCallback((height: number) => {
    setHeaderSpacing(height);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content"
        hidden={hideStatusBar}
      />
      
      {/* Header que se coloca usando position:absolute */}
      <View style={styles.headerContainer}>
        <HeaderCard 
          title={title}
          showBackButton={showBackButton}
          onBackPress={onBackPress}
          backgroundImage={backgroundImage}
          amount={amount}
          amountLabel={amountLabel}
          profit={profit}
          profitPercentage={profitPercentage}
          currencySymbol={currencySymbol}
          hideStatusBar={hideStatusBar}
          onHeightChange={handleHeaderHeightChange}
          disableColorChange={disableColorChange}
        />
      </View>
      
      {/* Vista con padding superior para reservar espacio para el header */}
      <Animated.View style={[
        styles.content,
        { 
          paddingTop: paddingAnim,
          paddingHorizontal: contentPadding 
        }
      ]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
    marginTop: 0,
    paddingBottom: 20,
    zIndex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 10,
    overflow: 'visible',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
});

export default React.memo(ResponsiveScreenLayout); 