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
  },
  'banking-add-account': {
    title: '¿Cómo agregar mi cuenta bancaria?',
    content: 'Para agregar una cuenta bancaria a CoinLab, sigue estos sencillos pasos:\n\n1. Desde el menú principal, dirígete a "Configuración" o "Perfil".\n\n2. Selecciona "Métodos de pago" o "Cuentas bancarias".\n\n3. Toca en "Agregar nueva cuenta bancaria".\n\n4. Proporciona la información solicitada: nombre del banco, tipo de cuenta, número de cuenta, CLABE interbancaria y nombre del titular.\n\n5. Verifica que todos los datos sean correctos y confirma la adición.\n\nPor seguridad, es posible que necesitemos verificar tu cuenta mediante un pequeño depósito de prueba o solicitando documentación adicional. Este proceso suele completarse en 1-3 días hábiles.\n\nPuedes agregar múltiples cuentas bancarias y designar una como predeterminada para tus transacciones regulares.'
  },
  'banking-transfers': {
    title: 'Transferencias y retiros',
    content: 'En CoinLab, realizar transferencias y retiros es un proceso seguro y sencillo:\n\n• Para depositar fondos: Selecciona "Depositar" en la sección de "Balance", elige tu método preferido (transferencia bancaria, tarjeta de crédito/débito) y sigue las instrucciones. Los depósitos suelen reflejarse de inmediato a 24 horas dependiendo del método.\n\n• Para retirar fondos: Ve a "Retirar" en la misma sección, selecciona la cuenta bancaria destino, introduce el monto y confirma la operación. Los retiros generalmente se procesan en 1-2 días hábiles.\n\n• Transferencias entre usuarios: Desde "Transferir", selecciona "A otro usuario", ingresa el ID o correo electrónico del destinatario y el monto. Estas transferencias son instantáneas.\n\nTodas las transacciones están protegidas con cifrado de extremo a extremo y requieren autenticación adicional para mayor seguridad. Los límites de transacción varían según el nivel de verificación de tu cuenta.'
  },
  'security-protect': {
    title: '¿Cómo proteger mi cuenta?',
    content: 'Para mantener tu cuenta de CoinLab segura, te recomendamos seguir estas prácticas esenciales:\n\n1. Utiliza contraseñas únicas y complejas: Combina letras (mayúsculas y minúsculas), números y símbolos. Evita usar la misma contraseña en diferentes plataformas.\n\n2. Activa la autenticación de dos factores (2FA): Esta capa adicional de seguridad requiere un código temporal además de tu contraseña.\n\n3. Mantén actualizada la aplicación: Las actualizaciones incluyen parches de seguridad importantes.\n\n4. Verifica regularmente la actividad de tu cuenta: Revisa periódicamente el historial de inicios de sesión y transacciones.\n\n5. Utiliza redes Wi-Fi seguras: Evita realizar operaciones en redes públicas no seguras.\n\n6. Configura alertas de seguridad: Activa notificaciones para inicios de sesión inusuales y transacciones.\n\n7. Nunca compartas tus credenciales: El equipo de CoinLab nunca te pedirá tu contraseña o códigos 2FA.'
  },
  'security-2fa': {
    title: 'Autenticación de dos factores',
    content: 'La autenticación de dos factores (2FA) es una capa de seguridad adicional que protege tu cuenta de CoinLab al requerir dos formas de verificación:\n\nPara activar 2FA:\n\n1. Ve a "Configuración" > "Seguridad" > "Autenticación de dos factores".\n\n2. Elige tu método preferido:\n   • Aplicación autenticadora (recomendado): Usa Google Authenticator, Authy u otra app similar\n   • SMS: Recibe códigos por mensaje de texto\n   • Correo electrónico: Recibe códigos en tu email verificado\n\n3. Sigue las instrucciones en pantalla para completar la configuración.\n\n4. Guarda tus códigos de recuperación en un lugar seguro (te permitirán acceder a tu cuenta si pierdes acceso al método 2FA).\n\nCon 2FA activado, necesitarás tu contraseña y un código temporal cada vez que inicies sesión o realices operaciones sensibles. Esto asegura que, incluso si alguien obtiene tu contraseña, no podrá acceder a tu cuenta sin el segundo factor de autenticación.'
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