import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { useCallback, useState } from 'react'
import Icon from '@expo/vector-icons/Feather'
import { View, Text, FlatList, Alert, ActivityIndicator } from 'react-native'
import { Link, useNavigation, useFocusEffect } from '@react-navigation/native'

import { api } from '@libs/api'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/errors/AppError'

import { MemoryCard } from '@components/MemoryCard'
import { RoundButton } from '@components/RoundButton'

import NLWLogo from '@assets/nlw-spacetime-logo.svg'

dayjs.locale(ptBr)

type Memory = {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export function Memories() {
  const { signOut } = useAuth()
  const navigation = useNavigation()

  const [isFetching, setIsFetching] = useState(false)
  const [memories, setMemories] = useState<Memory[]>([])

  async function loadMemories() {
    try {
      setIsFetching(true)
      const response = await api.get('/memories')

      setMemories(response.data.memories)
    } catch (error) {
      const isAppError = error instanceof AppError
      const errorTitle = isAppError ? 'Requisição' : 'Erro'
      const errorMessage = isAppError
        ? error.message
        : 'Ocorreu um erro ao carregar suas memórias, tente novamente mais tarde.'

      Alert.alert(errorTitle, errorMessage)
    } finally {
      setIsFetching(true)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadMemories()
    }, []),
  )

  if (isFetching && memories.length === 0) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#8257e5" />
      </View>
    )
  }

  return (
    <View className="flex-1 px-8 pt-4">
      <View className="flex-row items-center justify-between">
        <NLWLogo />
        <View className="flex-row gap-2">
          <RoundButton onPress={signOut} variant="secondary">
            <Icon name="log-out" size={16} color="#000" />
          </RoundButton>

          <RoundButton
            onPress={() => navigation.navigate('new')}
            variant="primary"
          >
            <Icon name="plus" size={16} color="#000" />
          </RoundButton>
        </View>
      </View>

      {memories.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-center font-body text-base text-gray-100">
            Você ainda não registrou nenhuma lembrança, comece a{' '}
            <Link
              to="/new"
              style={{
                textDecorationLine: 'underline',
              }}
            >
              criar agora!
            </Link>
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={memories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MemoryCard memory={item} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  )
}
