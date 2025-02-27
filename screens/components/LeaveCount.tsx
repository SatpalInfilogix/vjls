import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack'; // Import the navigation prop type
import { useNavigation } from '@react-navigation/native';
import theme from '../../theme';

interface LeaveProps {
    leaves: any;
}

const LeaveStatus: React.FC<LeaveProps> = ({ leaves }) => {
    const navigation = useNavigation<StackNavigationProp<any>>();

    const handleViewAll = () => {
        navigation.navigate('AppliedLeaves');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionHeading}>My Leave Count</Text>

                {/* View all link on the right side of the heading */}
                <Text style={styles.viewAllText} onPress={handleViewAll}>
                    View all
                </Text>
            </View>

            <Card style={{ backgroundColor: theme.colors.white }}>
                <Card.Content style={styles.card}>
                    <View style={styles.row}>
                        <View style={[styles.section]}>
                            <Text style={[styles.heading, { color: theme.colors.warning }]}>{leaves.pendingLeaves}</Text>
                            <Text style={[styles.label, { color: theme.colors.warning }]}>Pending</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={[styles.heading, { color: theme.colors.success }]}>{leaves.approvedLeaves}</Text>
                            <Text style={[styles.label, { color: theme.colors.success }]}>Approved</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={[styles.heading, { color: theme.colors.error }]}>{leaves.rejectedLeaves}</Text>
                            <Text style={[styles.label, { color: theme.colors.error }]}>Rejected</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8, // Ensure padding inside container to avoid overflow
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Space between heading and "View all"
        alignItems: 'center', // Ensures proper alignment of the heading and link
        marginBottom: 10, // Adds space between the heading and the card
    },
    sectionHeading: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    viewAllText: {
        fontSize: 14,
        color: theme.colors.primary, // Use theme color for the link text
        textDecorationLine: 'underline', // Makes it look like a link
        maxWidth: '30%', // Prevent overflow if text is long
        textAlign: 'right', // Align the "View all" to the right
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
    card: {
        marginHorizontal: 8,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        marginTop: 8,
    },
    arrowIcon: {
        position: 'absolute',
        top: '20%',
        right: 0,
        transform: [{ translateY: -12 }],
    },
});

export default LeaveStatus;
