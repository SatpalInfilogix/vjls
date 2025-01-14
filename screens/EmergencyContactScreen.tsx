import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmergencyContactScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Emergency Contact Screen</Text>
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

export default EmergencyContactScreen;
