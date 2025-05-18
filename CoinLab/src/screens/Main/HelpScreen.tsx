import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import COLORS from '../../theme/colors';
import { IMAGES } from '../../assets/index';
import { ResponsiveScreenLayout } from '../../components/Layout';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: '¿Qué es CoinLab?',
    answer: 'CoinLab es una aplicación para monitorear, analizar y gestionar inversiones en criptomonedas. Ofrece herramientas para seguimiento de precios, gestión de portafolio y análisis de mercado.'
  },
  {
    question: '¿Cómo crear una cuenta?',
    answer: 'Para crear una cuenta, ve a la pantalla de inicio y selecciona "Registrarse". Completa el formulario con tu información personal y sigue las instrucciones para verificar tu correo electrónico.'
  },
  {
    question: '¿Es segura mi información?',
    answer: 'Sí, CoinLab utiliza encriptación de nivel bancario para proteger tus datos personales y financieros. No almacenamos tus claves privadas y utilizamos autenticación de dos factores para mayor seguridad.'
  },
  {
    question: '¿Cómo contactar al soporte?',
    answer: 'Puedes contactar a nuestro equipo de soporte a través del formulario en la aplicación, por correo electrónico a support@coinlab.com o mediante nuestras redes sociales.'
  }
];

const HelpScreen = () => {
  const renderFAQItem = (item: FAQItem, index: number) => (
    <View key={index} style={styles.faqItem}>
      <Text style={styles.question}>{item.question}</Text>
      <Text style={styles.answer}>{item.answer}</Text>
    </View>
  );

  return (
    <ResponsiveScreenLayout
      title="Ayuda"
      backgroundImage={IMAGES.CARD_BACKGROUND}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
          
          <View style={styles.faqContainer}>
            {faqData.map(renderFAQItem)}
          </View>
          
          <Text style={styles.sectionTitle}>Contacto</Text>
          
          <View style={styles.contactContainer}>
            <TouchableOpacity style={styles.contactItem}>
              <Ionicons name="mail" size={24} color={COLORS.primary} />
              <Text style={styles.contactText}>support@coinlab.com</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactItem}>
              <Ionicons name="logo-twitter" size={24} color={COLORS.primary} />
              <Text style={styles.contactText}>@CoinLabApp</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactItem}>
              <Ionicons name="call" size={24} color={COLORS.primary} />
              <Text style={styles.contactText}>+1 (800) 555-1234</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ResponsiveScreenLayout>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  contentContainer: {
    paddingHorizontal: 15,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    marginTop: 10,
    width: '100%',
  },
  faqContainer: {
    marginBottom: 20,
    width: '100%',
  },
  faqItem: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    width: '100%',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
  contactContainer: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.mediumGray,
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mediumGray,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text,
  },
});

export default HelpScreen; 