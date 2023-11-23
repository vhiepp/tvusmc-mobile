import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Page = () => {
  const {token} = useLocalSearchParams()
  return (
    <View>
      <Text>{token}</Text>
    </View>
  )
}

export default Page