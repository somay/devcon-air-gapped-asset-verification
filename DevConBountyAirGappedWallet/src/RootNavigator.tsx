import {NavigationContainer, useLinkProps} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View, ViewProps} from 'react-native';
import AssetListScreen from './screens/AssetListScreen';
import AssetDetailScreen from './screens/AssetDetailScreen';
import DelegationCompletedScreen from './screens/DelegationCompletedScreen';
import DelegationFormScreen from './screens/DelegationFormScreen';

export type RootNavigationStack = {
  AssetListScreen: undefined;
  AssetDetailScreen: {assetId: number};
  DelegationCompletedScreen: undefined;
  DelegationFormScreen: undefined;
};

interface RootNavigatorProps extends ViewProps {
  query?: string;
}

const Stack = createNativeStackNavigator<RootNavigationStack>();

export const RootNavigator: React.FC<RootNavigatorProps> = props => {
  return (
    <NavigationContainer independent>
      <View style={{flex: 1}}>
        <Stack.Navigator>
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
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};
