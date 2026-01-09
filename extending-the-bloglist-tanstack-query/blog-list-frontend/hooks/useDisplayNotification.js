import { useNotificationDispatchContext } from '../src/notificationContext';

export const useDisplayNotification = () => {
  const dispatchNotification = useNotificationDispatchContext();

  const displayNotification = (message, isError = false) => {
    dispatchNotification({
      type: 'DISPLAY_NOTIFICATION',
      payload: {
        message,
        isError,
      },
    });

    setTimeout(() => {
      dispatchNotification({ type: 'CLEAR_NOTIFICATION' });
    }, 5000);
  };

  return displayNotification;
};
