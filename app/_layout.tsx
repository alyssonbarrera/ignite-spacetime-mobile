import { styled } from 'nativewind'
import { StatusBar } from 'expo-status-bar'
import { useState, useEffect } from 'react'
import { ImageBackground } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { SplashScreen, Stack } from 'expo-router'
import { setBackgroundColorAsync } from 'expo-navigation-bar'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '@assets/blur-bg.png'
import Stripes from '@assets/stripes.svg'

const StyledStripes = styled(Stripes)

export default function Layout() {
  setBackgroundColorAsync('#121215')

  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null)

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      setIsUserAuthenticated(!!token)
    })
  }, [])

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  if (!hasLoadedFonts) {
    return <SplashScreen />
  }

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: 'absolute', left: '-30%' }}
    >
      <StyledStripes className="absolute left-2" />

      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="new" />
        <Stack.Screen name="memories" />
      </Stack>
    </ImageBackground>
  )
}
