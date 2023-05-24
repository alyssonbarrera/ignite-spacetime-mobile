import { api } from '@libs/api'

export async function createMemory({ content, coverUrl, isPublic }) {
  await api.post('/memories', {
    content,
    coverUrl,
    isPublic,
  })
}
