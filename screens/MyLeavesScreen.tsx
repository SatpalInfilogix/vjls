import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import config from '../config';

interface Leave {
  id: number;
  guard_id: number;
  date: string;
  reason: string;
  description: string | null;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

const LeaveTable: React.FC = () => {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const userToken = await AsyncStorage.getItem('@userToken');

      const response = await axios.get(`${config.apiEndpoint}get-leave`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${userToken}`,
        }
      });

      const { success } = response.data;

      if (success) {
        setLeaves(response.data.data)
      }
    } catch (error: any) {
      // Handle errors that might occur during the request
      console.error('Error fetching leaves:', error.message);
    }
  }

  useEffect(() => {
    fetchLeaves();
  }, [])


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Leave Date</Text>
        <Text style={styles.headerText}>Reason</Text>
        <Text style={styles.headerText}>Status</Text>
      </View>
      <FlatList
        data={leaves}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item.date}</Text>
            <Text style={styles.text}>{item.reason}</Text>
            <Text style={styles.text}>{item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4'
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#009688',
    marginBottom: 5
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  text: {
    flex: 1,
    textAlign: 'center'
  }
});

export default LeaveTable;
