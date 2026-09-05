import { CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

// Set EXPO_PUBLIC_WEB_APP_URL in mobile/.env to the laptop's LAN URL.
// Expo Go runs this wrapper on the phone; the existing Vite/API server stays on the laptop.
const webAppUrl = process.env.EXPO_PUBLIC_WEB_APP_URL || 'http://10.141.0.132:3000';

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const sendToWebApp = (message: Record<string, string>) => {
    const event = JSON.stringify(message);
    webViewRef.current?.injectJavaScript(
      `window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(event)} })); true;`,
    );
  };

  const openNativeCamera = async () => {
    const currentPermission = permission?.granted ? permission : await requestPermission();
    if (!currentPermission.granted) {
      Alert.alert(
        'Camera permission needed',
        'Allow camera access to scan a crop leaf. You can enable it later in your phone settings.',
      );
      sendToWebApp({ type: 'AGROCARE_NATIVE_CAMERA_CANCELLED' });
      return;
    }
    setIsCameraOpen(true);
  };

  const closeNativeCamera = () => {
    setIsCameraOpen(false);
    sendToWebApp({ type: 'AGROCARE_NATIVE_CAMERA_CANCELLED' });
  };

  const captureNativePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.82 });
    if (!photo?.base64) {
      Alert.alert('Capture failed', 'Please try taking the photo again.');
      return;
    }

    setIsCameraOpen(false);
    sendToWebApp({
      type: 'AGROCARE_NATIVE_CAMERA_RESULT',
      dataUrl: `data:image/jpeg;base64,${photo.base64}`,
    });
  };

  const handleWebMessage = (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message?.type === 'AGROCARE_OPEN_NATIVE_CAMERA') {
        void openNativeCamera();
      }
    } catch {
      // Ignore WebView messages not sent by the AgroCare camera bridge.
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
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
        onMessage={handleWebMessage}
      />
      {isCameraOpen && (
        <View style={styles.cameraOverlay}>
          <CameraView ref={cameraRef} style={styles.cameraPreview} facing="back" />
          <View style={styles.cameraControls}>
            <Pressable onPress={closeNativeCamera} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
            <Pressable onPress={() => void captureNativePhoto()} style={styles.captureButton}>
              <View style={styles.captureButtonInner} />
            </Pressable>
            <Text style={styles.hintText}>Point at an affected crop leaf</Text>
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: '#1f7a4d', fontSize: 16 },
  cameraOverlay: { ...StyleSheet.absoluteFill, backgroundColor: '#000' },
  cameraPreview: { flex: 1 },
  cameraControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    gap: 16,
    paddingTop: 20,
    paddingBottom: 42,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButton: { position: 'absolute', left: 22, top: 20, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.55)' },
  closeButtonText: { color: '#fff', fontWeight: '700' },
  captureButton: { width: 76, height: 76, padding: 6, borderRadius: 38, borderWidth: 3, borderColor: '#fff' },
  captureButtonInner: { flex: 1, borderRadius: 32, backgroundColor: '#fff' },
  hintText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
