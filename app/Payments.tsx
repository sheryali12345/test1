import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { saveTransaction } from './database'; // This import will now work

interface PaymentsProps {
  username: string;
}

const Payments: React.FC<PaymentsProps> = ({ username }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const handleNextSection = () => {
    if (currentSection < 3) {
      animateTransition();
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      animateTransition();
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handleBuyNow = () => {
    setShowBuyNow(true);
  };

  const handleBackToFeatures = () => {
    setShowBuyNow(false);
  };

  const animateTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start();
  };

  const renderFeatures = () => {
    switch (currentSection) {
      case 2:
        return (
          <>
            <Text style={styles.featureItem}>• Dashboards</Text>
            <Text style={styles.featureItem}>• Voice assistant</Text>
            <Text style={styles.featureItem}>• AI assistant</Text>
          </>
        );
      case 3:
        return (
          <>
            <Text style={styles.featureItem}>• Reminders</Text>
            <Text style={styles.featureItem}>• 1 click data upload</Text>
            <Text style={styles.featureItem}>• Product buy sell</Text>
          </>
        );
      default:
        return (
          <>
            <Text style={styles.featureItem}>• Book keeping</Text>
            <Text style={styles.featureItem}>• Cashflow management</Text>
            <Text style={styles.featureItem}>• Custom reports</Text>
          </>
        );
    }
  };

  const handleSubmit = () => {
    if (transactionId.trim() === '') {
      Alert.alert('Error', 'Please enter a transaction ID');
      return;
    }
    saveTransaction(transactionId);
    Alert.alert('Success', 'Submitted successfully');
    setTransactionId(''); // Clear the input field after saving
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteBox}>
        <View style={styles.welcomeContainer}>
          {showBuyNow && (
            <TouchableOpacity onPress={handleBackToFeatures} style={styles.backArrow}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          <Text style={styles.welcomeText}>Welcome, {username}</Text>
        </View>
        {!showBuyNow ? (
          <>
            <View style={styles.contentContainer}>
              <Text style={styles.featuresTitle}>Features</Text>
              <Animated.View style={[styles.featuresList, { opacity: fadeAnim }]}>
                {renderFeatures()}
              </Animated.View>
            </View>
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, { backgroundColor: currentSection === 1 ? '#FF6B6B' : '#E2E8F0' }]} />
              <View style={[styles.dot, { backgroundColor: currentSection === 2 ? '#4ECDC4' : '#E2E8F0' }]} />
              <View style={[styles.dot, { backgroundColor: currentSection === 3 ? '#45B7D1' : '#E2E8F0' }]} />
            </View>
            <View style={styles.navigationContainer}>
              <TouchableOpacity 
                style={styles.iconContainer} 
                onPress={handlePreviousSection}
                disabled={currentSection === 1}
              >
                <Ionicons 
                  name="arrow-back" 
                  size={24} 
                  color={currentSection === 1 ? '#E2E8F0' : '#4A5568'} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconContainer} 
                onPress={handleNextSection}
                disabled={currentSection === 3}
              >
                <Ionicons 
                  name="arrow-forward" 
                  size={24} 
                  color={currentSection === 3 ? '#E2E8F0' : '#4A5568'} 
                />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
                <Text style={styles.buttonText}>Buy Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]} 
                onPress={() => router.push('/Home')}
              >
                <Text style={styles.primaryButtonText}>Start Free Trial</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.buyNowContainer}>
            <View style={styles.boxWrapper}>
              <Text style={styles.boxLabel}>Account</Text>
              <View style={styles.smallWhiteBox}>
                <Text style={styles.boxText}>shery</Text>
              </View>
            </View>
            <View style={styles.boxWrapper}>
              <Text style={styles.boxLabel}>Amount</Text>
              <View style={styles.smallWhiteBox}>
                <Text style={styles.boxText}>$20</Text>
              </View>
            </View>
            <TextInput
              style={[styles.smallWhiteBox, styles.textInput]}
              placeholder="Transaction Id..."
              placeholderTextColor="#A0AEC0"
              value={transactionId}
              onChangeText={setTransactionId}
              textAlign="center"
            />
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton, styles.submitButton]} 
              onPress={handleSubmit}
            >
              <Text style={styles.primaryButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
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
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  welcomeContainer: {
    backgroundColor: '#4A5568',
    padding: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  featuresList: {
    marginTop: 10,
  },
  featureItem: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: -25, // Increased margin to move dots higher
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  iconContainer: {
    padding: 10,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#4A5568',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buyNowContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
  },
  boxWrapper: {
    width: 200,
    marginBottom: 20,
  },
  boxLabel: {
    fontSize: 10,
    color: '#4A5568',
    marginBottom: 2,
    marginLeft: 2,
  },
  smallWhiteBox: {
    width: 200,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    fontSize: 16,
    color: '#4A5568',
  },
  textInput: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#4A5568',
  },
  submitButton: {
    marginTop: 25,
    width: 200,
  },
});

export default Payments;
