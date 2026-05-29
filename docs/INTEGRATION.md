# Integration Guide: FaceAuth SDK

## Installation

1. Copy the `FaceAuthSDK/src` directory into your project.
2. Install dependencies:
   ```bash
   npm install react-native-vision-camera react-native-fast-tflite react-native-mmkv react-native-reanimated @react-native-community/netinfo @aws-sdk/client-s3
   ```
3. Add the TFLite models to your native assets folder:
   - Android: `android/app/src/main/assets`
   - iOS: Add to project resources in Xcode.

## Basic Usage

### Face Enrollment
```typescript
import { useFaceAuth } from './src/hooks/useFaceAuth';

const { enrollFace } = useFaceAuth();
const result = await enrollFace('user_id', imageTensor);
```

### Face Verification with Liveness
```typescript
import { useLiveness } from './src/hooks/useLiveness';
import { useFaceAuth } from './src/hooks/useFaceAuth';

const { startCheck, processFrame } = useLiveness();
const { verifyFace } = useFaceAuth();

// 1. Start Liveness
startCheck();

// 2. In Camera Frame Processor
processFrame(landmarks);

// 3. If liveness passed, verify face
const verification = await verifyFace(imageTensor);
```

## Configuration
Update the `S3Client` configuration in `SyncManager.ts` with your actual AWS credentials and bucket name.
