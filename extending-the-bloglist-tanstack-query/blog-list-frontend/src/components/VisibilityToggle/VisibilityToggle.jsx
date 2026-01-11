import { useState, useImperativeHandle } from 'react';
import styles from './VisibilityToggle.module.css';
import Button from '@mui/material/Button';

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
        <Button variant="contained" onClick={toggleChildrenVisibility}>
          {buttonLabel}
        </Button>
      </div>

      <div className={childrenVisibility ? styles.visible : styles.hide}>
        {children}
        <Button variant="outlined" onClick={toggleChildrenVisibility}>
          Cancel
        </Button>
      </div>
    </>
  );
};

export default VisibilityToggle;
