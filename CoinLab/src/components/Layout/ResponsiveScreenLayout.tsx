import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
import { HeaderCard } from '../Header';
import { useHeader } from '../../context/HeaderContext';
import COLORS from '../../theme/colors';

// Obtener dimensiones para hacer el header responsivo
const { height, width } = Dimensions.get('window');
// Calcular la altura para los estados contraído y expandido
const COLLAPSED_HEIGHT = Math.min(height * 0.08, 70) + (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0);
const EXPANDED_HEIGHT = height * 0.38 + (Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0);
// Margen superior para evitar la barra de estado
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
// Padding adicional para asegurar que los elementos no se corten
const SAFE_PADDING = 15;

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
  hideStatusBar,
  headerOffset = 0,
  contentPadding = 15,
}) => {
  // Usar el estado global del header
  const { isHeaderExpanded } = useHeader();
  // Estado para el espacio reservado para el header
  const [headerSpacing, setHeaderSpacing] = useState(
    isHeaderExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT
  );

  // Efecto para actualizar el espacio cuando cambia el estado global
  useEffect(() => {
    const newHeight = isHeaderExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT;
    setHeaderSpacing(newHeight);
  }, [isHeaderExpanded]);

  // Manejar cambios de altura en tiempo real
  const handleHeaderHeightChange = (height: number) => {
    console.log(`Screen Layout - Header height changed to: ${height}`);
    setHeaderSpacing(height);
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content" 
      />
      
      {/* Header que se coloca encima usando position:absolute */}
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
        />
      </View>
      
      {/* Vista con padding superior para reservar espacio para el header */}
      <View 
        style={[
          styles.content,
          {
            paddingTop: headerSpacing + 25,
            paddingHorizontal: contentPadding,
          }
        ]}
      >
        {children}
      </View>
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

export default ResponsiveScreenLayout; 