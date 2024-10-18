import React, { useState, useRef } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Payments from '../Payments'
import Admin from '../Admin'

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export default function TabOneScreen() {
  const [activeTab, setActiveTab] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [signupUsername, setSignupUsername] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'admin', email: 'admin@admin.com', password: 'adminpassword' },
    { id: '2', username: 'default', email: 's', password: '1' } // Added default user
  ])
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false)
  const [loggedInUsername, setLoggedInUsername] = useState<string | null>(null)

  const loginEmailRef = useRef<TextInput>(null)
  const loginPasswordRef = useRef<TextInput>(null)

  const handleLogin = () => {
    setIsLoading(true)
    try {
      const user = users.find(u => u.email === loginEmail && u.password === loginPassword)
      if (user) {
        setLoggedInUser(user.email)
        setLoggedInUsername(user.username)
        setIsAdmin(user.email === 'admin@admin.com')
        Alert.alert('Success', 'Login successful')
      } else {
        Alert.alert('Error', 'Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = () => {
    if (signupPassword !== signupConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: signupUsername,
      email: signupEmail,
      password: signupPassword,
    }

    setUsers(prevUsers => [...prevUsers, newUser])

    Alert.alert('Success', 'Account created successfully')
    setActiveTab('login')
    clearSignupFields()
  }

  const handleLogout = () => {
    setLoggedInUser(null)
    setIsAdmin(false)
    setActiveTab('login')
    clearLoginFields()
  }

  const clearLoginFields = () => {
    setLoginEmail('')
    setLoginPassword('')
    loginEmailRef.current?.clear()
    loginPasswordRef.current?.clear()
  }

  const clearSignupFields = () => {
    setSignupUsername('')
    setSignupEmail('')
    setSignupPassword('')
    setSignupConfirmPassword('')
  }

  if (loggedInUser && isAdmin) {
    return <Admin users={users} onLogout={handleLogout} />
  }

  if (loggedInUser) {
    return <Payments username={loggedInUsername || ''} />
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.whiteBox}>
        <View style={styles.topPadding} />
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'login' && styles.activeTab]}
            onPress={() => setActiveTab('login')}
          >
            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'signup' && styles.activeTab]}
            onPress={() => setActiveTab('signup')}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>Signup</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {activeTab === 'login' && (
            <View style={styles.formContainer}>
              <View style={styles.loginInputsContainer}>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={24} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    ref={loginEmailRef}
                    style={styles.input}
                    placeholder="Email"
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    autoComplete="email"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.inputIcon} />
                  <TextInput
                    ref={loginPasswordRef}
                    style={styles.input}
                    placeholder="Password"
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry={!showLoginPassword}
                    textContentType="password"
                    autoComplete="password"
                  />
                  <TouchableOpacity onPress={() => setShowLoginPassword(!showLoginPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showLoginPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.loginButton, isLoading && styles.disabledButton]} 
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {activeTab === 'signup' && (
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color="#007AFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={signupUsername}
                  onChangeText={setSignupUsername}
                  autoCapitalize="none"
                  textContentType="username"
                  autoComplete="username"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="#007AFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={signupEmail}
                  onChangeText={setSignupEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                  autoComplete="email"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={signupPassword}
                  onChangeText={setSignupPassword}
                  secureTextEntry={!showSignupPassword}
                  textContentType="newPassword"
                  autoComplete="new-password"
                />
                <TouchableOpacity onPress={() => setShowSignupPassword(!showSignupPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showSignupPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="#007AFF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={signupConfirmPassword}
                  onChangeText={setSignupConfirmPassword}
                  secureTextEntry={!showSignupConfirmPassword}
                  textContentType="newPassword"
                  autoComplete="new-password"
                />
                <TouchableOpacity onPress={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showSignupConfirmPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.signupButton} 
                  onPress={handleSignup}
                >
                  <Text style={styles.signupButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteBox: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  topPadding: {
    height: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    margin: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 15,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: 'black',
  },
  activeTabText: {
    color: 'white',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center', // Center content vertically
  },
  formContainer: {
    padding: 20,
  },
  loginInputsContainer: {
    marginBottom: 20, // Add space between inputs and button
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Reduced margin to bring fields closer
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 10,
  },
  signupButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  signupFormContainer: {
    padding: 20,
    paddingTop: 10, // Reduced top padding to move content up
  },
  signupInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Reduced margin to bring fields closer
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
  },
  eyeIcon: {
    padding: 10,
  },
})