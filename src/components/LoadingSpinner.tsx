import { ActivityIndicator, View } from 'react-native';

export default function LoadingSpinner() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#ef4444" />
    </View>
  );
}