import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import AssetCard from '../components/AssetCard';
import Spacer from '../components/Spacer';

import {RootNavigationStack} from '../RootNavigator';

interface Props
  extends NativeStackScreenProps<RootNavigationStack, 'AssetListScreen'> {}

const AssetListScreen: React.FC<Props> = ({navigation, route}) => {
  const onPress = (key: number) => {
    navigation.navigate('AssetDetailScreen', {assetId: key});
  };

  const isDelegated = (assetId: number) => {
    return assetId - 3 < 0;
  };

  return (
    <View>
      <FlatList
        data={[{key: 1}, {key: 2}, {key: 3}, {key: 4}, {key: 5}]}
        renderItem={({item}) => (
          <AssetCard
            styles={showStyles}
            assetId={item.key}
            isDelegated={isDelegated(item.key)}
            handlePress={() => onPress(item.key)}
          />
        )}
        ItemSeparatorComponent={Spacer}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
        ListEmptyComponent={<Text>nothing</Text>}
        // ListHeaderComponent={<Text>Asset List</Text>}
        // ListFooterComponent={isLoading ? <Spinner /> : null}
      />
    </View>
  );
};

const showStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
  },
  textContainer: {
    flexDirection: 'column',
    width: '70%',
    paddingVertical: 20,
    marginRight: 10,
    backgroundColor: '#DDDDDD',
  },
  image: {
    width: 82,
    height: 82,
    marginRight: 15,
    backgroundColor: '#DDDDDD',
  },
  title: {
    width: '100%',
    fontWeight: 'bold',
  },
  status: {
    width: '100%',
  },
}) as {
  container: ViewStyle;
  image: ViewStyle;
};

export default AssetListScreen;
