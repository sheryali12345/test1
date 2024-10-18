import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CalendarProps {
  onSelectDate: (date: string) => void;
  onClose: () => void;
}

const Calendar: React.FC<CalendarProps> = ({ onSelectDate, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <TouchableOpacity
          key={i}
          style={styles.calendarDay}
          onPress={() => {
            const selectedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
            onSelectDate(selectedDate);
            onClose();
          }}
        >
          <Text>{i}</Text>
        </TouchableOpacity>
      );
    }
    return days;
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={styles.arrowButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthYearText}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={styles.arrowButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.weekDaysContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Text key={day} style={styles.weekDayText}>{day}</Text>
        ))}
      </View>
      <View style={styles.calendarDaysContainer}>
        {renderCalendarDays()}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: 300,
    position: 'absolute',
    top: 60,
    right: 10,
    zIndex: 1000,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  arrowButton: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  weekDayText: {
    fontWeight: 'bold',
  },
  calendarDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Calendar;