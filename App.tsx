import { StatusBar, Text, View } from 'react-native'
import { setBackgroundColorAsync } from 'expo-navigation-bar'

export default function App() {
  setBackgroundColorAsync('#030712')

  return (
    <View className="flex-1 items-center justify-center bg-gray-950">
      <Text className="text-5xl font-bold text-gray-50">Hello, World!</Text>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
    </View>
  )
}
