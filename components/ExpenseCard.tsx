import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Expense } from '../types';

interface ExpenseCardProps {
  expense: Expense;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.descriptionText}>{expense.description}</Text>
      <Text style={styles.amountText}>- {expense.amount} ₺</Text>
      <Text style={styles.dateText}>{expense.date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  amountText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    marginRight: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#777',
  },
});
