import { useContext } from 'react';
import styles from './Notification.module.css';
import { NotificationContext } from '../../notificationContext';

const Notification = () => {
  // Deconstruct message now since the value of the context is now an object
  const { message, isError } = useContext(NotificationContext);

  return (
    <div className={`${styles.notification} ${isError ? styles.error : ''}`}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
