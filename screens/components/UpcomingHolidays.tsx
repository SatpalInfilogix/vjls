import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import theme from '../../theme';

const UpcomingHolidays = () => {
    const holidays = [
        { name: 'Christmas', date: 'December 25, 2024' },
        { name: 'New Year', date: 'January 1, 2025' },
        // Add more holidays as needed
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionHeading}>Upcoming Holidays</Text>

            <View style={styles.cardsContainer}>
                {holidays.map((holiday, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Content>
                            <Title>{holiday.name}</Title>
                            <Paragraph>{holiday.date}</Paragraph>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 2,
        paddingTop: 12
    },
    sectionHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        marginBottom: 16,
        backgroundColor: theme.colors.white
    },
});

export default UpcomingHolidays;
