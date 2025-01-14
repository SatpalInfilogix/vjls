import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Title, Paragraph, List } from 'react-native-paper';
import theme from '../theme';

const EarnedPayrollScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Earned Payroll</Text>
      </View>

      {/* Payroll Summary Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Total Earnings</Title>
          <Text style={styles.amountText}>$3,500.00</Text>
          <Paragraph style={styles.paragraph}>For the pay period: Dec 1 - Dec 7, 2024</Paragraph>
        </Card.Content>
      </Card>

      {/* Payroll Details */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Payroll Details</Title>
          <List.Item
            title="Hours Worked"
            description="40 hours"
            left={(props) => <List.Icon {...props} icon="clock" />}
          />
          <List.Item
            title="Deductions"
            description="$200.00 (Tax & Benefits)"
            left={(props) => <List.Icon {...props} icon="currency-usd" />}
          />
          <List.Item
            title="Bonus"
            description="$150.00 (Holiday Bonus)"
            left={(props) => <List.Icon {...props} icon="gift" />}
          />
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => console.log('Request Payout Pressed')} style={styles.requestButton}>
          Request Payout
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:  theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.success,
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  card: {
    marginBottom: 20,
    borderRadius: 5,
    elevation: 5,
    backgroundColor: theme.colors.white
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paragraph: {
    marginTop: 5,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  requestButton: {
    backgroundColor: theme.colors.primary
  },
});

export default EarnedPayrollScreen;
