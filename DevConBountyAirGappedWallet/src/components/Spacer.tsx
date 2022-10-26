import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

const Spacer = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    height: 20,
  },
}) as {
  container: ViewStyle;
};

export default Spacer;
