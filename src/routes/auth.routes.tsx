import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Home } from '@screens/Home/index'

const { Navigator, Screen } = createNativeStackNavigator()

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Screen name="home" component={Home} />
    </Navigator>
  )
}
