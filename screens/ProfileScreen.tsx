import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Text, Button } from 'react-native-paper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import theme from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import config from '../config';
import messaging from '@react-native-firebase/messaging';
import { CommonActions } from '@react-navigation/native';

type Props = {
  navigation: StackNavigationProp<any>;
};

const formatIndianPhoneNumber = (phoneNumber: string): string | null => {
  if(!phoneNumber) { return `N/A` }
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    return `+91 ${cleanNumber.slice(0, 5)} ${cleanNumber.slice(5)}`;
  }
  return phoneNumber;
};

const userDefaultImage = `${config.serverBasePath}assets/images/user.jpg`;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({}) as any;

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userToken = await AsyncStorage.getItem('@userToken');
        const response = await axios.get(`${config.apiEndpoint}guard/profile`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        const { data } = response.data;
        setUserProfile(data);
        setIsLoading(false);
      } catch (error) {
        await AsyncStorage.removeItem('@userToken');
        setUserProfile(null);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }
    };

    getUserProfile();
  }, []);

  const logOut = async () => {
    await messaging().deleteToken();
    await AsyncStorage.removeItem('@userToken');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if(!userProfile){
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addressContainer}>
        <View style={styles.avatarContainer}>
          <Avatar.Image size={150} style={styles.avatar} source={{ uri: userProfile?.profile_picture || userDefaultImage }} />
          {/* <TouchableOpacity style={styles.editIconContainer} onPress={() => Alert.alert('Feature will launched soon!')}>
            <FeatherIcon name="edit" size={24} color={theme.colors.primary} />
          </TouchableOpacity> */}

          <Text variant="headlineSmall" style={styles.name}>{userProfile?.first_name} {userProfile?.middle_name}</Text>
          {/* <Text style={styles.bio}>{userProfile.bio}</Text> */}

          {/* <View style={[styles.alignCenter, styles.spacingSmallTop]}>
            <FeatherIcon name="map-pin" size={18} color={theme.colors.primary} />
            <Text style={styles.iconText}>{userProfile.location}</Text>
          </View> */}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.contactContainer, styles.spacingMediumTop]}>
        <FeatherIcon name="phone" size={24} color={theme.colors.success} />
        <Text variant="titleMedium" style={styles.iconText}>{formatIndianPhoneNumber(userProfile?.phone_number)}</Text>
      </TouchableOpacity>

      {userProfile?.email ?
        <TouchableOpacity style={styles.contactContainer}>
          <FeatherIcon name="mail" size={24} color={theme.colors.warning} />
          <Text variant="titleMedium" style={styles.iconText}>{userProfile.email}</Text>
        </TouchableOpacity>
        : null}

      <View style={[styles.spaceHorizontal, styles.spacingMediumTop]}>
        <Button
          mode="outlined"
          icon={() => <FeatherIcon name="lock" size={20} color={theme.colors.primary} />}
          style={[{ borderColor: theme.colors.primary, marginBottom: 18 }]}
          labelStyle={{ color: theme.colors.primary }}
          onPress={() => navigation.navigate('ChangePassword')}>
          Change Password
        </Button>

        <Button
          mode="contained"
          icon={() => <FeatherIcon name="log-out" size={20} color={theme.colors.white} />}
          style={[{ backgroundColor: theme.colors.primary }]}
          onPress={logOut}>
          Log Out
        </Button>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: 25,
    //marginHorizontal: 15
  },
  spaceHorizontal: {
    marginHorizontal: 15
  },
  avatarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'transparent'
  },
  iconText: {
    marginLeft: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    //margin: 10,
    width: '100%',
    padding: 10,
    backgroundColor: theme.colors.white,
    borderRadius: 5,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    padding: 5,
    elevation: 2,
  },
  alignCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  spacingSmallTop: {
    marginTop: 8
  },
  spacingMediumTop: {
    marginTop: 16
  },
  contactContainer: {
    flexDirection: 'row',
    //marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  bio: {
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
