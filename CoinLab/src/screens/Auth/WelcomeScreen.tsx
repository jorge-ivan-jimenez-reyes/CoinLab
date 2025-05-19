import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Image, 
  Dimensions, 
  Animated, 
  Easing
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets';
import { Ionicons } from 'react-native-vector-icons';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

// Interfaces para props de componentes animados
interface AnimatedLineProps {
  top: number;
  width: number;
  delay: number;
  duration: number;
  color?: string;
}

interface AnimatedDotProps {
  startTop: number;
  delay: number;
  size?: number;
  color?: string;
}

// Componente para crear líneas flotantes que simulan gráficos de precios
const AnimatedLine: React.FC<AnimatedLineProps> = ({ top, width: lineWidth, delay, duration, color = '#4D85BD' }) => {
  const translateX = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -lineWidth,
        duration: duration,
        delay: delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);
  
  return (
    <Animated.View 
      style={{
        position: 'absolute',
        top,
        height: 2,
        width: lineWidth,
        backgroundColor: color,
        opacity: 0.4,
        transform: [{ translateX }]
      }}
    />
  );
};

// Componente para crear puntos flotantes que simulan puntos de datos
const AnimatedDot: React.FC<AnimatedDotProps> = ({ startTop, delay, size = 4, color = '#5DADE2' }) => {
  const translateX = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;
  
  useEffect(() => {
    // Movimiento horizontal
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -size * 2,
        duration: 15000 + (delay * 500),
        delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    
    // Movimiento vertical aleatorio
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: Math.random() * 30 - 15,
          duration: 3000 + Math.random() * 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: Math.random() * 30 - 15,
          duration: 3000 + Math.random() * 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Pulsación de opacidad
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  return (
    <Animated.View 
      style={{
        position: 'absolute',
        top: startTop,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        opacity,
        transform: [
          { translateX },
          { translateY }
        ]
      }}
    />
  );
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  
  // Referencias para las animaciones
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Animación horizontal
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -15,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 15,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Animación vertical
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Animación de escala (zoom suave)
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleGoogleLogin = () => {
    // Aquí iría la lógica de inicio de sesión con Google
    console.log('Login with Google');
    login();
  };

  // Crear líneas aleatorias
  const renderLines = () => {
    const lines = [];
    const lineCount = 10;
    
    for (let i = 0; i < lineCount; i++) {
      const top = Math.random() * height;
      const lineWidth = Math.random() * 100 + 150;
      const delay = Math.random() * 2000;
      const duration = Math.random() * 6000 + 10000;
      const color = i % 2 === 0 ? '#5DADE2' : '#4D85BD';
      
      lines.push(
        <AnimatedLine 
          key={`line-${i}`} 
          top={top} 
          width={lineWidth} 
          delay={delay} 
          duration={duration}
          color={color}
        />
      );
    }
    
    return lines;
  };
  
  // Crear puntos aleatorios
  const renderDots = () => {
    const dots = [];
    const dotCount = 20;
    
    for (let i = 0; i < dotCount; i++) {
      const startTop = Math.random() * height;
      const delay = Math.random() * 5000;
      const size = Math.random() * 3 + 2;
      const color = i % 3 === 0 ? '#5DADE2' : (i % 3 === 1 ? '#4D85BD' : '#2E86C1');
      
      dots.push(
        <AnimatedDot 
          key={`dot-${i}`} 
          startTop={startTop}
          delay={delay}
          size={size}
          color={color}
        />
      );
    }
    
    return dots;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Fondo animado */}
      <Animated.View style={[
        styles.backgroundImageContainer,
        { 
          transform: [
            { translateX },
            { translateY },
            { scale }
          ] 
        }
      ]}>
        <Image 
          source={IMAGES.LANDING_BACKGROUND}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </Animated.View>
      
      {/* Elementos animados que simulan gráficos */}
      <View style={styles.animatedElementsContainer}>
        {renderLines()}
        {renderDots()}
      </View>
      
      <SafeAreaView style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={IMAGES.LOGO} style={styles.logo} resizeMode="contain" />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>
          
          <Text style={styles.orText}>O</Text>
          
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Image 
              source={IMAGES.GOOGLE_ICON} 
              style={styles.googleIcon} 
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  backgroundImageContainer: {
    position: 'absolute',
    width: width + 30, // Un poco más grande para permitir movimiento
    height: height + 20,
    left: -15,
    top: -10,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  animatedElementsContainer: {
    position: 'absolute',
    width: width,
    height: height,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  logo: {
    width: width * 0.7,
    height: height * 0.2,
  },
  buttonContainer: {
    width: '85%',
    alignSelf: 'center',
    marginTop: 'auto',
  },
  loginButton: {
    backgroundColor: '#5DADE2',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#283593',
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#5F6368',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default WelcomeScreen; 