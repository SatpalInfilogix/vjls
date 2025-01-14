import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Card, Title, Paragraph } from 'react-native-paper';
import theme from '../theme';
import axios from 'axios';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChangePasswordScreen = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const navigation = useNavigation();

    const validateCurrentPassword = (value: string) => {
        if (!value) {
            return 'Current password is required';
        }
        return '';
    };

    const validateNewPassword = (value: string) => {
        if (!value) {
            return 'New password is required';
        } else if (value.length < 6) {
            return 'New password must be at least 6 characters long';
        }
        return '';
    };

    const validateConfirmPassword = (value: string) => {
        if (!value) {
            return 'Please confirm your new password';
        } else if (newPassword !== value) {
            return 'New password and confirmation do not match';
        }
        return '';
    };

    const handlePasswordChange = async () => {
        // Reset errors
        setError({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

        let isValid = true;

        // Validate all fields
        const currentPasswordError = validateCurrentPassword(currentPassword);
        const newPasswordError = validateNewPassword(newPassword);
        const confirmPasswordError = validateConfirmPassword(confirmPassword);

        if (currentPasswordError) {
            setError((prevError) => ({
                ...prevError,
                currentPassword: currentPasswordError,
            }));
            isValid = false;
        }

        if (newPasswordError) {
            setError((prevError) => ({
                ...prevError,
                newPassword: newPasswordError,
            }));
            isValid = false;
        }

        if (confirmPasswordError) {
            setError((prevError) => ({
                ...prevError,
                confirmPassword: confirmPasswordError,
            }));
            isValid = false;
        }

        // If validation passed, proceed with the API call
        if (isValid) {
            setError({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            setIsChangingPassword(true);

            try {
                const payload = {
                    old_password: currentPassword,
                    password: newPassword,
                };

                const userToken = await AsyncStorage.getItem('@userToken');

                const response = await axios.post(`${config.apiEndpoint}change-password`,
                    payload, {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                    }
                });

                setIsChangingPassword(false);

                const { success } = response.data;
                if(!success){
                    
                    if(response.data.status === 'INVALID_OLD_PASSWORD'){
                        setError((prevError) => ({
                            ...prevError,
                            currentPassword: response.data.message,
                        }));
                    } else {
                        Alert.alert('Error', 'An unexpected error occurred');
                        console.log(response.data);
                    }
                } else {
                    Alert.alert('Password Updated', 'Your password has been updated successfully.', [
                        { text: 'OK', onPress: () => navigation.goBack() },
                    ]);
                }
            } catch (error) {
                setIsChangingPassword(false);
                console.error('Error changing password:', error);
                Alert.alert('Error', 'Something went wrong, please try again later.');
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Password Change Form */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.cardTitle}>Change Your Password</Title>

                    {/* Current Password Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Current Password"
                            value={currentPassword}
                            onChangeText={(value) => {
                                setCurrentPassword(value);
                                setError((prevError) => ({
                                    ...prevError,
                                    currentPassword: validateCurrentPassword(value),
                                }));
                            }}
                            secureTextEntry={!showCurrentPassword}
                            style={styles.input}
                            error={!!error.currentPassword}
                            right={
                                <TextInput.Icon
                                    icon={showCurrentPassword ? 'eye-off' : 'eye'}
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                />
                            }
                        />
                        {error.currentPassword ? (
                            <Paragraph style={styles.errorText}>{error.currentPassword}</Paragraph>
                        ) : null}
                    </View>

                    {/* New Password Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="New Password"
                            value={newPassword}
                            onChangeText={(value) => {
                                setNewPassword(value);
                                setError((prevError) => ({
                                    ...prevError,
                                    newPassword: validateNewPassword(value),
                                }));
                            }}
                            secureTextEntry={!showNewPassword}
                            style={styles.input}
                            error={!!error.newPassword}
                            right={
                                <TextInput.Icon
                                    icon={showNewPassword ? 'eye-off' : 'eye'}
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                />
                            }
                        />
                        {error.newPassword ? (
                            <Paragraph style={styles.errorText}>{error.newPassword}</Paragraph>
                        ) : null}
                    </View>

                    {/* Confirm New Password Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChangeText={(value) => {
                                setConfirmPassword(value);
                                setError((prevError) => ({
                                    ...prevError,
                                    confirmPassword: validateConfirmPassword(value),
                                }));
                            }}
                            secureTextEntry={!showConfirmPassword}
                            style={styles.input}
                            error={!!error.confirmPassword}
                            right={
                                <TextInput.Icon
                                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            }
                        />
                        {error.confirmPassword ? (
                            <Paragraph style={styles.errorText}>{error.confirmPassword}</Paragraph>
                        ) : null}
                    </View>
                </Card.Content>
            </Card>

            {/* Action Button */}
            <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={handlePasswordChange} disabled={isChangingPassword} style={styles.requestButton}>
                    {isChangingPassword ? `Changing Password...` : `Change Password` }
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.background,
    },
    card: {
        marginBottom: 20,
        borderRadius: 5,
        elevation: 5,
        backgroundColor: theme.colors.white,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 15, // Container for input and error message
    },
    input: {
        marginBottom: 5, // Margin between input and error message
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: 10,
    },
    requestButton: {
        backgroundColor: theme.colors.primary,
    },
});

export default ChangePasswordScreen;
