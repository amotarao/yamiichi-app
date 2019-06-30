import { useState } from 'react';

export const useBool = (initialValue: boolean): [boolean, () => void, () => void] => {
  const [value, setValue] = useState(initialValue);
  return [value, () => setValue(true), () => setValue(false)];
};
