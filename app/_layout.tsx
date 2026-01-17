import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PostHogProvider } from 'posthog-react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import PostHog from 'posthog-react-native';

const webStorage = {
  async getItem(key: string) { return Promise.resolve(localStorage.getItem(key)); },
  async setItem(key: string, value: string) { localStorage.setItem(key, value); return Promise.resolve(); },
  async removeItem(key: string) { localStorage.removeItem(key); return Promise.resolve(); },
};

const storageProvider = Platform.OS === 'web' ? webStorage : AsyncStorage;
const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST;

// Only initialize PostHog storage on native platforms
if (Platform.OS !== 'web') {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  const PostHog = require('posthog-react-native').default;
  
}

if (!POSTHOG_API_KEY) {
  throw new Error('Missing PostHog API Key. Please set EXPO_PUBLIC_POSTHOG_API_KEY in your .env');
}
/**
 * Root layout component for the voice notes app
 */
export default function RootLayout() {
  const router = useRouter();
  return (
    <GestureHandlerRootView>
      <PostHogProvider
        apiKey={POSTHOG_API_KEY}
        debug={true}
        options={{
          host: HOST,
          enableSessionReplay: true,
          sessionReplayConfig: {
              maskAllTextInputs: true,
              maskAllImages: true,
              captureLog: true,
              captureNetworkTelemetry: true,
              androidDebouncerDelayMs: 500,
              iOSdebouncerDelayMs: 1000,
          }
        }}>
        <Toaster />
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Voice Notes' }} />
          <Stack.Screen
            name="new-recording"
            options={{
              title: 'New Recording',
              presentation: 'modal',
              headerLeft: () => (
                <Ionicons name="close" size={24} color="black" onPress={() => router.back()} />
              ),
            }}
          />
        </Stack>
      </PostHogProvider>
    </GestureHandlerRootView>
  );
}
