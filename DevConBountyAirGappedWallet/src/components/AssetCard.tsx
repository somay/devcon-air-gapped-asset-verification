import React from 'react';
import {StyleSheet, Text, Touchable, useColorScheme, View} from 'react-native';

interface Props {
  assetId: number;
  handlePress: () => void;
}

const AssetCard: React.FC<Props> = ({assetId, handlePress}) => {
  // const onPress = (key: number) => {
  //   navigation.navigate('AssetDetailScreen', {assetId: key});
  // };
  return <Text onPress={handlePress}>Go to asset {assetId} detail</Text>;
};

export default AssetCard;
