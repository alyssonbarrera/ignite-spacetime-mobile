import { useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import { setBackgroundColorAsync } from 'expo-navigation-bar'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'

import { GITHUB_CLIENT_ID } from '@env'

import { useAuth } from '@hooks/useAuth'
import NLWLogo from '@assets/nlw-spacetime-logo.svg'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: `https://github.com/settings/connections/applications/${GITHUB_CLIENT_ID}`,
}

WebBrowser.maybeCompleteAuthSession()

export function Home() {
  const { signIn, isAuthenticating } = useAuth()

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'com.alyssonbarrera.nlwspacetime',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    try {
      await signIn(code)
    } catch (error) {
      Alert.alert(
        'Login',
        'Ocorreu um erro ao realizar o login, tente novamente mais tarde.',
      )
    }
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response])

  setBackgroundColorAsync('#121215')

  return (
    <View className="flex-1 px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          disabled={isAuthenticating}
          activeOpacity={0.8}
          className={`min-w-[215px] rounded-full bg-green-500 px-5 py-3 ${
            isAuthenticating && 'opacity-80'
          }`}
          onPress={() => signInWithGithub()}
        >
          {isAuthenticating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="font-alt text-sm uppercase text-black">
              COMEÇAR A CADASTRAR
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
