// NoInternetScreen.tsx

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNetwork } from '../context/NetworkContext';

const NoInternetScreen: React.FC = () => {
  const { isConnected } = useNetwork();

  return (
    <View style={styles.container}>
      {!isConnected ? (
        <>
          <Text style={styles.text}>No Internet Connection</Text>
          <Button title="Retry" onPress={() => {}} />
        </>
      ) : (
        <Text style={styles.text}>Connected to the internet!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default NoInternetScreen;
