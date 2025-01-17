import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback } from 'react-native';
import { Card, Text, TextInput, Button } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import theme from '../theme';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const ApplyLeaveScreen = () => {
    const navigation = useNavigation<StackNavigationProp<any>>();
    const [date, setDate] = useState(new Date());
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
    const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);

    const [errors, setErrors] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
    });

    const leaveOptions = [
        { title: 'Sick Leave', icon: 'emoticon-sick-outline' },
        { title: 'Marriage Leave', icon: 'emoticon-happy-outline' },
        { title: 'Vacation Leave', icon: 'emoticon-cool-outline' },
        { title: 'Personal Leave', icon: 'emoticon-confused-outline' },
        { title: 'Other Leave', icon: 'emoticon-dead-outline' },
    ];

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleApplyLeave = async () => {
        let valid = true;
        let newErrors = {
            leaveType: '',
            startDate: '',
            endDate: '',
            reason: '',
        };

        if (!leaveType) {
            newErrors.leaveType = 'Leave type is required';
            valid = false;
        }

        if (!startDate) {
            newErrors.startDate = 'Start date is required';
            valid = false;
        }

        if (endDate && new Date(startDate) > new Date(endDate)) {
            newErrors.endDate = 'End date should be after the start date';
            valid = false;
        }

        if (leaveType === 'Other Leave' && !reason) {
            newErrors.reason = 'Please provide a reason for other leave';
            valid = false;
        }

        setErrors(newErrors);

        if (!valid) return;

        try {
            setIsSubmittingApplication(true);
            const userToken = await AsyncStorage.getItem('@userToken');
      
            const response = await axios.post(`${config.apiEndpoint}leave`,
              new URLSearchParams({
                reason: leaveType,
                start_date: startDate,
                end_date: endDate,
                description: reason,
              }).toString(), {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${userToken}`,
              }
            });
            
            const { success } = response.data;
            setIsSubmittingApplication(false);

            if(success){
                setLeaveType('');
                setStartDate('');
                setEndDate('');
                setReason('');
                
                navigation.navigate('AppliedLeaves')
            } else {
                Alert.alert(response.data.message);
            }
          } catch (error: any) {
            // Handle errors that might occur during the request
            console.error('Error fetching attendance:', error.message);
          }
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
                <View style={styles.inputContainer}>
                <SelectDropdown
                    data={leaveOptions}
                    onSelect={(selectedItem) => {
                        setLeaveType(selectedItem.title);
                        setErrors((prevErrors) => ({ ...prevErrors, leaveType: '' })); // Clear any previous error
                    }}
                    renderButton={(selectedItem, isOpened) => {
                        return (
                            <View style={[styles.dropdownButtonStyle, errors.leaveType && styles.dropdownError]}>
                                {selectedItem && (
                                    <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                                )}
                                <Text style={styles.dropdownButtonTxtStyle}>
                                    {(selectedItem && selectedItem.title) || 'Select Leave Type'}
                                </Text>
                                <Icon
                                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                                    style={styles.dropdownButtonArrowStyle}
                                />
                            </View>
                        );
                    }}
                    renderItem={(item, index, isSelected) => {
                        return (
                            <View
                                style={{
                                    ...styles.dropdownItemStyle,
                                    ...(isSelected && { backgroundColor: '#D2D9DF' }),
                                }}
                            >
                                <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                            </View>
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropdownMenuStyle}
                />
                {errors.leaveType && <Text style={styles.errorText}>{errors.leaveType}</Text>}
                </View>
                    
                {leaveType === 'Other Leave' && (
                    <TextInput
                        label="Reason"
                        value={reason}
                        onChangeText={setReason}
                        style={styles.input}
                        placeholder="Enter reason for leave"
                        error={!!errors.reason}
                    />
                )}
                {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}

                <TouchableWithoutFeedback onPress={() => setIsStartDatePickerOpen(true)}>
                    <View>
                        <TextInput
                            label="Start Date"
                            value={startDate}
                            style={[styles.input, styles.inputContainer]}
                            placeholder="Pick start date"
                            editable={false}
                            error={!!errors.startDate}
                        />
                    </View>
                </TouchableWithoutFeedback>
                {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}

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
                            setErrors((prevErrors) => ({ ...prevErrors, startDate: '' })); // Clear any previous error
                        }}
                        onCancel={() => setIsStartDatePickerOpen(false)}
                    />
                )}

                {startDate && (
                    <TouchableWithoutFeedback onPress={() => setIsEndDatePickerOpen(true)}>
                        <View>
                            <TextInput
                                label="End Date"
                                value={endDate}
                                style={[styles.input, styles.inputContainer]}
                                placeholder="Pick end date"
                                editable={false}
                                error={!!errors.endDate}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                )}
                {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}

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
                            setErrors((prevErrors) => ({ ...prevErrors, endDate: '' })); // Clear any previous error
                        }}
                        onCancel={() => setIsEndDatePickerOpen(false)}
                    />
                )}

                <Button mode="contained" style={styles.button} disabled={isSubmittingApplication} onPress={handleApplyLeave}>
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
    inputContainer: {
        marginBottom: 12
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    dropdownError: {
        borderColor: theme.colors.error,
        borderWidth: 1,
    },
    button: {
        backgroundColor: theme.colors.secondary,
    },
    dropdownButtonStyle: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    dropdownButtonIconStyle: {
        fontSize: 22,
        color: '#555',
    },
    dropdownButtonTxtStyle: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        textAlign: 'left',
        marginLeft: 10,
    },
    dropdownButtonArrowStyle: {
        fontSize: 20,
        color: '#333',
    },
    dropdownItemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    dropdownItemIconStyle: {
        fontSize: 22,
        color: '#555',
        marginRight: 10,
    },
    dropdownItemTxtStyle: {
        fontSize: 16,
        color: '#333',
    },
    dropdownMenuStyle: {
        borderRadius: 8,
        backgroundColor: 'white',
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 12,
        marginBottom: 8,
    },
});

export default ApplyLeaveScreen;
