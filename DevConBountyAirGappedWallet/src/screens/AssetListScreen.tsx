import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {type PropsWithChildren} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Touchable,
  useColorScheme,
  View,
} from 'react-native';

import {RootNavigationStack} from '../RootNavigator';

interface Props
  extends NativeStackScreenProps<RootNavigationStack, 'AssetListScreen'> {}

const AssetListScreen: React.FC<Props> = ({navigation, route}) => {
  const onPress = (key: number) => {
    navigation.navigate('AssetDetailScreen', {assetId: key});
  };
  return (
    <View>
      <FlatList
        data={[{key: 1}, {key: 2}, {key: 3}, {key: 4}, {key: 5}]}
        renderItem={({item}) => (
          <Text onPress={() => onPress(item.key)}>
            Go to asset {item.key} detail
          </Text>
        )}
      />
    </View>
  );
};

export default AssetListScreen;
