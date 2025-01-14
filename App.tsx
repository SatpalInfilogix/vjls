import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import EarnedPayrollScreen from './screens/EarnedPayrollScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import theme from './theme';
import FAQScreen from './screens/FAQScreen';
import ApplyLeaveScreen from './screens/ApplyLeaveScreen';
import HelpAndComplaintsScreen from './screens/HelpAndComplaintsScreen';
import EmergencyContactScreen from './screens/EmergencyContactScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { useNetwork } from './context/NetworkContext';
import NoInternetScreen from './screens/NoInternetScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarStyle: {
        backgroundColor: theme.colors.primary,
        paddingTop: 10,
        paddingBottom: 10,
        height: 50,
      },
      tabBarActiveTintColor: theme.colors.activeTabColor,
      tabBarInactiveTintColor: theme.colors.accent,
      headerShown: false
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: () => null,
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={color === theme.colors.activeTabColor ? 'home' : 'home-outline'}
            color={color}
            size={size}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Attendance"
      component={AttendanceScreen}
      options={{
        tabBarLabel: () => null,
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={color === theme.colors.activeTabColor ? 'calendar-sharp' : 'calendar-outline'}
            color={color}
            size={size}
          />
        ),
      }}
    />
    {/* <Tab.Screen
      name="EarnedPayroll"
      component={EarnedPayrollScreen}
      options={{
        tabBarLabel: () => null,
        tabBarIcon: ({ color, size }) => {
          const IconComponent = color === theme.colors.activeTabColor ? FontAwesome6 : MaterialIcons;
          const iconName = color === theme.colors.activeTabColor ? 'money-bills' : 'money';

          return (
            <IconComponent
              name={iconName}
              color={color}
              size={size}
            />
          );
        },
      }}
    /> */}
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: () => null,
        tabBarIcon: ({ color, size }) => (
          <FontAwesome
            name={color === theme.colors.activeTabColor ? 'user' : 'user-o'}
            color={color}
            size={size}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const { isConnected } = useNetwork();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userToken = await AsyncStorage.getItem('@userToken');
        setIsUserLoggedIn(userToken !== null);
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!isConnected) {
    return (
      <NoInternetScreen />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isUserLoggedIn ? "HomeTabs" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{
          title: 'Change Password',
          headerStyle: {
            backgroundColor: theme.colors.secondary,
          },
          headerTintColor: theme.colors.white,
        }}/>
        <Stack.Screen name="FAQ" component={FAQScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ApplyLeave" component={ApplyLeaveScreen} options={{
          title: 'Apply for Leave',
          headerStyle: {
            backgroundColor: theme.colors.secondary,
          },
          headerTintColor: theme.colors.white,
        }} />
        <Stack.Screen name="HelpAndComplaints" component={HelpAndComplaintsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmergencyContact" component={EmergencyContactScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
