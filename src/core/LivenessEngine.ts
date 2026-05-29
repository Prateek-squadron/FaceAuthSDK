import { Landmark } from './FaceDetector';

export type LivenessChallenge = 'BLINK' | 'SMILE' | 'TURN_LEFT' | 'TURN_RIGHT';

interface LivenessState {
  currentChallenge: LivenessChallenge;
  startTime: number;
  isPassed: boolean;
}

class LivenessEngine {
  private state: LivenessState | null = null;
  private readonly TIMEOUT = 7000;

  // MediaPipe Face Mesh Indices (approximate)
  private readonly LEFT_EYE = [33, 160, 158, 133, 153, 144];
  private readonly RIGHT_EYE = [362, 385, 387, 263, 373, 380];
  private readonly MOUTH = [13, 14, 78, 88]; // Top, Bottom, Left, Right

  startLivenessCheck(): { passed: boolean; challenge: LivenessChallenge } {
    const challenges: LivenessChallenge[] = ['BLINK', 'SMILE', 'TURN_LEFT', 'TURN_RIGHT'];
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    
    this.state = {
      currentChallenge: challenge,
      startTime: Date.now(),
      isPassed: false,
    };

    return { passed: false, challenge };
  }

  processFrame(landmarks: Landmark[]): { passed: boolean; currentChallenge: LivenessChallenge | null } {
    if (!this.state) return { passed: false, currentChallenge: null };

    if (Date.now() - this.state.startTime > this.TIMEOUT) {
      this.state = null;
      return { passed: false, currentChallenge: null };
    }

    const { currentChallenge } = this.state;
    let passed = false;

    switch (currentChallenge) {
      case 'BLINK':
        passed = this.checkBlink(landmarks);
        break;
      case 'SMILE':
        passed = this.checkSmile(landmarks);
        break;
      case 'TURN_LEFT':
        passed = this.checkHeadTurn(landmarks, 'LEFT');
        break;
      case 'TURN_RIGHT':
        passed = this.checkHeadTurn(landmarks, 'RIGHT');
        break;
    }

    if (passed) {
      this.state.isPassed = true;
      const finalState = { ...this.state };
      this.state = null; // Reset after pass
      return { passed: true, currentChallenge: finalState.currentChallenge };
    }

    return { passed: false, currentChallenge };
  }

  private checkBlink(landmarks: Landmark[]): boolean {
    const leftEAR = this.calculateEAR(landmarks, this.LEFT_EYE);
    const rightEAR = this.calculateEAR(landmarks, this.RIGHT_EYE);
    return (leftEAR + rightEAR) / 2 < 0.2;
  }

  private checkSmile(landmarks: Landmark[]): boolean {
    const mar = this.calculateMAR(landmarks);
    return mar > 0.3;
  }

  private checkHeadTurn(landmarks: Landmark[], direction: 'LEFT' | 'RIGHT'): boolean {
    // Simplified yaw estimation using nose and cheek landmarks
    const nose = landmarks[1];
    const leftCheek = landmarks[234];
    const rightCheek = landmarks[454];
    
    const distLeft = Math.abs(nose.x - leftCheek.x);
    const distRight = Math.abs(nose.x - rightCheek.x);
    
    return direction === 'LEFT' ? distRight > distLeft * 2 : distLeft > distRight * 2;
  }

  private calculateEAR(landmarks: Landmark[], indices: number[]): number {
    const p = indices.map(i => landmarks[i]);
    const dist1 = this.dist(p[1], p[5]);
    const dist2 = this.dist(p[2], p[4]);
    const dist3 = this.dist(p[0], p[3]);
    return (dist1 + dist2) / (2 * dist3);
  }

  private calculateMAR(landmarks: Landmark[]): number {
    const p = this.MOUTH.map(i => landmarks[i]);
    const vertical = this.dist(p[0], p[1]);
    const horizontal = this.dist(p[2], p[3]);
    return vertical / horizontal;
  }

  private dist(p1: Landmark, p2: Landmark): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
}

export default new LivenessEngine();
