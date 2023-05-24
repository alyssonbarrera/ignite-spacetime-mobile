import Icon from '@expo/vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { View, TouchableOpacity, ScrollView } from 'react-native'

import { MemoryForm } from '@components/MemoryForm'

import NLWLogo from '@assets/nlw-spacetime-logo.svg'

export function NewMemory() {
  const navigation = useNavigation()

  return (
    <ScrollView className="flex-1">
      <View className="px-8 py-4">
        <View className="flex-row items-center justify-between">
          <NLWLogo />

          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-purple-500"
            onPress={() => navigation.navigate('memories')}
          >
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <MemoryForm type="create" />
      </View>
    </ScrollView>
  )
}
