import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'
import { View, Text, FlatList, Alert } from 'react-native'
import { Link, useNavigation, useFocusEffect } from '@react-navigation/native'

import ptBr from 'dayjs/locale/pt-br'

import { api } from '@libs/api'
import { MemoryCard } from '@components/MemoryCard'

import NLWLogo from '@assets/nlw-spacetime-logo.svg'
import { RoundButton } from '@components/RoundButton'

dayjs.locale(ptBr)

type Memory = {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export function Memories() {
  const navigation = useNavigation()

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
      Alert.alert(
        'Memórias',
        'Ocorreu um erro ao carregar suas memórias, tente novamente mais tarde.',
      )
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadMemories()
    }, []),
  )

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
