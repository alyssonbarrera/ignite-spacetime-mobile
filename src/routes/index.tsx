import { useAuth } from '@hooks/useAuth'
import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'
import { View, ActivityIndicator } from 'react-native'
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
  const { token, isAuthenticating } = useAuth()

  if (isAuthenticating) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#8257e5" />
      </View>
    )
  }

  return (
    <NavigationContainer linking={linking}>
      {token ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  )
}
