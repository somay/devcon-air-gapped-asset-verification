import React from 'react';
import {Button, Text, useColorScheme} from 'react-native';

interface Props {
  handleDelegate: () => void;
}

const DelegateButton: React.FC<Props> = ({handleDelegate}) => {
  return <Button title={'Delegate'} onPress={handleDelegate} />;
};

export default DelegateButton;
