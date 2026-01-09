import { useState } from 'react';

export const useFormInput = (type, initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const resetValue = () => {
    setValue('');
  };

  return {
    type,
    value,
    onChange,
    resetValue,
  };
};
