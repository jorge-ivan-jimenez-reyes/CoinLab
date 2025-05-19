import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InteractionManager } from 'react-native';

interface HeaderContextType {
  isHeaderExpanded: boolean;
  toggleHeader: (expanded?: boolean) => void;
  isTransitioning: boolean;
}

// Clave para almacenar el estado en AsyncStorage
const HEADER_STATE_KEY = '@CoinLab:header_expanded';
// Duración de la transición en ms - asegurarnos que sea suficiente
const TRANSITION_DURATION = 450;

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

interface HeaderProviderProps {
  children: ReactNode;
}

export const HeaderProvider = ({ children }: HeaderProviderProps) => {
  // Iniciar con el estado contraído por defecto (false)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Usar ref para prevenir múltiples llamadas durante la transición
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref para prevenir cambios de estado innecesarios
  const pendingStateRef = useRef<boolean | null>(null);
  // Ref para el último estado conocido
  const lastExpandedStateRef = useRef<boolean>(false);

  // Cargar estado guardado al iniciar la aplicación
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(HEADER_STATE_KEY);
        // Si hay un estado guardado, usarlo. De lo contrario, mantener el valor inicial (contraído)
        if (savedState !== null) {
          const newState = savedState === 'true';
          setIsHeaderExpanded(newState);
          lastExpandedStateRef.current = newState;
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading header state:', error);
        setIsInitialized(true);
      }
    };

    loadSavedState();
    
    // Limpiar cualquier timeout pendiente al desmontar
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Función para cambiar el estado del encabezado
  const toggleHeader = useCallback(async (expanded?: boolean) => {
    // Si ya estamos en transición, guardar el estado deseado para aplicarlo después
    if (isTransitioning) {
      pendingStateRef.current = expanded !== undefined ? expanded : !isHeaderExpanded;
      return;
    }
    
    // Si se proporciona un valor específico, usarlo. De lo contrario, alternar el estado actual
    const newState = expanded !== undefined ? expanded : !isHeaderExpanded;
    
    // Si el nuevo estado es igual al actual, no hacer nada
    if (newState === isHeaderExpanded) return;
    
    // Limpiar cualquier estado pendiente
    pendingStateRef.current = null;
    
    // Cancelar cualquier timeout pendiente antes de iniciar una nueva transición
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    // Marcar como en transición para prevenir múltiples llamadas durante la animación
    setIsTransitioning(true);
    
    // Actualizar el estado de forma inmediata
    lastExpandedStateRef.current = newState;
    
    // Usar InteractionManager para evitar problemas de renderizado UI
    InteractionManager.runAfterInteractions(() => {
      setIsHeaderExpanded(newState);
    });
    
    // Guardar el estado en AsyncStorage para persistencia (ejecutar en paralelo)
    try {
      AsyncStorage.setItem(HEADER_STATE_KEY, newState.toString());
    } catch (error) {
      console.error('Error saving header state:', error);
    }
    
    // Permitir un tiempo para que la animación se complete antes de permitir otra transición
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      
      // Si hay un estado pendiente, aplicarlo ahora
      if (pendingStateRef.current !== null) {
        const pendingState = pendingStateRef.current;
        pendingStateRef.current = null;
        // Ejecutar toggleHeader con el estado pendiente en el siguiente ciclo
        requestAnimationFrame(() => toggleHeader(pendingState));
      }
    }, TRANSITION_DURATION);
  }, [isHeaderExpanded, isTransitioning]);

  return (
    <HeaderContext.Provider 
      value={{ 
        isHeaderExpanded, 
        toggleHeader,
        isTransitioning
      }}
    >
      {isInitialized ? children : null}
    </HeaderContext.Provider>
  );
};

export const useHeader = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}; 