import React from 'react';
import {Button, Text, useColorScheme} from 'react-native';

interface Props {
  onPress: () => void;
}

const DelegationSubmitButton: React.FC<Props> = ({onPress}) => {
  return <Button title={'Delegate'} onPress={onPress} />;
};

export default DelegationSubmitButton;
