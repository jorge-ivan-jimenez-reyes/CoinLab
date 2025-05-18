import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageSourcePropType } from 'react-native';
import { IMAGES } from '../assets/index';

// Tipos para los datos
export interface User {
  name: string;
  availableBalance: string;
  currency: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'paused';
  investment: string;
  profit: string;
  profitPercentage: string;
}

export interface AgentPortfolio {
  totalInvested: string;
  totalProfit: string;
  profitPercentage: string;
  currency: string;
}

export interface Movement {
  id: string;
  type: string;
  action: string;
  icon: ImageSourcePropType;
  amount: string;
  currency: string;
  priceUp: boolean;
  timestamp: string;
  agentId?: string;
}

// Tipo para el contexto
interface DataContextType {
  user: User;
  agents: Agent[];
  agentPortfolio: AgentPortfolio;
  recentMovements: Movement[];
  updateUser: (userData: Partial<User>) => void;
  addAgent: (agent: Omit<Agent, 'id'>) => void;
  updateAgent: (id: string, agentData: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  addMovement: (movement: Omit<Movement, 'id'>) => void;
}

// Datos iniciales
const initialUser: User = {
  name: "Jorge",
  availableBalance: "8,532.45",
  currency: "USD"
};

const initialAgents: Agent[] = [
  { 
    id: '1', 
    name: 'Agente Alpha', 
    description: 'Especializado en trading automático de Bitcoin',
    status: 'active',
    investment: '5,200.00',
    profit: '+980.45',
    profitPercentage: '+18.85%'
  },
  { 
    id: '2', 
    name: 'Agente Beta', 
    description: 'Enfocado en detección de patrones en altcoins',
    status: 'active',
    investment: '3,800.00',
    profit: '+562.30',
    profitPercentage: '+14.80%'
  },
  { 
    id: '3', 
    name: 'Agente Delta', 
    description: 'Algoritmo de inversión a largo plazo',
    status: 'paused',
    investment: '8,750.00',
    profit: '+1,105.25',
    profitPercentage: '+12.63%'
  },
  { 
    id: '4', 
    name: 'Agente Gamma', 
    description: 'Estrategias de trading de alta frecuencia',
    status: 'active',
    investment: '4,200.00',
    profit: '+625.50',
    profitPercentage: '+14.89%'
  },
  { 
    id: '5', 
    name: 'Agente Omega', 
    description: 'Análisis de sentimiento en redes sociales',
    status: 'inactive',
    investment: '3,056.89',
    profit: '+184.87',
    profitPercentage: '+6.05%'
  },
];

const initialPortfolio: AgentPortfolio = {
  totalInvested: "25,006.89",
  totalProfit: "+3,458.37",
  profitPercentage: "+16.04%",
  currency: "USD"
};

const initialMovements: Movement[] = [
  {
    id: '1',
    type: 'Largo Plazo',
    action: 'Venta',
    icon: IMAGES.USER_ICON,
    amount: '-$340.80',
    currency: 'Bitcoin',
    priceUp: false,
    timestamp: '2023-08-15T14:23:45Z',
    agentId: '3'
  },
  {
    id: '2',
    type: 'Trading',
    action: 'Compra',
    icon: IMAGES.USER_ICON,
    amount: '+$520.50',
    currency: 'Ethereum',
    priceUp: true,
    timestamp: '2023-08-14T09:12:30Z',
    agentId: '1'
  },
  {
    id: '3',
    type: 'Alta Frecuencia',
    action: 'Venta',
    icon: IMAGES.USER_ICON,
    amount: '+$125.20',
    currency: 'Bitcoin',
    priceUp: true,
    timestamp: '2023-08-13T18:45:10Z',
    agentId: '4'
  }
];

// Claves para AsyncStorage
const STORAGE_KEYS = {
  USER: '@CoinLab:user',
  AGENTS: '@CoinLab:agents',
  PORTFOLIO: '@CoinLab:portfolio',
  MOVEMENTS: '@CoinLab:movements'
};

// Crear el contexto
const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider del contexto
interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [user, setUser] = useState<User>(initialUser);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [agentPortfolio, setAgentPortfolio] = useState<AgentPortfolio>(initialPortfolio);
  const [recentMovements, setRecentMovements] = useState<Movement[]>(initialMovements);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Cargar datos del usuario
        const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        if (savedUser !== null) {
          setUser(JSON.parse(savedUser));
        }

