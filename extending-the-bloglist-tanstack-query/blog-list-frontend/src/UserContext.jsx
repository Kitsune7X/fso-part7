// TODO: Create context and provide it for all the component
// TODO: Setup the reducer with user and dispatch User
import { createContext, useContext } from 'react';

export const UserContext = createContext(null);
export const UserContextDispatch = createContext(null);

export const useUserContext = () => {
  const context = useContext(UserContext);

  return context;
};

export const useUserContextDispatch = () => {
  const context = useContext(UserContextDispatch);
  if (!context) {
    throw new Error(
      'useUserContextDispatch need to be used inside UserContextProvider',
    );
  }
  return context;
};
