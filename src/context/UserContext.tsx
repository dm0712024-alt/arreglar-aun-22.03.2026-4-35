import { createContext, useContext, useState, ReactNode } from "react";

export interface UserInfo {
  name: string;
  phone: string;
  instagram: string;
  email?: string;
}

interface UserContextType {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  pendingAction: (() => void) | null;
  requireLogin: (action: () => void) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserInfo | null>(() => {
    const saved = localStorage.getItem("hemerza-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const setUser = (info: UserInfo) => {
    setUserState(info);
    localStorage.setItem("hemerza-user", JSON.stringify(info));
    setShowLoginModal(false);
    // Execute pending action after login
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem("hemerza-user");
  };

  const requireLogin = (action: () => void) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setShowLoginModal(true);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, showLoginModal, setShowLoginModal, pendingAction, requireLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
