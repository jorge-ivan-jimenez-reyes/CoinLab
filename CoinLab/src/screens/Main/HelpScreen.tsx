import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  StatusBar
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import COLORS from '../../theme/colors';
import { ResponsiveScreenLayout } from '../../components/Layout';
import { IMAGES } from '../../assets';
import { useData } from '../../context/DataContext';

// Remove hardcoded user data
// const userData = {
//   name: 'Jose Manuel',
// };

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  toggleOpen: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  title, 
  children, 
  isOpen, 
  toggleOpen 
}) => {
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={toggleOpen}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Ionicons 
          name={isOpen ? 'remove' : 'add'} 
          size={24} 
          color={COLORS.text} 
        />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={styles.accordionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

const HelpScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useData(); // Use the DataContext to get user info
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    agents: true,
    banking: false,
    security: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNavigation = (screenName: string, params: any) => {
    // @ts-ignore: Navigate to detail screen
    navigation.navigate(screenName, params);
  };

  return (
    <ResponsiveScreenLayout
      title="¿Cómo te podemos ayudar hoy?"
      amount={user.name}
      amountLabel=""
      profit=""
      showBackButton={true}
      backgroundImage={IMAGES.CARD_BACKGROUND}
    >
      <Text style={styles.headerTitle}>Preguntas Comunes</Text>
      
      <AccordionItem 
        title="Agentes" 
        isOpen={openSections.agents}
        toggleOpen={() => toggleSection('agents')}
      >
        <TouchableOpacity 
          style={styles.questionButton}
          onPress={() => handleNavigation('HelpDetail', { 
            title: 'Agentes', 
            questionId: 'agent-function' 
          })}
        >
          <Text style={styles.questionText}>¿Como funcionan los agentes?</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.questionButton}
          onPress={() => handleNavigation('HelpDetail', { 
            title: 'Agentes', 
            questionId: 'agent-money' 
          })}
        >
          <Text style={styles.questionText}>¿Los Agentes usan mi dinero?</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.questionButton}
          onPress={() => handleNavigation('HelpDetail', { 
            title: 'Agentes', 
            questionId: 'agent-intensity' 
          })}
        >
          <Text style={styles.questionText}>Intensidad en los agentes</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </AccordionItem>
      
      <AccordionItem 
        title="Informacion Bancaria" 
        isOpen={openSections.banking}
        toggleOpen={() => toggleSection('banking')}
      >
        <TouchableOpacity 
          style={styles.questionButton}
          onPress={() => handleNavigation('HelpDetail', { 
            title: 'Información Bancaria', 
            questionId: 'banking-add-account' 
          })}
        >
          <Text style={styles.questionText}>¿Cómo agregar mi cuenta bancaria?</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.questionButton}
          onPress={() => handleNavigation('HelpDetail', { 
            title: 'Información Bancaria', 
            questionId: 'banking-transfers' 
          })}
        >
          <Text style={styles.questionText}>Transferencias y retiros</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </AccordionItem>
      
      <AccordionItem 
        title="Seguridad" 
        isOpen={openSections.security}
        toggleOpen={() => toggleSection('security')}
      >
        <TouchableOpacity 
          style={styles.questionButton}
          onPress={() => handleNavigation('HelpDetail', { 
            title: 'Seguridad', 
            questionId: 'security-protect' 
          })}
        >
          <Text style={styles.questionText}>¿Cómo proteger mi cuenta?</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.questionButton}
          onPress={() => handleNavigation('HelpDetail', { 
            title: 'Seguridad', 
            questionId: 'security-2fa' 
          })}
        >
          <Text style={styles.questionText}>Autenticación de dos factores</Text>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </AccordionItem>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.moreOptionsButton}>
          <Ionicons name="chatbox-outline" size={24} color={COLORS.white} />
          <Text style={styles.moreOptionsText}>Mas Opciones</Text>
        </TouchableOpacity>
      </View>
    </ResponsiveScreenLayout>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: COLORS.text,
    paddingTop: 10,
  },
  accordionContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  accordionContent: {
    paddingBottom: 5,
  },
  questionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: COLORS.white,
  },
  questionText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
    paddingRight: 10,
  },
  footer: {
    paddingVertical: 15,
    marginTop: 20,
  },
  moreOptionsButton: {
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
  moreOptionsText: {
    color: COLORS.white,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HelpScreen; 