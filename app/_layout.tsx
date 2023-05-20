/* eslint-disable import/no-duplicates */
// eslint-disable-next-line prettier/prettier
import 'react-native-gesture-handler';

import { styled } from 'nativewind'
import { SplashScreen } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ImageBackground } from 'react-native'
import { setBackgroundColorAsync } from 'expo-navigation-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '@assets/blur-bg.png'
import Stripes from '@assets/stripes.svg'
import { AppRoutes } from '@routes/app.routes'

const StyledStripes = styled(Stripes)

export default function Layout() {
  setBackgroundColorAsync('#121215')

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  if (!hasLoadedFonts) {
    return <SplashScreen />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        resizeMode="cover"
        source={blurBg}
        className="relative flex-1 bg-gray-900"
        imageStyle={{ position: 'absolute', left: '-30%' }}
      >
        <StyledStripes className="absolute left-2" />
        <StatusBar style="light" backgroundColor="transparent" translucent />
        <AppRoutes />
      </ImageBackground>
    </GestureHandlerRootView>
  )
}
