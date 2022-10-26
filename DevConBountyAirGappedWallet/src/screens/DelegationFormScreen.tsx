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

import DelegationSubmitButton from '../components/DelegationSubmitButton';
import {RootNavigationStack} from '../RootNavigator';

interface Props
  extends NativeStackScreenProps<RootNavigationStack, 'DelegationFormScreen'> {}

const AssetDetailScreen: React.FC<Props> = ({navigation, route}) => {
  // const {assetId} = route.params;
  const handleSubmit = () => {
    navigation.navigate('DelegationCompletedScreen');
  };
  return (
    <View>
      {/* <Text>key is {assetId.toString()}</Text> */}
      <DelegationSubmitButton onPress={handleSubmit} />
    </View>
  );
};

export default AssetDetailScreen;
