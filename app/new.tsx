import { useState } from 'react'
import { useNavigation } from 'expo-router'
import { Video, ResizeMode } from 'expo-av'
import Icon from '@expo/vector-icons/Feather'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import {
  View,
  Switch,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native'

import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { api } from '@libs/api'
import NLWLogo from '@assets/nlw-spacetime-logo.svg'

type MediaProps = {
  preview: string
  type: string
  name: string
}
export default function NewMemory() {
  const navigation = useNavigation()

  const { bottom, top } = useSafeAreaInsets()

  const [media, setMedia] = useState<MediaProps | null>(null)
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)
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

  async function handleCreateMemory() {
    try {
      setLoading(true)

      if (!content && !media) {
        return Alert.alert(
          'Memória',
          'É necessário preencher todos os campos para criar uma memória.',
        )
      }

      const token = await SecureStore.getItemAsync('token')

      let coverUrl = ''

      if (media) {
        const uploadFormData = new FormData()

        uploadFormData.append('file', {
          uri: media.preview,
          name: media.name,
          type: media.type,
        } as any)

        const uploadResponse = await api.post('/upload', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        coverUrl = uploadResponse.data.fileUrl

        await api.post(
          '/memories',
          {
            content,
            coverUrl,
            isPublic,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        navigation.navigate('memories')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top + 16 }}
    >
      <View className="flex-row items-center justify-between">
        <NLWLogo />

        <TouchableOpacity
          className="h-10 w-10 items-center justify-center rounded-full bg-purple-500"
          onPress={() => navigation.navigate('memories')}
        >
          <Icon name="arrow-left" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: '#767577', true: '#372560' }}
            thumbColor={isPublic ? '#9b79ea' : '#9E9EA0'}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openImagePicker}
          className="mb-4 h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {media ? (
            media.type === 'video' ? (
              <Video
                className="aspect-video w-full rounded-lg object-cover"
                source={{
                  uri: media.preview,
                }}
                useNativeControls={false}
                shouldPlay
                resizeMode={ResizeMode.CONTAIN}
              />
            ) : (
              <Image
                source={{
                  uri: media.preview,
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
          value={content}
          onChangeText={setContent}
          inputMode="text"
          className="text-md p-0 font-body text-gray-50"
          placeholderTextColor="#56565A"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <TouchableOpacity
          onPress={handleCreateMemory}
          activeOpacity={0.8}
          className="items-center self-end rounded-full bg-green-500 px-5 py-3"
          disabled={loading}
          style={{ opacity: loading ? 0.5 : 1 }}
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
