import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useFaceAuth } from '../hooks/useFaceAuth';

export const FaceEnrollScreen = () => {
  const [userId] = useState('user_123');
  const { enrollFace, isProcessing } = useFaceAuth();
  const devices = useCameraDevices();
  const device = devices.front;

  const onEnroll = async () => {
    // In a real app, we'd grab the latest frame from the frame processor
    const mockTensor = new Float32Array(112 * 112 * 3);
    const result = await enrollFace(userId, mockTensor);
    
    if (result.success) {
      Alert.alert('Success', 'Face enrolled successfully!');
    } else {
      Alert.alert('Error', result.error || 'Enrollment failed');
    }
  };

  if (device == null) return <View style={styles.container}><Text>Loading Camera...</Text></View>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Enroll Your Face</Text>
        <TouchableOpacity 
          style={[styles.button, isProcessing && styles.disabled]} 
          onPress={onEnroll}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>{isProcessing ? 'Processing...' : 'Capture Face'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  disabled: { backgroundColor: '#ccc' },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
