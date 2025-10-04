import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true
};

const authReducer = (state, action) => {
  console.log('Auth reducer action:', action.type, action.payload);
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      const newState = {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false
      };
      console.log('LOGIN_SUCCESS new state:', newState);
      return newState;
    case 'LOGIN_FAIL':
      return {
        ...state,
        loading: false
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'AUTH_ERROR':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Token is handled by the API interceptor

  // Load user
  useEffect(() => {
    console.log('Auth useEffect triggered:', { 
      token: !!state.token, 
      user: !!state.user, 
      loading: state.loading,
      isAuthenticated: state.isAuthenticated 
    });
    
    if (state.token && !state.user && state.loading) {
      console.log('Loading user...');
      loadUser();
    } else if (!state.token && state.loading) {
      console.log('No token, dispatching AUTH_ERROR');
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, [state.token, state.user, state.loading]);

  const loadUser = async () => {
    try {
      const res = await api.get('/api/auth/me');
      dispatch({
        type: 'USER_LOADED',
        payload: res.data.user
      });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const register = async (userData) => {
    try {
      console.log('Registering user:', userData);
      const res = await api.post('/api/auth/register', userData);
      const { token, user } = res.data;
      
      console.log('Registration successful:', { token, user });
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user }
      });
      
      return res.data;
    } catch (error) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAIL' });
      throw new Error(message);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Logging in user:', { email });
      const res = await api.post('/api/auth/login', { email, password });
      const { token, user } = res.data;
      
      console.log('Login successful:', { token, user });
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user }
      });
      
      return res.data;
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAIL' });
      throw new Error(message);
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      register,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
