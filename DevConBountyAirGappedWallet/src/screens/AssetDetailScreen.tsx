import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {isValidElement} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ViewStyle,
} from 'react-native';
import AssetMetaInfo from '../components/AssetMetaInfo';

import DelegateButton from '../components/DelegateButton';
import Spacer from '../components/Spacer';
import {RootNavigationStack} from '../RootNavigator';

interface Props
  extends NativeStackScreenProps<RootNavigationStack, 'AssetDetailScreen'> {}

const AssetDetailScreen: React.FC<Props> = ({navigation, route}) => {
  const {assetId} = route.params;
  const isDelegated = false;
  const handleDelegate = () => {
    navigation.navigate('DelegationFormScreen');
  };
  return (
    <View style={styles.container}>
      <Text>asset id is {assetId.toString()}</Text>
      <Spacer />
      <AssetMetaInfo />
      <Spacer />
      <DelegateButton
        isDelegated={isDelegated}
        handleDelegate={handleDelegate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 10,
    flexDirection: 'column',
  },
}) as {
  container: ViewStyle;
};

export default AssetDetailScreen;
