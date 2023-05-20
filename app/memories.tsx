import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { Video, ResizeMode } from 'expo-av'
import { useCallback, useState } from 'react'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { View, TouchableOpacity, ScrollView, Text, Image } from 'react-native'

import { api } from '@libs/api'
import NLWLogo from '@assets/nlw-spacetime-logo.svg'

dayjs.locale(ptBr)

type Memory = {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export default function Memories() {
  const navigation = useNavigation()

  const { bottom, top } = useSafeAreaInsets()

  const [memories, setMemories] = useState<Memory[]>([])

  async function signOut() {
    await SecureStore.deleteItemAsync('token')

    navigation.navigate('home')
  }

  async function loadMemories() {
    try {
      const token = await SecureStore.getItemAsync('token')

      const response = await api.get('/memories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setMemories(response.data.memories)
    } catch (error) {
      console.log(error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadMemories()
    }, []),
  )

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top + 16 }}
    >
      <View className="flex-row items-center justify-between">
        <NLWLogo />
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
            onPress={() => navigation.navigate('new')}
          >
            <Icon name="plus" size={16} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {memories.map((memory) => {
        return (
          <View className="mt-6 space-y-10" key={memory.id}>
            <View className="space-y-4">
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-xs text-gray-100">
                  {
                    dayjs(memory.createdAt).format('D [de] MMMM, YYYY') // DD de MMMM, AAAA
                  }
                </Text>
              </View>
              <View className="space-y-4">
                {memory.coverUrl.split('.').pop() === 'mp4' ? (
                  <Video
                    className="aspect-video w-full rounded-lg object-cover"
                    source={{
                      uri: memory.coverUrl,
                    }}
                    resizeMode={ResizeMode.CONTAIN}
                  />
                ) : (
                  <Image
                    source={{
                      uri: memory.coverUrl,
                    }}
                    className="aspect-video w-full rounded-lg"
                    alt="Media preview"
                  />
                )}

                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </Text>

                <TouchableOpacity
                  className="flex-row items-center space-x-2"
                  onPress={() =>
                    navigation.navigate('memory', { id: memory.id })
                  }
                >
                  <Text className="font-body text-sm text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9E9EA0" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}
