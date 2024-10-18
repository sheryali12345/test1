import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Calendar from './calender';

interface Entry {
  id: string;
  date: string;
  name: string;
  type: string;
  amount: string;
  credit: string;
  debit: string;
}

const Cashflow = () => {
  const [inputText, setInputText] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('Select...');
  const [isDropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [isCalendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const options = ['Select...', 'Name', 'Type', 'Amount'];

  const handleAddEntry = () => {
    const trimmedInput = inputText.trim();
    const inputLines = trimmedInput.split('\n');
    let transactionTypeToApply = 'db';
    const lastLineParts = inputLines[inputLines.length - 1].trim().split(' ');
    const lastPart = lastLineParts[lastLineParts.length - 1].toLowerCase();

    if (lastPart === 'cr' || lastPart === 'db') {
      transactionTypeToApply = lastPart;
      inputLines[inputLines.length - 1] = inputLines[inputLines.length - 1].trim().replace(/(cr|db)$/, '').trim();
    } else {
      Alert.alert('Info', 'No transaction type specified, defaulting to Debit (db).');
    }

    inputLines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine === '') return;

      const parts = trimmedLine.split(' ');

      if (parts.length < 3) {
        Alert.alert('Error', 'Invalid input format. Each entry must have at least name, type, and amount');
        return;
      }

      const name = parts.slice(0, parts.length - 2).join(' ');
      const type = parts[parts.length - 2];
      const amount = parseFloat(parts[parts.length - 1]);

      if (isNaN(amount)) {
        Alert.alert('Error', 'Invalid amount. Please enter a valid number');
        return;
      }

      const newEntry: Entry = {
        id: Math.random().toString(),
        date: selectedDate,
        name,
        type,
        amount: amount.toString(),
        credit: transactionTypeToApply === 'cr' ? amount.toString() : '0',
        debit: transactionTypeToApply === 'db' ? amount.toString() : '0',
      };

      setEntries((prevEntries) => [...prevEntries, newEntry]);
    });

    setInputText('');
  };

  const totalCredit = useMemo(() => {
    return entries.reduce((total, entry) => total + parseFloat(entry.credit), 0);
  }, [entries]);

  const totalDebit = useMemo(() => {
    return entries.reduce((total, entry) => total + parseFloat(entry.debit), 0);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (selectedOption === 'Select...' || !searchText) return entries;
    return entries.filter(entry => {
      const entryValue = entry[selectedOption.toLowerCase() as keyof Entry]?.toString().toLowerCase();
      return entryValue ? entryValue.includes(searchText.toLowerCase()) : false;
    });
  }, [entries, searchText, selectedOption]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCalendarVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cashflow Manager</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search by ${selectedOption}`}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity 
          onPress={() => setDropdownVisible(!isDropdownVisible)} 
          style={styles.dropdownButton}
        >
          <Text style={styles.dropdownText}>{selectedOption}</Text>
          <Ionicons name={isDropdownVisible ? "chevron-up" : "chevron-down"} size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.calendarButton} onPress={() => setCalendarVisible(!isCalendarVisible)}>
          <Ionicons name="calendar-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {isDropdownVisible && (
        <View style={styles.dropdownList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setSelectedOption(option);
                setDropdownVisible(false);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {isCalendarVisible && (
        <Calendar onSelectDate={handleDateSelect} onClose={() => setCalendarVisible(false)} />
      )}

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Type</Text>
          <Text style={styles.tableHeaderText}>Credit</Text>
          <Text style={styles.tableHeaderText}>Debit</Text>
        </View>
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.name}</Text>
              <Text style={styles.tableCell}>{item.type}</Text>
              <Text style={styles.tableCell}>{item.credit}</Text>
              <Text style={styles.tableCell}>{item.debit}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No entries found</Text>
          }
        />
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>Credit: ${totalCredit.toFixed(2)}</Text>
          <Text style={styles.totalAmount}>Debit: ${totalDebit.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter data (name type amount cr/db)"
          value={inputText}
          onChangeText={setInputText}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity onPress={handleAddEntry} style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    marginRight: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9ECEF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#495057',
    marginRight: 4,
  },
  calendarButton: {
    backgroundColor: '#E9ECEF',
    padding: 8,
    borderRadius: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: 120,
    right: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CED4DA',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#495057',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#495057',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#495057',
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6C757D',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#E9ECEF',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#495057',
  },
  totalAmount: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  input: {
    height: 100,
    borderColor: '#CED4DA',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: '#F8F9FA',
    textAlignVertical: 'top',
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

export default Cashflow;