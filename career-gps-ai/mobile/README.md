# Mobile App Shell

This folder serves as a placeholder for the future mobile implementation.

## Mobile Architecture Plan

1. **Framework**: React Native with Expo.
2. **State Management**: Zustand / React Query for caching API endpoints.
3. **Core Screens**:
   - **Login/Register**: Token exchange stored securely in `Expo SecureStore`.
   - **Dashboard**: Simple XP widget and daily checklists.
   - **AI Chatbot**: Conversational interface using react-native-gifted-chat.
   - **Interview Coach**: Speech record button matching audio waveforms using `expo-av`.
4. **Offline support**: SQLite database wrapper for offline synchronization with the Express backend.
