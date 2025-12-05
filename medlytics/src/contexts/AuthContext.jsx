// contexts/AuthContext.jsx
import { createContext } from 'react';

const AuthContext = createContext({
    user: null,
    token: null,
    loading: true,
    isAuthenticated: false,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    updateUser: () => { },
});

export default AuthContext;
