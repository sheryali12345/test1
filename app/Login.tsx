import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoginProps {
  onLogin: (email: string, isAdmin: boolean) => void;
  switchToSignup: () => void;
  key?: string; // Add this line
}

const Login: React.FC<LoginProps> = ({ onLogin, switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email === 'admin@admin.com' && password === 'adminpassword') {
      onLogin(email, true);
      clearInputs();
    } else if (email && password) {
      onLogin(email, false);
      clearInputs();
    } else {
      Alert.alert('Error', 'Please enter both email and password');
    }
  };

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={24} color="#007AFF" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
});

export default Login;