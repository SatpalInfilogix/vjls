import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { Appbar } from 'react-native-paper';
import theme from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'present':
      return 'green';
    case 'absent':
      return 'red';
    case 'pending':
      return 'orange';
    case 'duty-not-assigned':
      return 'gray';
    default:
      return 'gray';
  }
};

const formatStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pending';
    case 'present':
      return 'Present';
    case 'duty-not-assigned':
      return 'N/A';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

const AttendanceScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Previous' | 'Current' | 'Custom'>('Current');
  const [attendance, setAttendance] = useState();

  const renderTableHeader = () => (
    <View style={styles.tableHeadRow}>
      <Text style={styles.tableHeader}>Date</Text>
      <Text style={styles.tableHeader}>Hours</Text>
      <Text style={styles.tableHeader}>Status</Text>
    </View>
  );

  const renderTableRows = (data: any) => {
    return data.map((item: any, index: number) => (
      <View key={`${item.id}-${index}`} style={[styles.tableRow,
      index === data.length - 1 && styles.noBorderBottom,
      ]}>
        <Text style={[styles.tableCell]}>{item.date}</Text>
        <Text style={[styles.tableCell]}>{item.LoggedHours}</Text>
        <Text style={[styles.tableCell, { color: getStatusColor(item.status) }]}>{formatStatus(item.status)}</Text>
      </View>
    ));
  };

  const renderTabContent = (attendance: any) => {
    switch (activeTab) {
      case 'Previous':
        return (
          <ScrollView style={styles.tableContainer}>
            {renderTableHeader()}
            {renderTableRows(attendance.previousFortnight)}
          </ScrollView>
        );
      case 'Custom':
        return (
          <ScrollView style={styles.tableContainer}>
            {renderTableHeader()}
            {renderTableRows(attendance.currentFortnight)}
          </ScrollView>
        );
      case 'Current':
      default:
        return (
          <ScrollView style={styles.tableContainer}>
            {renderTableHeader()}
            {renderTableRows(attendance.currentFortnight)}
          </ScrollView>
        );
    }
  };

  const fetchAttendance = async () => {
    try {
      const userToken = await AsyncStorage.getItem('@userToken');

      const response = await axios.post(`${config.apiEndpoint}get-attendance`,
        new URLSearchParams({
          start_date: '',
          end_date: '',
        }).toString(), {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${userToken}`,
        }
      });

      const { status } = response.data;

      if (status) {
        setAttendance(response.data)
      }
    } catch (error: any) {
      // Handle errors that might occur during the request
      console.error('Error fetching attendance:', error.message);
    }
  }

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
          <Appbar.Content title="My Attendance" titleStyle={{ color: theme.colors.white }} />
        </Appbar.Header>

        <View style={styles.content}>
          <View style={styles.tabRow}>
            {['Previous', 'Current', 'Custom'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab as 'Previous' | 'Current' | 'Custom')}
                style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* The ScrollView will adjust based on the content */}
          {attendance ? renderTabContent(attendance) : <></>}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    marginBottom: 0,
  },
  tableContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    elevation: 4,  // For shadow on Android
    shadowColor: '#000',  // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: theme.colors.gray,
  },
  tableHeadRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    backgroundColor: theme.colors.primary,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  noBorderBottom: {
    borderBottomWidth: 0
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: 16,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 6,
    color: theme.colors.tableText,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: theme.colors.inactiveTabColor,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: theme.colors.secondary,
  },
  tabText: {
    color: theme.colors.secondary,
    fontSize: 14,
  },
  activeTabText: {
    color: theme.colors.white,
  },
});

export default AttendanceScreen;
