import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import theme from '../../theme';

interface ErrorMessageProps {
  visible: boolean;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ visible, message }) => {
  return (
    visible ? 
    <View style={styles.errorMessageContainer}>
        <Text style={styles.errorMessage}>{message}</Text>
    </View>
    : null
  );
};

const styles = StyleSheet.create({
  errorMessageContainer: {
    backgroundColor: theme.colors.error,
    padding: 8,
    marginBottom: 12
  },
  errorMessage: {
    color: theme.colors.white
  }
});

export default ErrorMessage;
