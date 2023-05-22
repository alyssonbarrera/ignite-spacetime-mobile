import { useState } from 'react'
import { Video, ResizeMode } from 'expo-av'
import Icon from '@expo/vector-icons/Feather'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native'

import {
  View,
  Switch,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native'

import { upload } from '@utils/upload'
import { Button } from '@components/Button'
import { editMemory } from '@utils/editMemory'
import { createMemory } from '@utils/createMemory'

type MemoryFormProps = {
  type: 'create' | 'edit'
  data?: {
    id: string
    userId: string
    coverUrl: string
    content: string
    isPublic: boolean
    createdAt: string
  } | null
}

type MediaProps = {
  preview: string
  type: string
  name: string
}

export function MemoryForm({ type, data }: MemoryFormProps) {
  const navigation = useNavigation()

  const [media, setMedia] = useState<MediaProps | null>(null)
  const [content, setContent] = useState(type === 'edit' ? data?.content : null)
  const [isPublic, setIsPublic] = useState(
    type === 'edit' ? data?.isPublic : false,
  )
  const [loading, setLoading] = useState(false)

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      })

      if (result.canceled) {
        return
      }

      if (result.assets[0]) {
        const mediaInfo = await FileSystem.getInfoAsync(result.assets[0].uri)

        if (mediaInfo.size && mediaInfo.size / (1024 * 1024) > 50) {
          // 50MB
          return Alert.alert(
            'Mídia',
            'O arquivo selecionado é muito grande, por favor selecione um arquivo de até 50MB.',
          )
        }

        const fileExtension = result.assets[0].uri.split('.').pop()

        const mediaFile = {
          name: `media.${fileExtension}`.toLowerCase(),
          uri: result.assets[0].uri,
          type: `${result.assets[0].type}/${fileExtension}`,
        }

        setMedia({
          preview: mediaFile.uri,
          type: mediaFile.type,
          name: mediaFile.name,
        })
      }
    } catch (error) {
      Alert.alert(
        'Mídia',
        'Erro ao selecionar mídia, por favor tente novamente.',
      )
    }
  }

  async function handleMemory() {
    let coverUrl: string

    if (type === 'create' && (!content || !media)) {
      return Alert.alert(
        'Memória',
        'É necessário preencher todos os campos para criar uma memória.',
      )
    }

    setLoading(true)

    if (media) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: media.preview,
        name: media.name,
        type: media.type,
      } as any)

      coverUrl = await upload(uploadFormData).catch(() => {
        Alert.alert(
          'Memória',
          'Erro ao fazer upload da mídia, por favor tente novamente.',
        )
      })
    }

    if (type === 'create') {
      try {
        await createMemory({
          content,
          coverUrl,
          isPublic,
        })

        navigation.navigate('memories')
      } catch (error) {
        Alert.alert(
          'Memória',
          'Erro ao criar memória, por favor tente novamente.',
        )
      } finally {
        setLoading(false)
      }
    }

    if (type === 'edit') {
      try {
        await editMemory({
          id: data?.id,
          content,
          coverUrl,
          isPublic,
        })

        navigation.navigate('memory', { id: data?.id })
      } catch (error) {
        Alert.alert(
          'Memória',
          'Erro ao editar memória, por favor tente novamente.',
        )
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <View className="mt-2 flex-1 space-y-4">
      <View className="flex-row items-center gap-2">
        <Switch
          value={isPublic}
          onValueChange={setIsPublic}
          trackColor={{ false: '#767577', true: '#372560' }}
          thumbColor={isPublic ?? data?.isPublic ? '#9b79ea' : '#9E9EA0'}
        />
        <Text className="font-body text-base text-gray-200">
          Memória pública
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={openImagePicker}
        className="min-h-[180px] items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
      >
        {media || data?.coverUrl ? (
          media?.type === 'video' ||
          data?.coverUrl.split('/').pop().includes('mp4') ? (
            <Video
              className="aspect-video w-full rounded-lg object-cover"
              source={{
                uri: media?.preview ?? data?.coverUrl,
              }}
              useNativeControls={false}
              shouldPlay
              resizeMode={ResizeMode.CONTAIN}
            />
          ) : (
            <Image
              source={{
                uri: media?.preview || data?.coverUrl,
              }}
              alt="Image preview"
              className="aspect-video w-full rounded-lg object-cover"
            />
          )
        ) : (
          <View className="flex-row items-center gap-2">
            <Icon name="image" color="#FFF" />
            <Text className="font-body text-sm text-gray-200">
              Adicionar foto ou vídeo de capa
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        multiline
        textAlignVertical="top"
        value={content ?? data?.content}
        onChangeText={setContent}
        inputMode="text"
        className="p-0 pb-6 font-body text-base text-gray-50"
        placeholderTextColor="#56565A"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
      />
      <View className="self-end">
        {type === 'edit' ? (
          <Button
            onPress={handleMemory}
            isLoading={loading}
            title="salvar alterações"
          />
        ) : (
          <Button onPress={handleMemory} isLoading={loading} title="salvar" />
        )}
      </View>
    </View>
  )
}
