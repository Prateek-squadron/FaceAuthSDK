import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useFaceAuth } from '../hooks/useFaceAuth';
import { useLiveness } from '../hooks/useLiveness';
import { LivenessOverlay } from './LivenessOverlay';

export const FaceVerifyScreen = () => {
  const { verifyFace } = useFaceAuth();
  const { startCheck, challenge, isPassed, isChecking } = useLiveness();
  const devices = useCameraDevices();
  const device = devices.front;

  const handleVerify = useCallback(async () => {
    const mockTensor = new Float32Array(112 * 112 * 3);
    const result = await verifyFace(mockTensor);
    
    if (result.passed) {
      Alert.alert('Verified', `Welcome ${result.userId}! Confidence: ${(result.confidence * 100).toFixed(2)}%`);
    } else {
      Alert.alert('Failed', 'Face not recognized');
    }
  }, [verifyFace]);

  useEffect(() => {
    if (isPassed) {
      handleVerify();
    }
  }, [isPassed, handleVerify]);

  if (device == null) return <View style={styles.container}><Text>Loading Camera...</Text></View>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        // In a real app, use frame processor here to call processFrame
      />
      
      <LivenessOverlay challenge={challenge} isPassed={isPassed} />
      
      <View style={styles.overlay}>
        {!isChecking && !isPassed && (
          <TouchableOpacity style={styles.button} onPress={startCheck}>
            <Text style={styles.buttonText}>Start Verification</Text>
          </TouchableOpacity>
        )}
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
  button: {
    backgroundColor: '#34C759',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
