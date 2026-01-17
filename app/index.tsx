import { View, Alert, TouchableOpacity, StyleSheet, FlatList, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';
import { FIRESTORE_DB, NOTE_COLLECTION } from '@/utils/FirebaseConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListItem from '@/components/ListItem';

/**
 * Main index component for the voice notes app
 */
export default function Index() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    // Set up real-time listener for notes
    const notesCollection = collection(FIRESTORE_DB, NOTE_COLLECTION);
    const q = query(notesCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setNotes(notes);
    });
    return () => unsubscribe();
  }, []);

  /**
   * Start recording audio
   */
  async function startRecording() {
    // Skip on web platform
    if (Platform.OS === 'web') {
      Alert.alert('Recording is not supported on web');
      return;
    }

    try {
      const permissionResponse = await Audio.requestPermissionsAsync();

      if (permissionResponse.status === 'granted') {
        console.log('Permission granted');
      } else {
        Alert.alert('Permission not granted');
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  /**
   * Stop recording audio and navigate to new recording page
   */
  async function stopRecording() {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (!uri) {
      console.error('Failed to get URI for recording');
      return;
    }

    router.push(`/new-recording?uri=${encodeURIComponent(uri)}`);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        renderItem={({ item }) => (
          <ListItem id={item.id} preview={item.preview} createdAt={item.createdAt?.toDate()} />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      {Platform.OS !== 'web' && (
        <View style={[styles.buttonContainer, { bottom: bottom }]}>
          <TouchableOpacity
            onPress={recording ? stopRecording : startRecording}
            style={[
              styles.recordButton,
              recording ? styles.recordingButton : styles.notRecordingButton,
            ]}>
            <Ionicons name={recording ? 'stop' : 'mic'} size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    alignSelf: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#ff4444',
  },
  notRecordingButton: {
    backgroundColor: '#4444ff',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
  },
});
