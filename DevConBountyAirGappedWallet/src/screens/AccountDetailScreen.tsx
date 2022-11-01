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
  extends NativeStackScreenProps<RootNavigationStack, 'AccountDetailScreen'> {}

const AccountDetailScreen: React.FC<Props> = ({navigation, route}) => {
  return (
    <View>
      <Text>Account Detail</Text>
    </View>
  );
};

export default AccountDetailScreen;
