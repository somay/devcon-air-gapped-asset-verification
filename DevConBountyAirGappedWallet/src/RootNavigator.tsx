import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View, ViewProps, Text} from 'react-native';
import AssetListScreen from './screens/AssetListScreen';
import AssetDetailScreen from './screens/AssetDetailScreen';
import DelegationCompletedScreen from './screens/DelegationCompletedScreen';
import DelegationFormScreen from './screens/DelegationFormScreen';
import AccountCreationScreen from './screens/AccountCreationScreen';
import AccountDetailScreen from './screens/AccountDetailScreen';
import RequestHandler from '../RequestHandler';

export type RootNavigationStack = {
  AccountCreationScreen: undefined;
  AccountDetailScreen: undefined;
  AssetListScreen: undefined;
  AssetDetailScreen: {assetId: number};
  DelegationCompletedScreen: undefined;
  DelegationFormScreen: undefined;
  RequestHandler: Record<string, any>;
};

interface RootNavigatorProps extends ViewProps {
  query?: string;
}

const Stack = createNativeStackNavigator<RootNavigationStack>();

const config = {
  screens: {
    RequestHandler: {
      path: '',
    },
    // AccountCreationScreen: '/',
  },
};

const linking = {
  prefixes: ['web+devcon://'],
  config,
};

export const RootNavigator: React.FC<RootNavigatorProps> = props => {
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <View style={{flex: 1}}>
        <Stack.Navigator>
          <Stack.Screen
            name="AccountCreationScreen"
            component={AccountCreationScreen}
            // initialParams={props}
          />
          <Stack.Screen
            name="AccountDetailScreen"
            component={AccountDetailScreen}
            // initialParams={props}
          />
          <Stack.Screen
            name="AssetListScreen"
            component={AssetListScreen}
            // initialParams={props}
          />
          <Stack.Screen
            name="AssetDetailScreen"
            component={AssetDetailScreen}
            // initialParams={props}
          />
          <Stack.Screen
            name="DelegationCompletedScreen"
            component={DelegationCompletedScreen}
            // initialParams={props}
          />
          <Stack.Screen
            name="DelegationFormScreen"
            component={DelegationFormScreen}
            // initialParams={props}
          />
          <Stack.Screen
            name="RequestHandler"
            component={RequestHandler}
            // initialParams={props}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};
