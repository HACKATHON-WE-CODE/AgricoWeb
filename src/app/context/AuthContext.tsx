import React, { createContext, useContext, useState, ReactNode } from "react";

// Définir le type pour le contexte
interface AuthContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any; // Vous pouvez remplacer `any` par un type d'utilisateur spécifique
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login: (userData: any) => void; // Spécifiez un type pour userData si nécessaire
  logout: () => void;
  loading: boolean;
}

// Créer le contexte avec un type
const AuthContext = createContext<AuthContextType | null>(null);

// Définir le type des props pour AuthProvider
interface AuthProviderProps {
  children: ReactNode; // `ReactNode` est un type approprié pour `children`
}

// Créer le composant AuthProvider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null); // Remplacez `any` par un type d'utilisateur spécifique si possible
  const [loading, setLoading] = useState(true); // État de chargement

  // Fonction de connexion
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = (userData: any) => {
    setUser(userData);
    setLoading(false); // Définir loading sur false une fois que les données utilisateur sont définies
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    setLoading(false); // Définir loading sur false après la déconnexion
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Créer un hook personnalisé pour utiliser le AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
