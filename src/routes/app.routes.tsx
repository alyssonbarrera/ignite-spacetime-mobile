import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Memory } from '@screens/Memory/index'
import { Memories } from '@screens/Memories/index'
import { NewMemory } from '@screens/NewMemory/index'
import { EditMemory } from '@screens/EditMemory/index'

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
      <Screen name="memories" component={Memories} />
      <Screen name="new" component={NewMemory} />
      <Screen name="memory" component={Memory} />
      <Screen name="edit" component={EditMemory} />
    </Navigator>
  )
}
