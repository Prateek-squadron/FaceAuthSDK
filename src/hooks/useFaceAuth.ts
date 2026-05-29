import { useState, useCallback } from 'react';
import FaceStore from './FaceStore';
import FaceEmbedder from './FaceEmbedder';
import FaceDetector from './FaceDetector';

export const useFaceAuth = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const enrollFace = useCallback(async (userId: string, imageTensor: Float32Array) => {
    setIsProcessing(true);
    try {
      const detections = await FaceDetector.detect(imageTensor);
      if (detections.length === 0) throw new Error('No face detected');

      const embedding = await FaceEmbedder.extractEmbedding(imageTensor);
      
      FaceStore.saveFace({
        userId,
        embedding,
        enrolledAt: Date.now(),
        synced: false,
        captureMetadata: {
          deviceModel: 'Unknown',
          lightingScore: 0.8,
        },
      });
      
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const verifyFace = useCallback(async (imageTensor: Float32Array) => {
    setIsProcessing(true);
    try {
      const currentEmbedding = await FaceEmbedder.extractEmbedding(imageTensor);
      const storedFaces = FaceStore.getAllFaces();
      
      let bestMatch = { userId: '', confidence: -1 };
      
      for (const stored of storedFaces) {
        const confidence = FaceEmbedder.cosineSimilarity(currentEmbedding, stored.embedding);
        if (confidence > bestMatch.confidence) {
          bestMatch = { userId: stored.userId, confidence };
        }
      }
      
      const passed = bestMatch.confidence > 0.75;
      return { userId: bestMatch.userId, confidence: bestMatch.confidence, passed };
    } catch (e: any) {
      throw e;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { enrollFace, verifyFace, isProcessing };
};
