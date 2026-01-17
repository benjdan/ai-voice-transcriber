import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * Props for the ListItem component
 */
interface ListItemProps {
  id: string;
  preview: string;
  createdAt: Date;
}

/**
 * ListItem component displays a single note item in the list
 * @param {ListItemProps} props - The props for the ListItem component
 * @returns {React.ReactElement} A touchable list item that links to the note details
 */
const ListItem: React.FC<ListItemProps> = ({ id, preview, createdAt }) => {
  return (
    <Link href={`/${id}`} asChild>
      <TouchableOpacity style={styles.listItem}>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemTitle}>{preview}</Text>
          <Text style={styles.listItemTimestamp}>{createdAt?.toLocaleString()}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#888" />
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'white',
  },
  listItemContent: {
    flex: 1,
    gap: 4,
  },
  listItemTitle: {
    fontSize: 16,
  },
  listItemTimestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default ListItem;
