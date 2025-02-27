import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, Platform, Alert, TouchableOpacity } from 'react-native';
import { Button, Card, Title, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import theme from '../../theme';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera, ImagePickerResponse, CameraOptions } from 'react-native-image-picker';
import axios from 'axios';
import config from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface PunchSectionProps {
    duty: any;
}

const PunchSection: React.FC<PunchSectionProps> = ({ duty }) => {
    const [isPunchedIn, setIsPunchedIn] = useState(false);
    const [isPunching, setIsPunching] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const [punchInfo, setPunchInfo] = useState(null) as any;

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "This app needs access to your location.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );

            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            return true; // Assume permission is granted for simplicity
        }
    };

    const requestCameraPermission = async (): Promise<boolean> => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Camera Permission",
                    message: "This app needs access to your camera.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            // For iOS, you should ideally check using react-native-permissions,
            // but for simplicity, we'll assume permission is granted.
            return true;
        }
    };

    const handleTogglePunch = async () => {
        const hasLocationPermission = await requestLocationPermission();
        if (!hasLocationPermission) {
            Alert.alert("Permission Denied", "Location permission is required to punch in.");
            return;
        }

        const hasCameraPermission = await requestCameraPermission();
        if (!hasCameraPermission) {
            Alert.alert("Camera Permission Denied", "Camera access is required to take a selfie.");
            return;
        }

        const cameraOptions: CameraOptions = {
            mediaType: 'photo',
            cameraType: 'front',
            saveToPhotos: false,
        };

        const getCurrentDateTime = (): string => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        };

        launchCamera(cameraOptions, async (response: ImagePickerResponse) => {
            if (response.errorCode) {
                Alert.alert("Camera Error", response.errorMessage);
                return;
            } else if (response.assets && response.assets.length > 0) {
                let image = response.assets[0] as any;
                const prefix = isPunchedIn ? 'out' : 'in';
                setIsPunching(true);

                try {
                    const location = await new Promise((resolve, reject) => {
                        Geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
                    }) as any;

                    const formData = new FormData();
                    formData.append(`${prefix}_image`, {
                        name: image.fileName,
                        type: image.type,
                        uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
                    });

                    formData.append(`${prefix}_lat`, location.coords.latitude.toString());
                    formData.append(`${prefix}_long`, location.coords.longitude.toString());
                    formData.append(`time`, getCurrentDateTime());
                    formData.append(`${prefix}_location`, JSON.stringify(location));

                    const userToken = await AsyncStorage.getItem('@userToken');

                    const response = await axios.post(`${config.apiEndpoint}punch/${prefix}`, formData, {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    let { success } = response.data;
                    if (!success) {
                        setIsPunching(false);
                        setErrMessage(response.data.message);
                        return;
                    }
                    
                    setErrMessage('');

                    if (prefix === 'in') {
                        let { data } = response.data;
                        await AsyncStorage.setItem('@punchInfo', JSON.stringify(data));
                        setPunchInfo(data);
                    } else {
                        await AsyncStorage.removeItem('@punchInfo');
                    }

                    setIsPunchedIn((prevState) => !prevState);
                    setIsPunching(false);
                } catch (error) {
                    setIsPunching(false);
                    if (axios.isAxiosError(error) && error.response?.status) {
                        Alert.alert(error.response.data.message || 'Something went wrong!');
                    } else {
                        Alert.alert("Error", `Failed to punch ${prefix}.`);
                    }
                }
            }
        });
    };

    const checkPunchStatus = async () => {
        try {
            const punchInfo = await AsyncStorage.getItem('@punchInfo');
            if (punchInfo) {
                setPunchInfo(JSON.parse(punchInfo));
                setIsPunchedIn(true);
            } else {
                setIsPunchedIn(false);
            }
        } catch (error) {
            console.error('Error retrieving punch status:', error);
            Alert.alert('Error', 'Failed to retrieve punch status.');
        }
    };

    useEffect(() => {
        checkPunchStatus();
    }, []);

   
    const getTimeFromDate = (dateString : String) => {
        const date = new Date(dateString as string);
    
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
    
        const ampm = hours >= 12 ? 'PM' : 'AM';
    
        hours = hours % 12;
        hours = hours ? hours : 12;
    
        const time = `${hours}:${minutes} ${ampm}`;
    
        return time;
    };    

    return (<View>
        {duty && duty.client_site ? <>
            <Card style={{ backgroundColor: theme.colors.primary }}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, margin: 5 }}>
                            <Title style={{ color: theme.colors.white, fontSize: 14 }}>Punch In</Title>
                            <Title style={{ color: theme.colors.white, fontSize: 14 }}>{punchInfo && punchInfo.in_time ? getTimeFromDate(punchInfo.in_time) : `--:--`}</Title>
                        </View>
                        <View style={{ flex: 1, margin: 5 }}>
                            <Title style={{ color: theme.colors.white, fontSize: 14 }}>Punch Out</Title>
                            <Title style={{ color: theme.colors.white, fontSize: 14 }}>--:--</Title>
                        </View>
                        <View style={{ flex: 1, margin: 5 }}>
                            <TouchableOpacity style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.5,
                                elevation: 5,
                                backgroundColor: theme.colors.activeTabColor,
                                borderRadius: 4,
                                paddingVertical: 8
                            }} onPress={handleTogglePunch}>

                                {!isPunchedIn ? (<>
                                    <FeatherIcon name='log-out' style={{ color: theme.colors.white, fontSize: 26, textAlign: 'center' }}></FeatherIcon>
                                    <Title style={{ color: theme.colors.white, fontSize: 16, textAlign: 'center' }}>{`Punch In`}</Title>
                                </>) : (<>
                                    <FeatherIcon name='log-out' style={{ color: theme.colors.white, fontSize: 26, textAlign: 'center' }}></FeatherIcon>
                                    <Title style={{ color: theme.colors.white, fontSize: 16, textAlign: 'center' }}>{`Punch Out`}</Title>
                                </>)}
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </> : <Card style={{ backgroundColor: theme.colors.warning }}>
            <Card.Content>
                <View style={[styles.locationContainer]}>
                    <FeatherIcon name="alert-circle" size={18} color={theme.colors.white} style={styles.locationIcon} />
                    <Title style={{ color: theme.colors.white, fontSize: 16 }}>Duty is not assigned to you for today</Title>
                </View>
            </Card.Content>
        </Card>
        }

        {errMessage &&
            <Card style={{ backgroundColor: theme.colors.warning, marginTop: 16 }}>
                <Card.Content>
                    <View style={[styles.locationContainer]}>
                        <FeatherIcon name="alert-circle" size={18} color={theme.colors.white} style={styles.locationIcon} />
                        <Title style={{ color: theme.colors.white, fontSize: 16 }}>{errMessage}</Title>
                    </View>
                </Card.Content>
            </Card>}

    </View>);
};

const styles = StyleSheet.create({
    buttonContainer: {
        width: '80%',
        alignItems: 'center', // This will center the button horizontally within the container
        justifyContent: 'center', // This will center the button vertically within the container
        marginTop: 20,
        alignSelf: 'center', // This ensures the container itself is centered on the screen
    },
    button: {
        flex: 1,
        marginHorizontal: 8,
        alignContent: 'center',
        width: 160,
    },
    preview: {
        flex: 1,
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
});

export default PunchSection;
