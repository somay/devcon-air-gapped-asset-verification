import {setItem, getItem} from './storage';

export const verifyAndSaveVP = async (vp: string) => {
  await setItem('com.dummy', vp);
};

export const getCredential = async () => {
  return getItem('com.dummy');
};
