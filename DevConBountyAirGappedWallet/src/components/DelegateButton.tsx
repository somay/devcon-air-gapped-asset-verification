import React from 'react';
import {Button, View} from 'react-native';

interface Props {
  handleDelegate: () => void;
  isDelegated: boolean;
}

const DelegateButton: React.FC<Props> = ({handleDelegate, isDelegated}) => {
  return (
    <View>
      <Button
        disabled={isDelegated}
        title={'Delegate'}
        onPress={handleDelegate}
      />
    </View>
  );
};

export default DelegateButton;
