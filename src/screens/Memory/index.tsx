import dayjs from 'dayjs'
import { api } from '@libs/api'
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native'
import { Video, ResizeMode } from 'expo-av'
import Icon from '@expo/vector-icons/Feather'
import { useState, useCallback } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Text, View, Alert, Image, ScrollView } from 'react-native'

import ptBr from 'dayjs/locale/pt-br'

import { Button } from '@components/Button'
import { RoundButton } from '@components/RoundButton'

import NLWLogo from '@assets/nlw-spacetime-logo.svg'

dayjs.locale(ptBr)

type RouteParamsProps = {
  id: string
}

type MemoryProps = {
  id: string
  userId: string
  coverUrl: string
  content: string
  isPublic: boolean
  createdAt: string
}

export function Memory() {
  const router = useRoute()
  const navigation = useNavigation()
  const { id } = router.params as RouteParamsProps
  const [memory, setMemory] = useState<MemoryProps>(null)

  async function fetchMemory() {
    const token = await SecureStore.getItemAsync('token')
    const response = await api.get(`/memories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const { memory } = response.data

    setMemory(memory)
  }

  async function handleDeleteMemory() {
    Alert.alert('Memória', 'Deseja mesmo excluir essa memória?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Excluir',
        onPress: deleteMemory,
      },
    ])
  }

  async function deleteMemory() {
    try {
      const token = await SecureStore.getItemAsync('token')
      await api.delete(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      navigation.navigate('memories')
    } catch (error) {
      Alert.alert(
        'Memória',
        'Não foi possível excluir a memória. Tente novamente mais tarde.',
      )
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchMemory()
    }, []),
  )

  if (!memory) return null

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-8">
      <View className="flex-1 space-y-4 py-4">
        <View className="flex-row items-center justify-between">
          <NLWLogo />
          <View className="space-y-2">
            <View className="flex-row gap-2">
              <RoundButton
                onPress={() => navigation.navigate('memories')}
                variant="tertiary"
              >
                <Icon name="arrow-left" size={16} color="#FFF" />
              </RoundButton>
            </View>
          </View>
        </View>
        <View className="flex-row items-center space-x-2">
          <Icon name="eye" size={14} color="#bebebf" />
          <Text className="font-body text-sm text-gray-100">
            {memory.isPublic ? 'memória pública' : 'memória privada'}
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
              useNativeControls
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
            {memory.content}
          </Text>
        </View>
        <View className="flex-1 flex-row space-x-2 self-end pt-6">
          <Button
            onPress={() => navigation.navigate('edit', { memory })}
            title="Editar"
          />
          <Button
            onPress={handleDeleteMemory}
            title="Excluir"
            variant="secondary"
          />
        </View>
      </View>
    </ScrollView>
  )
}
