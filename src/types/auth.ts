export interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const SESSION_KEY = 'admin_session';
export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds