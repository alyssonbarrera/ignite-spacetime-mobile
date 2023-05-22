/* eslint-disable no-unused-vars */
type MemoryProps = {
  id: string
  userId: string
  coverUrl: string
  content: string
  isPublic: boolean
  createdAt: string
}

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined
      memories: undefined
      new: undefined
      memory: { id: string }
      edit: { memory: MemoryProps }
    }
  }
}
