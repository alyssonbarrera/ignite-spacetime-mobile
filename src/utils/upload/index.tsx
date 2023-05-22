import { api } from '@libs/api'

export async function upload(file: FormData) {
  const uploadResponse = await api.post('/upload', file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  const coverUrl = uploadResponse.data.fileUrl

  return coverUrl
}
