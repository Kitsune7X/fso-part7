import { createContext, useReducer } from 'react';

// TODO: Extract the reducer into the Context
export const NotificationContext = createContext(null);
export const NotificationDispatchContext = createContext(null);

// TODO: Declare a NotificationProvider to manage the state,
// provide contexts for components below
// take children as prop

export const NotificationContextProvider = ({ children }) => {
  const initialState = { message: null, isError: false };

  const notificationReducer = (_state, action) => {
    switch (action.type) {
      case 'DISPLAY_NOTIFICATION': {
        return action.payload;
      }
      case 'CLEAR_NOTIFICATION': {
        return initialState;
      }
      default: {
        throw new Error('Unknown action: ' + action.type);
      }
    }
  };

  const [notification, dispatchNotification] = useReducer(
    notificationReducer,
    initialState,
  );

  return (
    <NotificationContext value={notification}>
      <NotificationDispatchContext value={dispatchNotification}>
        {children}
      </NotificationDispatchContext>
    </NotificationContext>
  );
};