        // Cargar datos de agentes
        const savedAgents = await AsyncStorage.getItem(STORAGE_KEYS.AGENTS);
        if (savedAgents !== null) {
          setAgents(JSON.parse(savedAgents));
        }

        // Cargar datos del portafolio
        const savedPortfolio = await AsyncStorage.getItem(STORAGE_KEYS.PORTFOLIO);
        if (savedPortfolio !== null) {
          setAgentPortfolio(JSON.parse(savedPortfolio));
        }

        // Cargar datos de movimientos
        const savedMovements = await AsyncStorage.getItem(STORAGE_KEYS.MOVEMENTS);
        if (savedMovements !== null) {
          setRecentMovements(JSON.parse(savedMovements));
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsInitialized(true);
      }
    };

    loadSavedData();
  }, []);

  // Actualizar el usuario
  const updateUser = async (userData: Partial<User>) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  // Añadir un agente
  const addAgent = async (agent: Omit<Agent, 'id'>) => {
    const newAgent: Agent = {
      ...agent,
      id: Date.now().toString(), // Generar ID único
    };
    
    const updatedAgents = [...agents, newAgent];
    setAgents(updatedAgents);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(updatedAgents));
      // Actualizar el portafolio
      updatePortfolio(updatedAgents);
    } catch (error) {
      console.error('Error saving agents data:', error);
    }
  };

  // Actualizar un agente
  const updateAgent = async (id: string, agentData: Partial<Agent>) => {
    const updatedAgents = agents.map(agent => 
      agent.id === id ? { ...agent, ...agentData } : agent
    );
    
    setAgents(updatedAgents);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(updatedAgents));
      // Actualizar el portafolio
      updatePortfolio(updatedAgents);
    } catch (error) {
      console.error('Error saving agents data:', error);
    }
  };

  // Eliminar un agente
  const deleteAgent = async (id: string) => {
    const updatedAgents = agents.filter(agent => agent.id !== id);
    setAgents(updatedAgents);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(updatedAgents));
      // Actualizar el portafolio
      updatePortfolio(updatedAgents);
    } catch (error) {
      console.error('Error saving agents data:', error);
    }
  };

  // Añadir un movimiento
  const addMovement = async (movement: Omit<Movement, 'id'>) => {
    const newMovement: Movement = {
      ...movement,
      id: Date.now().toString(), // Generar ID único
    };
    
    const updatedMovements = [newMovement, ...recentMovements];
    setRecentMovements(updatedMovements);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(updatedMovements));
    } catch (error) {
      console.error('Error saving movements data:', error);
    }
  };

  // Actualizar el portafolio
  const updatePortfolio = async (currentAgents: Agent[]) => {
    // Calcular el total invertido
    let totalInvested = 0;
    let totalProfit = 0;
    
    currentAgents.forEach(agent => {
      // Convertir valores numéricos
      const investment = parseFloat(agent.investment.replace(/,/g, ''));
      const profit = parseFloat(agent.profit.replace(/[+$,]/g, ''));
      
      totalInvested += investment;
      totalProfit += profit;
    });
    
    // Calcular el porcentaje de beneficio
    const profitPercentage = totalInvested > 0 
      ? ((totalProfit / totalInvested) * 100).toFixed(2) 
      : "0.00";
    
    const updatedPortfolio: AgentPortfolio = {
      totalInvested: totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalProfit: `+${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      profitPercentage: `+${profitPercentage}%`,
      currency: agentPortfolio.currency
    };
    
    setAgentPortfolio(updatedPortfolio);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(updatedPortfolio));
    } catch (error) {
      console.error('Error saving portfolio data:', error);
    }
  };

  return (
    <DataContext.Provider 
      value={{ 
        user,
        agents,
        agentPortfolio,
        recentMovements,
        updateUser,
        addAgent,
        updateAgent,
        deleteAgent,
        addMovement
      }}
    >
      {isInitialized ? children : null}
    </DataContext.Provider>
  );
};

// Hook para usar el contexto
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}; 