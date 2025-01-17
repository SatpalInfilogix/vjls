import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider, Card, Button } from 'react-native-paper';
import theme from '../../theme';

// Type for the TabButtons props
interface TabButtonsProps {
    selectedTab: 'prevFornight' | 'thisFornight';
    setSelectedTab: (tab: 'prevFornight' | 'thisFornight') => void;
}

// TabButtons Component
const TabButtons: React.FC<TabButtonsProps> = ({ selectedTab, setSelectedTab }) => (
    <View style={styles.tabContainer}>
        <TouchableOpacity
            onPress={() => setSelectedTab('prevFornight')}
            style={[styles.tabButton, {
                backgroundColor: selectedTab === 'prevFornight' ? theme.colors.primary : theme.colors.background,
            }]}
        >
            <Text style={{
                color: selectedTab === 'prevFornight' ? theme.colors.white : theme.colors.secondary,
            }}>Last Fornight</Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => setSelectedTab('thisFornight')}
            style={[styles.tabButton, {
                backgroundColor: selectedTab === 'thisFornight' ? theme.colors.secondary : theme.colors.background
            }]}
        >
            <Text style={{
                color: selectedTab === 'thisFornight' ? theme.colors.white : theme.colors.secondary,
            }}>This Fornight</Text>
        </TouchableOpacity>
    </View>
);

// Type for the AttendanceStats props
interface AttendanceStatsProps {
    absent: number;
    halfDays: number;
    present: number;
}

// AttendanceStats Component
const AttendanceStats: React.FC<AttendanceStatsProps> = ({ absent, halfDays, present }) => (
    <Card style={{ backgroundColor: theme.colors.background }}>
        <Card.Content style={[styles.card]}>
            <View style={styles.row}>
                <View style={styles.section}>
                    <Text style={[styles.heading, { color: theme.colors.error }]}>{absent}</Text>
                    <Text style={[styles.label, { color: theme.colors.error }]}>Absent</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.heading, { color: theme.colors.warning }]}>{halfDays}</Text>
                    <Text style={[styles.label, { color: theme.colors.warning }]}>Half Days</Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.heading, { color: theme.colors.success }]}>{present}</Text>
                    <Text style={[styles.label, { color: theme.colors.success }]}>Present</Text>
                </View>
            </View>
        </Card.Content>
    </Card>
);

interface AttendanceProps {
    attendances: any;
}

// MyAttendance Component
const MyAttendance: React.FC<AttendanceProps> = ({ attendances }) => {
    const [selectedTab, setSelectedTab] = useState<'prevFornight' | 'thisFornight'>('prevFornight');

    const renderTabContent = useMemo(() => {
        switch (selectedTab) {
            case 'prevFornight':
                return <AttendanceStats absent={attendances?.absentDays || 0} halfDays={attendances?.halfDays || 0} present={attendances?.presentDays || 0} />;
            case 'thisFornight':
            default:
                return <AttendanceStats absent={attendances?.absentDays || 0} halfDays={attendances?.halfDays || 0} present={attendances?.presentDays || 0} />;
        }
    }, [selectedTab]);

    return (
        <PaperProvider>
            <Text style={styles.sectionHeading}>My Attendance</Text>
            <View style={styles.container}>
                <Card style={[styles.card, { backgroundColor: theme.colors.white }]}>
                    <Card.Content>
                        <TabButtons selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                        {renderTabContent}
                    </Card.Content>
                </Card>
            </View>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center', // Center the buttons in the row
        marginBottom: 16,
    },
    sectionHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 18
    },
    tabButton: {
        marginHorizontal: 8,
        flex: 1,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18
    },
    card: {
        width: '100%',
        padding: 0,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    section: {
        alignItems: 'center',
        flex: 1,
        padding: 2,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        marginTop: 8,
    },
});

export default MyAttendance;
