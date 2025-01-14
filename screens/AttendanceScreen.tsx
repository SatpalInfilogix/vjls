import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import theme from '../theme';

interface AttendanceItem {
  id: string;
  date: string;
  hours: string;
  status: string;
}

const attendanceData: AttendanceItem[] = [
  { id: '1', date: '01 Dec 2024', hours: '1:30 hrs', status: 'Present' },
  { id: '2', date: '02 Dec 2024', hours: '-', status: 'Absent' },
  { id: '3', date: '03 Dec 2024', hours: '1:30 hrs', status: 'Present' },
  { id: '4', date: '04 Dec 2024', hours: '1:30 hrs', status: 'Present' },
  { id: '5', date: '05 Dec 2024', hours: '-', status: 'Absent' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Present':
      return 'green';
    case 'Absent':
      return 'red';
    default:
      return 'gray';
  }
};

const AttendanceScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Previous' | 'Current' | 'Custom'>('Current');

  const renderTableHeader = () => (
    <View style={styles.tableHeadRow}>
      <Text style={styles.tableHeader}>Date</Text>
      <Text style={styles.tableHeader}>Hours</Text>
      <Text style={styles.tableHeader}>Status</Text>
    </View>
  );

  const renderTableRows = (data: AttendanceItem[]) => {
    return data.map((item, index) => (
      <View key={item.id} style={[styles.tableRow,
        index === data.length - 1 && styles.noBorderBottom,
      ]}>
        <Text style={[styles.tableCell]}>{item.date}</Text>
        <Text style={[styles.tableCell]}>{item.hours}</Text>
        <Text style={[styles.tableCell, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      </View>
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Previous':
        return (
          <ScrollView style={styles.tableContainer}>
            {renderTableHeader()}
            {renderTableRows(attendanceData)}
          </ScrollView>
        );
      case 'Custom':
        return (
          <ScrollView style={styles.tableContainer}>
            {renderTableHeader()}
            {renderTableRows(attendanceData)}
          </ScrollView>
        );
      case 'Current':
      default:
        return (
          <ScrollView style={styles.tableContainer}>
            {renderTableHeader()}
            {renderTableRows(attendanceData)}
          </ScrollView>
        );
    }
  };

  return (
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

        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  tableContainer: {
    marginBottom: 16,
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
    paddingHorizontal: 16,
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
