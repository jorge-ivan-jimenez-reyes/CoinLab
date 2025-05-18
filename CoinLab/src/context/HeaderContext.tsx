import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HeaderContextType {
  isHeaderExpanded: boolean;
  toggleHeader: (expanded?: boolean) => void;
}

// Clave para almacenar el estado en AsyncStorage
const HEADER_STATE_KEY = '@CoinLab:header_expanded';

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

interface HeaderProviderProps {
  children: ReactNode;
}

export const HeaderProvider = ({ children }: HeaderProviderProps) => {
  // Iniciar con el estado contraído por defecto (false)
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar estado guardado al iniciar la aplicación
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(HEADER_STATE_KEY);
        // Si hay un estado guardado, usarlo. De lo contrario, mantener el valor inicial (contraído)
        if (savedState !== null) {
          setIsHeaderExpanded(savedState === 'true');
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading header state:', error);
        setIsInitialized(true);
      }
    };

    loadSavedState();
  }, []);

  // Función para cambiar el estado del encabezado
  const toggleHeader = async (expanded?: boolean) => {
    // Si se proporciona un valor específico, usarlo. De lo contrario, alternar el estado actual
    const newState = expanded !== undefined ? expanded : !isHeaderExpanded;
    console.log(`Cambiando estado global del header a: ${newState ? 'expandido' : 'contraído'}`);
    
    setIsHeaderExpanded(newState);
    
    // Guardar el estado en AsyncStorage para persistencia
    try {
      await AsyncStorage.setItem(HEADER_STATE_KEY, newState.toString());
    } catch (error) {
      console.error('Error saving header state:', error);
    }
  };

  return (
    <HeaderContext.Provider 
      value={{ 
        isHeaderExpanded, 
        toggleHeader 
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