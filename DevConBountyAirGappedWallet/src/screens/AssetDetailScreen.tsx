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

import DelegateButton from '../components/DelegateButton';
import {RootNavigationStack} from '../RootNavigator';

interface Props
  extends NativeStackScreenProps<RootNavigationStack, 'AssetDetailScreen'> {}

const AssetDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {assetId} = route.params;
  const handleDelegate = () => {
    navigation.navigate('DelegationFormScreen');
  };
  return (
    <View>
      <Text>key is {assetId.toString()}</Text>
      <DelegateButton handleDelegate={handleDelegate} />
    </View>
  );
};

export default AssetDetailScreen;
