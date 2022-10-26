import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
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
import AssetCard from '../components/AssetCard';

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
          <AssetCard assetId={item.key} handlePress={() => onPress(item.key)} />
        )}
      />
    </View>
  );
};

export default AssetListScreen;
