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
import {
  Text,
  View,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native'

import ptBr from 'dayjs/locale/pt-br'

import { Button } from '@components/Button'
import { AppError } from '@utils/errors/AppError'
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

  const [isFetching, setIsFetching] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [memory, setMemory] = useState<MemoryProps>(null)

  async function fetchMemory() {
    try {
      setIsFetching(true)
      const response = await api.get(`/memories/${id}`)

      const { memory } = response.data

      setMemory(memory)
    } catch (error) {
      const isAppError = error instanceof AppError
      const errorTitle = isAppError ? 'Requisição' : 'Erro'
      const errorMessage = isAppError
        ? error.message
        : 'Ocorreu um erro ao carregar a memória, tente novamente mais tarde.'

      Alert.alert(errorTitle, errorMessage)
    } finally {
      setIsFetching(false)
    }
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
      setIsDeleting(true)
      await api.delete(`/memories/${id}`)

      navigation.navigate('memories')
    } catch (error) {
      const isAppError = error instanceof AppError
      const errorTitle = isAppError ? 'Requisição' : 'Erro'
      const errorMessage = isAppError
        ? error.message
        : 'Ocorreu um erro ao excluir a memória, tente novamente mais tarde.'

      Alert.alert(errorTitle, errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchMemory()
    }, []),
  )

  if (isFetching && !memory) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#8257e5" />
      </View>
    )
  }

  if (!memory) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="font-body text-gray-100">Memória não encontrada</Text>
      </View>
    )
  }

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

          <Text
            selectable
            className="font-body text-base leading-relaxed text-gray-100"
          >
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
            isLoading={isDeleting}
            title="Excluir"
            variant="secondary"
          />
        </View>
      </View>
    </ScrollView>
  )
}
