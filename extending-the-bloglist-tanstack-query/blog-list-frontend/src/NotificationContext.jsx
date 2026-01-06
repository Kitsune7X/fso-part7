import { createContext, useContext } from 'react';

export const NotificationContext = createContext(null);
export const NotificationDispatchContext = createContext(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotificationContext need to be used inside NotificationContextProvider',
    );
  }

  return context;
};

export const useNotificationDispatchContext = () => {
  const context = useContext(NotificationDispatchContext);
  if (!context) {
    throw new Error(
      'useNotificationDispatchContext need to be used inside NotificationContextProvider',
    );
  }

  return context;
};
