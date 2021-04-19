import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, AsyncStorage } from 'react-native';
import { Focus } from './src/features/focus/Focus';
import { FocusHistory } from './src/features/focus/FocusHistory';
import { Timer } from './src/features/timer/Timer';
import { colors } from './src/utils/colors';
import { spacing } from './src/utils/sizes';

const STATUSES = {
  COMPLETE: 1,
  CANCELED: 2,
};

export default function App() {
  const [focus_subject, set_focus_subject] = useState(null);
  const [focus_history, set_focus_history] = useState([]);

  const addFocusHistoryWithStatus = (subject, status) => {
    set_focus_history([...focus_history, { key: String(focus_history.length + 1), subject, status }]);
  };
  const onClear = () => {
    set_focus_history([]);
  };

  const saveFocusHistory = async () => {
    try {
      await AsyncStorage.setItem('focusHistory', JSON.stringify(focus_history));
    } catch (e) {
      console.log(e);
    }
  };

  const loadFocusHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('focusHistory');
      if (history && JSON.parse(history).length) {
        set_focus_history(JSON.parse(history));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadFocusHistory();
  }, [])

  useEffect(() => {
    saveFocusHistory();
  }, [focus_history]);

  console.log(focus_history);
  return (
    <View style={styles.container}>
      {focus_subject ? (
        <Timer
          focus_subject={focus_subject}
          onTimerEnd={() => {
            addFocusHistoryWithStatus(focus_subject, STATUSES.COMPLETE);
            set_focus_subject(null);
          }}
          clearSubject={() => {
            addFocusHistoryWithStatus(focus_subject, STATUSES.CANCELED);
            set_focus_subject(null);
          }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Focus addSubject={set_focus_subject} />
          <FocusHistory focus_history={focus_history} onClear={onClear} />
        </View>
      )}
      <Text>{focus_subject}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.md,
    backgroundColor: colors.darkBlue,
  },
});
