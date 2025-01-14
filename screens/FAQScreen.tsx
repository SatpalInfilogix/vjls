import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, List } from 'react-native-paper';
import theme from '../theme';

interface FAQ {
  question: string;
  answer: string;
}

const FAQs: FAQ[] = [
  {
    question: "What is your return policy?",
    answer: "You can return items within 30 days for a full refund."
  },
  {
    question: "How do I track my order?",
    answer: "You can track your order using the tracking link sent to your email."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide."
  },
];

const FAQScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAQs</Text>
      {FAQs.map((faq, index) => (
        <FAQItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </View>
  );
};

// Define props interface
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);

  return (
    <Card style={styles.faqItem}>
      <List.Accordion
        title={question}
        expanded={expanded}
        onPress={handlePress}
        style={styles.accordion}
        titleStyle={styles.accordionTitleStyle}
      >
        <List.Item title={answer} />
      </List.Accordion>
    </Card>
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
    textAlign: 'center'
  },
  faqItem: {
    marginBottom: 10,
  },
  accordion: {
    //backgroundColor: theme.colors.accent, // Change this to your desired background color
  },
  accordionTitleStyle: {
    color: theme.colors.accent,
  },
});

export default FAQScreen;
