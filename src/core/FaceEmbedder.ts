import { loadModel } from 'react-native-fast-tflite';

class FaceEmbedder {
  private model: any = null;
  private readonly MODEL_PATH = 'src/models/mobilefacenet.tflite';

  async init() {
    if (this.model) return;
    try {
      // In a real RN app, you'd use a bundle asset path
      this.model = await loadModel(this.MODEL_PATH);
    } catch (e) {
      console.error('Failed to load MobileFaceNet model:', e);
      throw e;
    }
  }

  async extractEmbedding(imageTensor: Float32Array): Promise<Float32Array> {
    await this.init();
    
    // Run inference
    const output = await this.model.run([imageTensor]);
    const embedding = new Float32Array(output[0]);
    
    // Normalize the embedding vector (L2 norm)
    return this.normalize(embedding);
  }

  private normalize(v: Float32Array): Float32Array {
    const norm = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    return v.map((val) => val / (norm || 1));
  }

  cosineSimilarity(v1: Float32Array, v2: Float32Array): number {
    let dotProduct = 0;
    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
    }
    // Since they are normalized, dot product is cosine similarity
    return dotProduct;
  }

  verify(embedding: Float32Array, storedEmbedding: Float32Array, threshold = 0.75): boolean {
    const similarity = this.cosineSimilarity(embedding, storedEmbedding);
    return similarity > threshold;
  }
}

export default new FaceEmbedder();
