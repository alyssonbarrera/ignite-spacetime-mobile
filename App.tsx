/* eslint-disable import/no-duplicates */
// eslint-disable-next-line prettier/prettier
import 'react-native-gesture-handler';

import { styled } from 'nativewind'
import { Routes } from '@routes/index'
import { setBackgroundColorAsync } from 'expo-navigation-bar'
import { ImageBackground, ActivityIndicator, StatusBar } from 'react-native'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '@assets/blur-bg.png'
import Stripes from '@assets/stripes.svg'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const StyledStripes = styled(Stripes)

export default function App() {
  setBackgroundColorAsync('#18181b')

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  if (!hasLoadedFonts) {
    return (
      <ImageBackground
        resizeMode="cover"
        source={blurBg}
        className="relative flex-1 justify-center bg-gray-900"
        imageStyle={{ position: 'absolute', left: '-30%' }}
      >
        <ActivityIndicator size={50} color="#8257e5" />
      </ImageBackground>
    )
  }

  return (
    <ImageBackground
      resizeMode="cover"
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: 'absolute', left: '-30%' }}
    >
      <SafeAreaProvider
        style={{
          flex: 1,
          backgroundColor: 'transparent',
        }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#18181b" />
        <StyledStripes className="absolute left-2" />
        <Routes />
      </SafeAreaProvider>
    </ImageBackground>
  )
}
