import { api } from '@libs/api'
import * as SecureStore from 'expo-secure-store'

export async function editMemory({ id, content, coverUrl, isPublic }) {
  const token = await SecureStore.getItemAsync('token')

  await api.put(
    `/memories/${id}`,
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
