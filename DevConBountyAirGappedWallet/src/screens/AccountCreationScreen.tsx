import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  Button,
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
    'AccountCreationScreen'
  > {}

const AccountCreationScreen: React.FC<Props> = ({navigation, route}) => {
  const onPress = () => {
    navigation.navigate('AssetListScreen');
  };
  return (
    <View>
      <Text>Account Creation</Text>
      <Button onPress={onPress} title={'Create'} />
    </View>
  );
};

export default AccountCreationScreen;
