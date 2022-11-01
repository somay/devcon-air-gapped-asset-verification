import SInfo from 'react-native-sensitive-info';

const IOS_KEYCHAIN_SERVICE_NAME = 'devcon-airgapped-asset-verification';

const getOptions = () => {
  const authnOptions = {
    touchID: false,
    showModal: true,
    kSecAccessControl: undefined,
  };
  return {
    sharedPreferencesName: 'mySharedPrefs',
    keychainService: IOS_KEYCHAIN_SERVICE_NAME,
    ...authnOptions,
  };
};

export const setItem = async (key: string, value: string) => {
  console.log('Setting item...');
  const savingFirstData = await SInfo.setItem(key, value, getOptions());
  console.log(savingFirstData); //value1
};

export const getItem = async (key: string) => {
  // console.log('Getting item...');
  const options = {
    ...getOptions(),
    kSecUseOperationPrompt:
      'We need your permission to retrieve encrypted data',
    strings: {
      description: 'Custom Title ',
      header: 'Custom Description',
    },
  };
  // debug(options);
  const gettingFirstData = await SInfo.getItem(key, options);
  // console.log(gettingFirstData); //value1
  return gettingFirstData;
};
