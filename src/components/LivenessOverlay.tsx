import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LivenessChallenge } from '../core/LivenessEngine';

interface LivenessOverlayProps {
  challenge: LivenessChallenge | null;
  isPassed: boolean;
}

export const LivenessOverlay: React.FC<LivenessOverlayProps> = ({ challenge, isPassed }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withSpring(isPassed ? 0 : 1),
    transform: [{ scale: withSpring(isPassed ? 0.8 : 1) }],
  }));

  if (!challenge && !isPassed) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.card}>
        <Text style={styles.text}>
          {isPassed ? '✅ Liveness Passed!' : `Challenge: ${challenge?.replace('_', ' ')}`}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
