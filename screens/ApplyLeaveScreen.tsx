import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback, TextInput as RNTextInput } from 'react-native';
import { Card, Text, TextInput, Button } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import theme from '../theme';

const ApplyLeaveScreen = () => {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleApplyLeave = () => {
        if (!leaveType || !startDate || !endDate || !reason) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            Alert.alert('Error', 'End date should be after the start date.');
            return;
        }

        console.log('Leave Applied:', { leaveType, startDate, endDate, reason });

        Alert.alert('Success', 'Your leave application has been submitted.');
    };

    const getEndDateMinimumDate = () => {
        if (startDate) {
            return new Date(startDate);
        }
        return new Date();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Apply for Leave</Text>

            <Card style={styles.card}>
                <TextInput
                    label="Leave Type"
                    value={leaveType}
                    onChangeText={setLeaveType}
                    style={styles.input}
                    placeholder="Enter leave type"
                />

                <TouchableWithoutFeedback onPress={() => setIsStartDatePickerOpen(true)}>
                    <View>
                        <TextInput
                            label="Start Date"
                            value={startDate}
                            style={styles.input}
                            placeholder="Pick start date"
                            editable={false}
                        />
                    </View>
                </TouchableWithoutFeedback>

                {isStartDatePickerOpen && (
                    <DatePicker
                        modal
                        open={isStartDatePickerOpen}
                        date={date}
                        mode="date"
                        minimumDate={new Date()}
                        onConfirm={(date) => {
                            setIsStartDatePickerOpen(false);
                            setDate(date);
                            setStartDate(formatDate(date));
                        }}
                        onCancel={() => setIsStartDatePickerOpen(false)}
                    />
                )}

                <TouchableWithoutFeedback onPress={() => setIsEndDatePickerOpen(true)}>
                    <View>
                        <TextInput
                            label="End Date"
                            value={endDate}
                            style={styles.input}
                            placeholder="Pick end date"
                            editable={false}
                        />
                    </View>
                </TouchableWithoutFeedback>

                {isEndDatePickerOpen && (
                    <DatePicker
                        modal
                        open={isEndDatePickerOpen}
                        date={date}
                        mode="date"
                        minimumDate={getEndDateMinimumDate()}
                        onConfirm={(date) => {
                            setIsEndDatePickerOpen(false);
                            setDate(date);
                            setEndDate(formatDate(date));
                        }}
                        onCancel={() => setIsEndDatePickerOpen(false)}
                    />
                )}

                <TextInput
                    label="Reason"
                    value={reason}
                    onChangeText={setReason}
                    style={styles.input}
                    placeholder="Enter reason for leave"
                />

                <Button mode="contained" style={styles.button} onPress={handleApplyLeave}>
                    Submit Leave Application
                </Button>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    card: {
        marginBottom: 20,
        padding: 16,
    },
    input: {
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: theme.colors.secondary,
    }
});

export default ApplyLeaveScreen;