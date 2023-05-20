import { createNativeStackNavigator } from '@react-navigation/native-stack'

import App from '@app/home'
import NewMemory from '@app/new'
import Memories from '@app/memories'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Screen name="home" component={App} />
      <Screen name="memories" component={Memories} />
      <Screen name="new" component={NewMemory} />
    </Navigator>
  )
}
