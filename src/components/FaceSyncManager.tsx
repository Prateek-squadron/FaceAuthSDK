import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SyncManager from '../core/SyncManager';
import FaceStore from '../core/FaceStore';

export const FaceSyncManager = () => {
  const [pending, setPending] = useState<string[]>([]);
  const [status, setStatus] = useState('Idle');

  useEffect(() => {
    const updatePending = () => {
      const records = FaceStore.getAllFaces().filter(r => !r.synced);
      setPending(records.map(r => r.userId));
    };

    updatePending();

    SyncManager.on('onSyncStart', () => setStatus('Syncing...'));
    SyncManager.on('onSyncComplete', () => {
      setStatus('Idle');
      updatePending();
    });
    SyncManager.on('onSyncFailed', () => setStatus('Sync Failed'));

    return () => {
      SyncManager.removeAllListeners();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cloud Sync Status: {status}</Text>
      <FlatList
        data={pending}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>Pending Sync: {item}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>All records synced!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  item: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  itemText: {
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
});
