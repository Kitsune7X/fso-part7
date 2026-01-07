import { useReducer } from 'react';
import { UserContext, UserContextDispatch } from './UserContext';

// Import UserContext, UserContextDispatch and provide those for the children

export const UserContextProvider = ({ children }) => {
  const userReducer = (_state, action) => {
    switch (action.type) {
      case 'SET_USER':
        return action.payload;
      case 'CLEAR_USER':
        return null;
      default:
        throw new Error('Unknown action: ' + action.type);
    }
  };

  const [user, dispatchUser] = useReducer(userReducer, null);

  return (
    <UserContext value={user}>
      <UserContextDispatch value={dispatchUser}>{children}</UserContextDispatch>
    </UserContext>
  );
};

// TODO: Provide Context for all the child components
