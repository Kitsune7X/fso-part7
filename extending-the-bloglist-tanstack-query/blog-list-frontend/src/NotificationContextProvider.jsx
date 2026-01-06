import { useReducer } from 'react';
import {
  NotificationContext,
  NotificationDispatchContext,
} from './notificationContext';

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
