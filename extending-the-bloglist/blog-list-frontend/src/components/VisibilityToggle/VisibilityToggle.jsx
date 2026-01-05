import { useState, useImperativeHandle } from 'react';
import styles from './VisibilityToggle.module.css';

const VisibilityToggle = ({ children, buttonLabel, ref }) => {
  const [childrenVisibility, setChildrenVisibility] = useState(false);

  const toggleChildrenVisibility = () =>
    setChildrenVisibility(!childrenVisibility);

  useImperativeHandle(ref, () => {
    return { toggleChildrenVisibility };
  });

  return (
    <>
      <div className={childrenVisibility ? styles.hide : styles.visible}>
        <button onClick={toggleChildrenVisibility}>{buttonLabel}</button>
      </div>

      <div className={childrenVisibility ? styles.visible : styles.hide}>
        {children}
        <button onClick={toggleChildrenVisibility}>Cancel</button>
      </div>
    </>
  );
};

export default VisibilityToggle;
