import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

let startTime: number | null = null;

const Home = () => {
  const navigation = useNavigation();
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (startTime === null) {
      startTime = Date.now();
    }
    
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = now - (startTime as number);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeElapsed({ days, hours, minutes, seconds });

      // Check if the timer has reached the specified time
      if (days === 0 && hours === 0 && minutes === 1 && seconds === 30) {
        sendExternalMessage("Time's up! Your trial period has ended.");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendExternalMessage = (message: string) => {
    // In a real application, this function would integrate with a service to send an SMS
    // For now, we'll just log the message to the console
    console.log('External message sent:', message);
    // You could also use this to trigger a native module that sends an SMS
    // or integrate with a push notification service
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Trial time elapsed:</Text>
      <Text style={styles.countdownText}>
        {timeElapsed.days} days, {timeElapsed.hours} hours, {timeElapsed.minutes} minutes, {timeElapsed.seconds} seconds
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Cashflow')}>
        <Text style={styles.buttonText}>Go to Cashflow</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'black',
    marginBottom: 10,
  },
  countdownText: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'blue',
  },
});

export default Home;
