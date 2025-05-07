import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Title, Button } from 'react-native-paper';
import theme from '../theme';
import PunchSection from './components/PunchSection';
import FeatherIcon from 'react-native-vector-icons/Feather';
import UpcomingHolidays from './components/UpcomingHolidays';
import LeaveStatus from './components/LeaveCount';
import MyAttendance from './components/MyAttendance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';
import messaging from '@react-native-firebase/messaging';
import { CommonActions } from '@react-navigation/native';
import UpcomingDuties from './components/UpcomingDuties';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [user, setUser] = useState() as any;
  const [stats, setStats] = useState({}) as any;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUserInfo = async () => {
    const userInfo = await AsyncStorage.getItem('@userInfo');

    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  };

  const fetchStats = async () => {
    const userToken = await AsyncStorage.getItem('@userToken');
    const response = await axios.get(`${config.apiEndpoint}stats`, {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });
    const { success } = response.data;
    if (success) {
      setStats(response.data);
    }
  }

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);

    await fetchUserInfo();
    await fetchStats();

    setIsRefreshing(false);
  }, []);

  const handleLogout = async () => {
    await messaging().deleteToken();
    await AsyncStorage.removeItem('@userToken');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  }

  useEffect(() => {
    fetchUserInfo();
    fetchStats();
  }, [])

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
      {user && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Title>Welcome {user?.first_name}!</Title>

          <Button
            mode="contained"
            icon={() => <FeatherIcon name="log-out" size={20} color={theme.colors.white} />}
            style={[{ backgroundColor: theme.colors.primary }]}
            onPress={handleLogout}>
            Logout
          </Button>
        </View>
      )}

      <PunchSection duty={stats.today_duty} />

      <UpcomingDuties duty={stats.upcoming_duties} />

      {(stats?.upcoming_holidays || []).length > 0 &&
      <UpcomingHolidays upcomingHolidays={stats?.upcoming_holidays || []} /> }

      <LeaveStatus leaves={stats.leaves} />

      <MyAttendance attendances={stats.attendances} />

      <Button
        mode="outlined"
        icon='calendar-edit'
        onPress={() => navigation.navigate('ApplyLeave')}
        style={[styles.linkButton, { marginTop: 24, marginBottom: 28 }]}
        labelStyle={{ color: theme.colors.primary }}
      >
        Apply Leave
      </Button>

      {/* <View style={styles.linksContainer}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('FAQ')}
          style={styles.linkButton}
          labelStyle={{ color: theme.colors.primary }}
        >
          Apply Leave
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate('FAQ')}
          style={styles.linkButton}
          labelStyle={{ color: theme.colors.primary }}
        >
          FAQ
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate('HelpAndComplaints')}
          style={styles.linkButton}
          labelStyle={{ color: theme.colors.primary }}
        >
          Help & Complaints
        </Button>
        <Button
          mode="text"
          onPress={() => navigation.navigate('EmergencyContact')}
          style={styles.linkButton}
          labelStyle={{ color: theme.colors.primary }}
        >
          Emergency Contact
        </Button>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  locationIcon: {
    paddingRight: 6,
    fontWeight: '900'
  },
  locationText: {
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  linksContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  linkButton: {
    marginVertical: 5,
    borderColor: theme.colors.primary
  },
});

export default HomeScreen;
