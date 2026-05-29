import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FaceEnrollScreen } from './src/components/FaceEnrollScreen';
import { FaceVerifyScreen } from './src/components/FaceVerifyScreen';
import { FaceSyncManager } from './src/components/FaceSyncManager';

type Screen = 'home' | 'enroll' | 'verify';

const AppContent = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  return (
    <SafeAreaView style={styles.container}>
      {currentScreen === 'home' && (
        <View style={styles.home}>
          <Text style={styles.header}>FaceAuth Demo</Text>
          <TouchableOpacity style={styles.menuButton} onPress={() => setCurrentScreen('enroll')}>
            <Text style={styles.menuButtonText}>Enroll Face</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => setCurrentScreen('verify')}>
            <Text style={styles.menuButtonText}>Verify Identity</Text>
          </TouchableOpacity>
          <FaceSyncManager />
        </View>
      )}

      {currentScreen === 'enroll' && (
        <View style={{ flex: 1 }}>
          <FaceEnrollScreen />
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('home')}>
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentScreen === 'verify' && (
        <View style={{ flex: 1 }}>
          <FaceVerifyScreen />
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('home')}>
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  home: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  menuButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
