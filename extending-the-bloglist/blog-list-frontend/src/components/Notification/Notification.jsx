import styles from './Notification.module.css';

const Notification = ({ message, isError }) => (
  <div className={`${styles.notification} ${isError && styles.error}`}>
    <p>{message}</p>
  </div>
);

export default Notification;
