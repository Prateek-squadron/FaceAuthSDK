# Offline Facial Recognition & Liveness Detection for React Native

A high-performance, offline-first biometric authentication system for React Native that performs facial recognition and anti-spoofing liveness detection entirely on-device.

## 🚀 Overview

Secure identity verification often relies on cloud-based services, which introduce latency, privacy concerns, and fail in offline environments. This solution implements a complete biometric pipeline on the device, combining facial landmark detection, embedding extraction, and a dynamic liveness challenge-response system.

### ✨ Key Features
- **Fully Offline Inference**: Zero dependency on external APIs for authentication.
- **Anti-Spoofing (Liveness Detection)**: Real-time challenges (blink, smile, head turn) to prevent photo/video replay attacks.
- **Secure Storage**: Face embeddings are encrypted at rest using AES-256 via `react-native-mmkv`.
- **Deferred Cloud Sync**: Background synchronization layer using AWS S3 for encrypted records.

## 🛠 Technical Stack

- **Framework**: React Native (Latest Stable) + TypeScript
- **ML Runtime**: TensorFlow Lite (`react-native-fast-tflite`)
- **Models**:
  - **BlazeFace/FaceMesh**: Landmark detection.
  - **MobileFaceNet**: Quantized INT8 model for 128-d facial embeddings.
- **Camera**: `react-native-vision-camera` (v4+)
- **Storage**: `react-native-mmkv` (Encrypted)
- **UI**: `react-native-reanimated`

## 📐 Architecture

The system follows a modular pipeline:
`Camera Frame` $\rightarrow$ `FaceDetector` $\rightarrow$ `LivenessEngine` $\rightarrow$ `FaceEmbedder` $\rightarrow$ `FaceStore/S3`.

For a deeper dive, see [ARCHITECTURE.md](./docs/ARCHITECTURE.md).

---

## 🏁 Getting Started

### Prerequisites
Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

### Step 1: Install Dependencies
```sh
npm install
# For iOS:
cd ios && pod install && cd ..
```

### Step 2: Start Metro
```sh
npm start
```

### Step 3: Build and Run
With Metro running, use one of the following commands:

#### Android
```sh
npm run android
```

#### iOS
```sh
npm run ios
```

## 📂 Project Structure

```
/FaceAuthSDK
  /src
    /models         ← TFLite models (.tflite)
    /core           ← Core ML and Storage logic
    /components     ← UI components
    /hooks          ← React hooks for auth/liveness
  /demo             ← Standalone demo app
  /docs             ← Technical documentation
```

## 📈 Performance Targets
- **End-to-End Latency**: < 800ms.
- **Model Footprint**: < 15MB.
- **Recognition Accuracy**: > 95%.
- **False Accept Rate (FAR)**: < 0.1%.
