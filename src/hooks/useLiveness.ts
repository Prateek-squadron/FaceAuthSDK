import { useState, useCallback } from 'react';
import LivenessEngine, { LivenessChallenge } from '../core/LivenessEngine';
import { Landmark } from '../core/FaceDetector';

export const useLiveness = () => {
  const [challenge, setChallenge] = useState<LivenessChallenge | null>(null);
  const [isPassed, setIsPassed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const startCheck = useCallback(() => {
    const result = LivenessEngine.startLivenessCheck();
    setChallenge(result.challenge);
    setIsPassed(false);
    setIsChecking(true);
  }, []);

  const processFrame = useCallback((landmarks: Landmark[]) => {
    if (!isChecking) return;
    
    const result = LivenessEngine.processFrame(landmarks);
    if (result.passed) {
      setIsPassed(true);
      setIsChecking(false);
      setChallenge(null);
    }
  }, [isChecking]);

  return { startCheck, processFrame, challenge, isPassed, isChecking };
};
