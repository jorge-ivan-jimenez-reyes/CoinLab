import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import COLORS from '../../theme/colors';
import { ResponsiveScreenLayout } from '../../components/Layout';
import { IMAGES } from '../../assets';

interface RouteParams {
  title: string;
  questionId: string;
}

// Mock data for question answers
const helpContent: Record<string, { title: string; content: string }> = {
  'agent-function': {
    title: '¿Como funcionan los agentes?',
    content: 'Los agentes de CoinLab son algoritmos de trading automatizados que operan en el mercado de criptomonedas basados en estrategias predefinidas. Analizan patrones de mercado, tendencias y datos históricos para tomar decisiones de compra y venta optimizadas.\n\nCada agente tiene un propósito específico y una estrategia única de inversión, desde enfoques conservadores hasta más agresivos. Puedes elegir qué agentes activar según tu perfil de riesgo y objetivos de inversión.\n\nLos agentes operan 24/7 y se adaptan constantemente a las condiciones cambiantes del mercado para maximizar tus oportunidades de beneficio.'
  },
  'agent-money': {
    title: '¿Los Agentes usan mi dinero?',
    content: 'Sí, los agentes operan con los fondos que tú asignas específicamente para su funcionamiento. Cuando activas un agente, debes asignarle un presupuesto de operación que será utilizado para realizar transacciones en tu nombre.\n\nSin embargo, tienes control total sobre cuánto dinero asignas a cada agente. Puedes establecer límites de inversión, detener su actividad en cualquier momento o reasignar fondos entre diferentes agentes según tu estrategia.\n\nTodos los fondos permanecen en tu cuenta y bajo tu control en todo momento. CoinLab nunca tiene acceso directo a tus activos principales, solo a la cantidad que has designado explícitamente para las operaciones automatizadas.'
  },
  'agent-intensity': {
    title: 'Intensidad en los agentes',
    content: 'La intensidad de los agentes es un parámetro configurable que determina la frecuencia y agresividad con la que operan en el mercado. Puedes ajustar este nivel según tu tolerancia al riesgo y objetivos de inversión.\n\nNiveles de intensidad más bajos significan operaciones más conservadoras, con menos transacciones y enfoque en oportunidades de menor riesgo. Niveles más altos aumentan la frecuencia de operaciones y pueden buscar oportunidades más arriesgadas pero potencialmente más rentables.\n\nPuedes modificar la intensidad en cualquier momento desde la configuración de cada agente, permitiéndote adaptar tus estrategias según las condiciones del mercado o tus preferencias personales.'
  }
};

const HelpDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, questionId } = route.params as RouteParams;
  
  const content = helpContent[questionId] || { 
    title: 'Información no disponible', 
    content: 'Lo sentimos, la información para esta pregunta no está disponible actualmente.' 
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ResponsiveScreenLayout
      title={content.title}
      showBackButton={true}
      onBackPress={handleBackPress}
      backgroundImage={IMAGES.CARD_BACKGROUND}
    >
      <View style={styles.questionContainer}>
        <Text style={styles.questionContent}>{content.content}</Text>
      </View>
      
      <View style={styles.helpfulContainer}>
        <Text style={styles.helpfulText}>¿Te resultó útil esta información?</Text>
        <View style={styles.feedbackButtons}>
          <TouchableOpacity style={styles.feedbackButton}>
            <Ionicons name="thumbs-up-outline" size={20} color={COLORS.success} />
            <Text style={[styles.feedbackText, { color: COLORS.success }]}>Sí</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.feedbackButton}>
            <Ionicons name="thumbs-down-outline" size={20} color={COLORS.error} />
            <Text style={[styles.feedbackText, { color: COLORS.error }]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="chatbox-outline" size={24} color={COLORS.white} />
          <Text style={styles.contactText}>Contactar Soporte</Text>
        </TouchableOpacity>
      </View>
    </ResponsiveScreenLayout>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    marginBottom: 30,
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  helpfulContainer: {
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    padding: 20,
  },
  helpfulText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.text,
  },
  feedbackButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 25,
    width: 100,
    backgroundColor: COLORS.white,
  },
  feedbackText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 15,
    marginTop: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171717',
    paddingVertical: 15,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  contactText: {
    color: COLORS.white,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HelpDetailScreen; 