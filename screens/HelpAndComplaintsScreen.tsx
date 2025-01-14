import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelpAndComplaintsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Help & Complaints Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HelpAndComplaintsScreen;
