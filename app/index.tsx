import { Redirect } from 'expo-router';

// This simply triggers the RootLayout router logic above.
export default function Index() {
  return <Redirect href="/(tabs)" />;
}