import { AppRoutes } from './app.routes'
import { NavigationContainer } from '@react-navigation/native'

const linking = {
  prefixes: ['com.alyssonbarrera.nlwspacetime://'],
  config: {
    screens: {
      home: 'home',
      memories: 'memories',
      new: 'new',
      memory: 'memory',
      edit: 'edit',
    },
  },
}

export function Routes() {
  return (
    <NavigationContainer linking={linking}>
      <AppRoutes />
    </NavigationContainer>
  )
}
