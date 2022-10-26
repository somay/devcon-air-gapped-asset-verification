import React from 'react';
import {Text, TouchableHighlight, View, ViewStyle} from 'react-native';

interface Props {
  assetId: number;
  isDelegated: boolean;
  handlePress: () => void;
  styles: {
    container?: ViewStyle;
    textContainer?: ViewStyle;
    image?: ViewStyle;
    title?: ViewStyle;
    status?: ViewStyle;
  };
}

const AssetCard: React.FC<Props> = ({
  styles,
  assetId,
  isDelegated,
  handlePress,
}) => {
  // const onPress = (key: number) => {
  //   navigation.navigate('AssetDetailScreen', {assetId: key});
  // };
  return (
    <TouchableHighlight onPress={handlePress}>
      <View style={styles?.container}>
        <Text style={styles.image}>Go to asset {assetId} detail</Text>
        <View style={styles?.textContainer}>
          <Text style={styles.title}>NFT {assetId}</Text>
          {isDelegated ? <Text style={styles.status}>delegated</Text> : null}
        </View>

        {/* <View style={{flex: 1}}>
          <Metadata show={show} style={styles && styles.metadata} />
        </View> */}
      </View>
    </TouchableHighlight>
  );
};

export default AssetCard;
