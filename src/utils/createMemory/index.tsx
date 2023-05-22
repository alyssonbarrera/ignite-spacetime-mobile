import { api } from '@libs/api'
import * as SecureStore from 'expo-secure-store'

export async function createMemory({ content, coverUrl, isPublic }) {
  const token = await SecureStore.getItemAsync('token')

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
}
