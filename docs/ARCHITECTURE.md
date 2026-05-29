# Architecture: Offline FaceAuth SDK

## Overview
The FaceAuth SDK provides an offline-first facial recognition and liveness detection system for React Native. It utilizes TensorFlow Lite for on-device inference, ensuring privacy and functionality without internet connectivity.

## Core Components

### 1. ML Pipeline (`/src/core`)
- **FaceDetector**: Orchestrates detection (BlazeFace) and landmark extraction (FaceMesh).
- **FaceEmbedder**: Uses MobileFaceNet to generate a 128-d normalized embedding vector from a cropped face image.
- **LivenessEngine**: A state-machine based challenge-response system. It calculates EAR (Eye Aspect Ratio) for blinks, MAR (Mouth Aspect Ratio) for smiles, and Yaw angle for head turns.

### 2. Data Layer (`FaceStore.ts`)
- Uses `react-native-mmkv` for high-performance encrypted storage.
- Embeddings are stored as normalized vectors, serialized to JSON.
- AES-256 encryption is applied at rest.

### 3. Sync Mechanism (`SyncManager.ts`)
- Implements a "deferred sync" pattern.
- Monitors network status via `@react-native-community/netinfo`.
- Uploads encrypted records to AWS S3 using an exponential backoff retry strategy.

## Logic Flow
`Camera Frame` $\rightarrow$ `FaceDetector` $\rightarrow$ `LivenessEngine` $\rightarrow$ `FaceEmbedder` $\rightarrow$ `FaceStore/S3`.

## Performance Optimization
- **Frame Skipping**: Processes every 3rd frame to reduce CPU load.
- **Quantization**: Uses INT8 quantized TFLite models to keep footprint under 15MB.
- **L2 Normalization**: Simplifies verification to a simple dot product (Cosine Similarity).
