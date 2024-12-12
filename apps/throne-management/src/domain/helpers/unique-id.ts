import { customAlphabet } from 'nanoid';
import { alphanumeric } from 'nanoid-dictionary';
export const generateUniqueId = (prefix: string): string => {
  const customNanoId = customAlphabet(alphanumeric, 32);

  const uniqueId = customNanoId();

  return uniqueId;
};
