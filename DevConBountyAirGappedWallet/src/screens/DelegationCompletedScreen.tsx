import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {RootNavigationStack} from '../RootNavigator';

interface Props
  extends NativeStackScreenProps<
    RootNavigationStack,
    'DelegationCompletedScreen'
  > {}

const DelegationCompletedScreen: React.FC<Props> = () => {
  return (
    <View>
      <Text>Delegation Completed!</Text>
    </View>
  );
};

export default DelegationCompletedScreen;
