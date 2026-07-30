import React from 'react';
import { SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack } from 'expo-router';

// IMPORTANT: Replace this with your live website URL (e.g., "https://stackadda.com") 
// If testing locally, use your computer's local IP address (e.g., "http://192.168.1.10:5173") 
// Do NOT use "localhost" because the phone will look for the server inside the phone itself.
const WEB_URL = "http://10.85.113.171:5173";

export default function WebWrapperScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      {Platform.OS === 'web' ? (
        <iframe 
          src={WEB_URL} 
          style={{ flex: 1, border: 'none', width: '100%', height: '100%' }} 
        />
      ) : (
        <WebView 
          source={{ uri: WEB_URL }} 
          style={{ flex: 1 }}
          startInLoadingState={true}
          scalesPageToFit={true}
          bounces={false}
          showsVerticalScrollIndicator={false}
          userAgent="StackAddaMobileApp"
        />
      )}
    </SafeAreaView>
  );
}
