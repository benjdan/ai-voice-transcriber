import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB, NOTE_COLLECTION } from '@/utils/FirebaseConfig';
import { toast } from 'sonner-native';
import { usePostHog } from 'posthog-react-native'

/**
 * Page component for handling new audio recordings and their transcription.
 */
const Page = () => {
  // Get the URI of the audio file from the route params
  const { uri } = useLocalSearchParams<{ uri?: string }>();
  // State for storing the transcription text
  const [transcription, setTranscription] = useState('');
  // State for tracking loading state
  const [isLoading, setIsLoading] = useState(false);
  // Router for navigation
  const router = useRouter();
  // PostHog client
  const posthog = usePostHog()


  // Effect to trigger transcription when the component mounts or URI changes
  useEffect(() => {
    handleTranscribe();
  }, [uri]);

  /**
   * Handles the transcription of the audio file.
   */
  const handleTranscribe = async () => {
    setIsLoading(true);
    toast.loading('Loading...');
    try {
      const formData = new FormData();
      const audioData = {
        uri,
        type: 'audio/m4a',
        name: 'audio.m4a',
      };

      formData.append('file', audioData as unknown as Blob);

      // Send the audio file to the speech-to-text API
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }).then((response) => response.json());

      setTranscription(response.text || 'No corresponding transcription available');
      posthog.capture("transcribe_audio")
    } catch (error) {
      console.error('Error transcribing audio:', error);
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  /**
   * Handles saving the transcription to Firestore.
   */
  const handleSave = async () => {
    addDoc(collection(FIRESTORE_DB, NOTE_COLLECTION), {
      preview: transcription.length > 40 ? transcription.slice(0, 40) + '...' : transcription,
      text: transcription,
      createdAt: serverTimestamp(),
    });

    router.dismissAll();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.transcriptionInput}
        multiline
        value={transcription}
        onChangeText={setTranscription}
        placeholder="Transcription will be available here..."
        editable={!isLoading}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
        <Text style={styles.saveButtonText}>Save Transcription</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  transcriptionInput: {
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    minHeight: 150,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
