import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB, NOTE_COLLECTION } from '@/utils/FirebaseConfig';
import { toast } from 'sonner-native';

/**
 * Page component for editing and deleting a note
 */
const Page = () => {
  // Get the note id from the URL params
  const { id } = useLocalSearchParams<{ id: string }>();
  // State to store the note content
  const [note, setNote] = useState('');
  // Router for navigation
  const router = useRouter();

  // Effect to load the note content when the component mounts
  useEffect(() => {
    const loadNote = async () => {
      if (id) {
        const noteRef = doc(FIRESTORE_DB, NOTE_COLLECTION, id);
        const noteSnap = await getDoc(noteRef);
        if (noteSnap.exists()) {
          setNote(noteSnap.data().text);
        }
      }
    };
    loadNote();
  }, [id]);

  /**
   * Handles updating the note in Firestore
   */
  const handleUpdate = async () => {
    if (id) {
      const noteRef = doc(FIRESTORE_DB, NOTE_COLLECTION, id);
      updateDoc(noteRef, {
        text: note,
        preview: note.length > 40 ? note.slice(0, 40) + '...' : note,
      });
      toast.success('Changes saved', {
        description: 'Your changes have been saved successfully',
        closeButton: true,
      });
      router.back();
    }
  };

  /**
   * Handles deleting the note from Firestore
   */
  const handleDelete = async () => {
    if (id) {
      const noteRef = doc(FIRESTORE_DB, NOTE_COLLECTION, id);
      deleteDoc(noteRef);
      toast.info('Note deleted', {
        description: 'Your note has been deleted successfully',
      });
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'Edit Note' }} />
      <TextInput
        style={styles.noteInput}
        multiline
        value={note}
        onChangeText={setNote}
        placeholder="Note content..."
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Update Note</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete Note</Text>
        </TouchableOpacity>
      </View>
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
  noteInput: {
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    minHeight: 150,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#4444ff',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
