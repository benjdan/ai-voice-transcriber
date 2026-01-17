# AI Voice Transcriber App with PostHog

Record your voice and take notes with AI transcription. Store your notes in the cloud and sync them across all your devices using Firebase. Watch how users interact with your app and replay sessions.

## Technologies Used

- React Native
- Expo
- Firebase Firestore
- [PostHog](http://posthog.com/)
- expo-router for navigation
- sonner-native for toast notifications

## Getting Started

### Prerequisites

- Node.js
- Expo CLI
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/benjdan/ai-voice-transcriber
   ```

2. Navigate to the project directory:
   ```
   cd ai-voice-transcriber
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up your Firebase configuration in `utils/FirebaseConfig.ts`

5. Create your own `.env` file and insert your credentials.

6. Start the Expo development server:
   ```
   npx expo run:android
   ```

## Project Structure

- `app/index.tsx`: Main screen with the list of notes
- `app/new-recording.tsx`: Transcription screen
- `app/[id].tsx`: Screen for editing and deleting a specific note
- `utils/FirebaseConfig.ts`: Firebase configuration


##
