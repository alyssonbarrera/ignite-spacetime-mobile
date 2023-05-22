import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { Video, ResizeMode } from 'expo-av'
import { useNavigation } from '@react-navigation/native'
import Icon from '@expo/vector-icons/Feather'
import { View, TouchableOpacity, Text, Image } from 'react-native'

dayjs.locale(ptBr)

type Memory = {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export function MemoryCard({ memory }: { memory: Memory }) {
  const navigation = useNavigation()
  return (
    <View className="my-4 space-y-4">
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
          onPress={() => navigation.navigate('memory', { id: memory.id })}
        >
          <Text className="font-body text-sm text-gray-200">Ler mais</Text>
          <Icon name="arrow-right" size={16} color="#9E9EA0" />
        </TouchableOpacity>
      </View>
    </View>
  )
}
