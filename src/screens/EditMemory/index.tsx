import { View, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'

import Icon from '@expo/vector-icons/Feather'
import { MemoryForm } from '@components/MemoryForm'

import NLWLogo from '@assets/nlw-spacetime-logo.svg'
import { RoundButton } from '@components/RoundButton'

type MemoryProps = {
  id: string
  userId: string
  coverUrl: string
  content: string
  isPublic: boolean
  createdAt: string
}

type RouteParamsProps = {
  memory: MemoryProps
}

export function EditMemory() {
  const router = useRoute()
  const navigation = useNavigation()
  const { memory } = router.params as RouteParamsProps

  return (
    <ScrollView>
      <View className="px-8 py-4">
        <View className="flex-row items-center justify-between">
          <NLWLogo />
          <View className="flex-row">
            <RoundButton
              onPress={() => navigation.goBack()}
              variant="secondary"
            >
              <Icon name="x" size={16} color="#000" />
            </RoundButton>
          </View>
        </View>
        <MemoryForm type="edit" data={memory} />
      </View>
    </ScrollView>
  )
}
