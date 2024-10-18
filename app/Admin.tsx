import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

interface AdminProps {
  users: User[];
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ users, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = users.filter(user => 
        user.id.toLowerCase().includes(lowercasedQuery) ||
        user.username.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user.password.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSpacing} />
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={24} color="#4A90E2" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          placeholderTextColor="#A0A0A0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color="#4A90E2" />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Text style={styles.userId}>{item.id}</Text>
            <Text style={styles.userName}>{item.username}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userPassword}>Password: {item.password}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  topSpacing: {
    height: 40, // Adjust this value to move the header lower
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4A90E2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  logoutButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333333',
  },
  clearButton: {
    padding: 5,
  },
  userItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userId: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  userPassword: {
    fontSize: 14,
    color: '#999999',
  },
});

export default Admin;