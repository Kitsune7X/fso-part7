import styles from './Notification.module.css';

const Notification = ({ message, isError = false }) => (
  <div className={`${styles.notification} ${isError ? styles.error : ''}`}>
    <p>{message}</p>
  </div>
);

export default Notification;

// TODO: write unit test for `Notification` Component so that after
// refactoring, it still works
