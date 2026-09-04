import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

// Set EXPO_PUBLIC_WEB_APP_URL in mobile/.env to the laptop's LAN URL.
// Expo Go runs this wrapper on the phone; the existing Vite/API server stays on the laptop.
const webAppUrl = process.env.EXPO_PUBLIC_WEB_APP_URL || 'http://10.141.0.132:3000';

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: webAppUrl }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#1f7a4d" />
            <Text style={styles.loadingText}>Loading AgroCare AI…</Text>
          </View>
        )}
        allowsBackForwardNavigationGestures
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: '#1f7a4d', fontSize: 16 },
});
