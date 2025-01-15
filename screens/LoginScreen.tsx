import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, PermissionsAndroid } from 'react-native';
import { TextInput, Button, Text, Provider as PaperProvider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import theme from '../theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorMessage from './components/ErrorMessage';
import axios from 'axios';
import config from '../config';
import { Image } from 'react-native';
import messaging from '@react-native-firebase/messaging';

type Props = {
  navigation: StackNavigationProp<any>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [deviceToken, setDeviceToken] = useState<string>('');
  const [phoneNumber, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ phoneNumber?: string; password?: string }>({});

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const validate = () => {
    const newErrors: { phoneNumber?: string; password?: string } = {};
    if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getDeviceToken = async() => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const fcmToken = await messaging().getToken();
      setDeviceToken(fcmToken);
    }
  }

  useEffect(()=>{
    getDeviceToken();
  }, [])

  const handleLogin = async () => {
    if (validate()) {
      try {
        setErrorMessage('');
        setIsSubmitting(true);
        

        const response = await axios.post(`${config.apiEndpoint}login`,
          new URLSearchParams({
            phone_number: phoneNumber,
            password: password,
            device_token: deviceToken
          }).toString(), {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        });

        let { data } = response.data;
        await AsyncStorage.setItem('@userToken', data.token);
        await AsyncStorage.setItem('@userInfo', JSON.stringify(data));
        await AsyncStorage.removeItem('@punchInfo');
        navigation.navigate('HomeTabs');
      } catch (error: any) {
        setIsSubmitting(false);

        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(error.response.data.message || 'Something went wrong');
        } else {
          Alert.alert('Error', 'There was an error connecting to the server');
        }
      }
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.jpeg')}  // Adjust the path to your logo image
        style={styles.logo}
      />

        <Text style={styles.title}>Login</Text>

        <ErrorMessage
          visible={errorMessage ? true : false}
          message={errorMessage}
        />

        <View style={styles.input}>
          <TextInput
            label="Phone number"
            value={phoneNumber}
            onChangeText={setUsername}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                primary: theme.colors.primary
              },
            }}
            keyboardType="numeric"
            error={!!errors.phoneNumber}
          />
          {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
        </View>

        <View style={styles.input}>
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            mode="outlined"
            theme={{
              colors: {
                primary: theme.colors.primary
              },
            }}
            right={
              <TextInput.Icon
                icon={() => (
                  <Icon
                    name={showPassword ? 'visibility-off' : 'visibility'}
                    size={24}
                    onPress={handleTogglePasswordVisibility}
                  />
                )}
                onPress={handleTogglePasswordVisibility}
              />
            }
            error={!!errors.password}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <Button 
          mode="contained" 
          onPress={handleLogin} 
          disabled={isSubmitting} 
          style={[styles.button, { backgroundColor: theme.colors.secondary }]}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  logo: {
    width: '100%',    
    height: 150,   
    marginBottom: 20,
    textAlign: 'center'  
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.text,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: 20,
    textAlign: 'left',
  },
});

export default LoginScreen;
