import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: '¿Qué es CoinLab?',
    answer: 'CoinLab es una plataforma de criptomonedas donde puedes monitorear precios, gestionar tu portafolio y utilizar agentes automatizados para optimizar tus inversiones.'
  },
  {
    id: '2',
    question: '¿Cómo funcionan los agentes?',
    answer: 'Los agentes son algoritmos automatizados que analizan datos del mercado para ayudarte a tomar decisiones de inversión más informadas o incluso realizar operaciones automáticas según los parámetros que configures.'
  },
  {
    id: '3',
    question: '¿Es seguro utilizar CoinLab?',
    answer: 'Sí, utilizamos medidas de seguridad de nivel bancario. Toda tu información está encriptada y nunca almacenamos tus claves privadas.'
  },
  {
    id: '4',
    question: '¿Puedo crear mis propios agentes?',
    answer: 'Próximamente lanzaremos una función para que los usuarios avanzados puedan crear y compartir sus propios agentes de inversión.'
  }
];

const HelpScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>CoinLab</Text>
        <Text style={styles.subtitle}>Ayuda</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        
        {faqData.map((item) => (
          <View key={item.id} style={styles.faqItem}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.answer}>{item.answer}</Text>
          </View>
        ))}
        
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>¿Necesitas más ayuda?</Text>
          <Text style={styles.contactText}>
            Si tienes alguna otra pregunta o necesitas soporte, contáctanos:
          </Text>
          
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contactar Soporte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    marginTop: 10,
  },
  faqItem: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 22,
  },
  contactSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  contactText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HelpScreen; 