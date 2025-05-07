import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import theme from '../../theme';

interface Duty {
    id: string,
    date: string;
    start_time: string;
    end_time: string;
    client_site: {
        location: string;
        location_code: string;
    };
}

interface UpcomingDutiesProps {
    duty: Duty[];
}

const UpcomingDuties: React.FC<UpcomingDutiesProps> = ({ duty }) => {

    const formatDate = (input: string): string => {
        const [yyyy, mm, dd] = input.split('-');
        return `${dd}-${mm}-${yyyy}`;
    };
      
    // Format time to HH:mm
    const formatTime = (time: string): string => {
        const date = new Date(`1970-01-01T${time}`);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
      
        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;
      
        return `${hours}:${minutes} ${ampm}`;
      };
      

    if (!duty || duty.length === 0) return null;

    return (
        <View>
            {/* Heading */}
            <Text style={styles.heading}>Upcoming Duties</Text>

            {duty.map((item) => (
                <Card key={item.id} style={{ backgroundColor: theme.colors.primary, marginBottom: 10 }}>
                    <Card.Content>
                        {/* Row 1: Labels */}
                        <View style={styles.singleRow}>
                            <Text style={{ fontSize: 14, color: theme.colors.white }}>Date :</Text>
                            <Text style={{ fontSize: 14, color: theme.colors.white }}> {formatDate(item.date)}</Text>
                        </View>

                        {/* Row 2: Labels */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 14, color: theme.colors.white }}>Start Time</Text>
                            <Text style={{ fontSize: 14, color: theme.colors.white }}>End Time</Text>
                        </View>

                        {/* Row 3: Values */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 14, color: theme.colors.white }}>{item.start_time ? formatTime(item.start_time) : '--:--'}</Text>
                            <Text style={{ fontSize: 14, color: theme.colors.white }}>{item.end_time ? formatTime(item.end_time) : '--:--'}</Text>
                        </View>

                        {/* Row 4: Labels */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 14, color: theme.colors.white }}>Site Location</Text>
                            <Text style={{ fontSize: 14, color: theme.colors.white }}>Location Code</Text>
                        </View>

                        {/* Row 5: Values */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 14, color: theme.colors.white }}>{item.client_site?.location || '--:--'}</Text>
                            <Text style={{ fontSize: 14, color: theme.colors.white }}>{item.client_site?.location_code || '--:--'}</Text>
                        </View>
                    </Card.Content>
                </Card>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    heading: {
        marginTop: 16,
        marginBottom: 4,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    card: {
        marginVertical: 6,
        marginHorizontal: 12,
        backgroundColor: 'white',
        elevation: 2
    },
    label: {
        fontWeight: '600',
        marginTop: 8,
        color: '#555'
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4
    },
    locationIcon: {
        marginRight: 6,
        color: theme.colors.primary,
    },
    singleRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 8,
    },
});

export default UpcomingDuties;
