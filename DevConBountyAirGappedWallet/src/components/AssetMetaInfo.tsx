import React from 'react';
import {StyleSheet, View, ViewStyle, Text} from 'react-native';

const AssetMetaInfo = () => {
  return (
    <View style={styles.container}>
      {/* we referred the information displayed in metamask wallets */}
      <Text>description</Text>
      <Text>token standard</Text>
      <Text>source</Text>
      <Text>link</Text>
      <Text>asset contract</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
}) as {
  container: ViewStyle;
};

export default AssetMetaInfo;
