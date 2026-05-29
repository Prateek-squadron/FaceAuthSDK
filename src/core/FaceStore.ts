import { MMKV } from 'react-native-mmkv';

export interface FaceRecord {
  userId: string;
  embedding: Float32Array;
  enrolledAt: number;
  synced: boolean;
  captureMetadata: {
    deviceModel: string;
    lightingScore: number;
  };
}

class FaceStore {
  private storage: MMKV;

  constructor() {
    this.storage = new MMKV({
      id: 'face-auth-storage',
      encryptionKey: 'a-very-secure-key-that-should-be-from-keystore', // In production, use react-native-keychain
    });
  }

  private serializeEmbedding(embedding: Float32Array): string {
    return JSON.stringify(Array.from(embedding));
  }

  private deserializeEmbedding(embeddingStr: string): Float32Array {
    return new Float32Array(JSON.parse(embeddingStr));
  }

  saveFace(record: FaceRecord): void {
    const data = {
      ...record,
      embedding: this.serializeEmbedding(record.embedding),
    };
    this.storage.set(`face:${record.userId}`, JSON.stringify(data));
  }

  getFace(userId: string): FaceRecord | null {
    const dataStr = this.storage.getString(`face:${userId}`);
    if (!dataStr) return null;

    const data = JSON.parse(dataStr);
    return {
      ...data,
      embedding: this.deserializeEmbedding(data.embedding),
    } as FaceRecord;
  }

  getAllFaces(): FaceRecord[] {
    const keys = this.storage.getAllKeys();
    const faceKeys = keys.filter((key) => key.startsWith('face:'));
    
    return faceKeys.map((key) => {
      const userId = key.replace('face:', '');
      return this.getFace(userId)!;
    });
  }

  deleteFace(userId: string): void {
    this.storage.delete(`face:${userId}`);
  }

  markAsSynced(userId: string): void {
    const face = this.getFace(userId);
    if (face) {
      face.synced = true;
      this.saveFace(face);
    }
  }
}

export default new FaceStore();
