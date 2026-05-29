import NetInfo from '@react-native-community/netinfo';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import FaceStore, { FaceRecord } from './FaceStore';
import { EventEmitter } from 'events';

class SyncManager extends EventEmitter {
  private s3Client: S3Client;
  private isSyncing = false;

  constructor() {
    super();
    this.s3Client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'MOCK_ACCESS_KEY',
        secretAccessKey: 'MOCK_SECRET_KEY',
      },
    });

    this.initNetInfoListener();
  }

  private initNetInfoListener() {
    NetInfo.addEventListener(state => {
      if (state.isConnected && !this.isSyncing) {
        this.syncPendingRecords();
      }
    });
  }

  async syncPendingRecords() {
    const records = FaceStore.getAllFaces().filter(r => !r.synced);
    if (records.length === 0) return;

    this.isSyncing = true;
    this.emit('onSyncStart');

    try {
      for (const record of records) {
        await this.uploadRecordWithRetry(record);
        FaceStore.markAsSynced(record.userId);
        this.emit('onSyncProgress', { userId: record.userId });
      }
      this.emit('onSyncComplete');
    } catch (e) {
      this.emit('onSyncFailed', e);
    } finally {
      this.isSyncing = false;
    }
  }

  private async uploadRecordWithRetry(record: FaceRecord, attempt = 1): Promise<void> {
    try {
      const timestamp = Date.now();
      const key = `${record.userId}/${timestamp}.json`;
      const body = JSON.stringify({
        ...record,
        embedding: Array.from(record.embedding),
      });

      await this.s3Client.send(new PutObjectCommand({
        Bucket: 'datalake-faces',
        Key: key,
        Body: body,
        ContentType: 'application/json',
      }));
    } catch (e) {
      if (attempt < 3) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(res => setTimeout(res, delay));
        return this.uploadRecordWithRetry(record, attempt + 1);
      }
      throw e;
    }
  }
}

export default new SyncManager();
