import { View, Text } from 'react-native'
import React from 'react'
import { Href, Route, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store';

const callbackUrlKey = 'callback-login-url'

export default function useRedirectLogin() {
  const router = useRouter()
  const redirectToLogin = async (callbackUrl: Route<string>) => {
    SecureStore.setItemAsync(callbackUrlKey, callbackUrl)
    router.push('/(modals)/login')
  }
  const callback = async () => {
    const url = await SecureStore.getItemAsync(callbackUrlKey)
    if (url) {
      SecureStore.deleteItemAsync(callbackUrlKey)
      // @ts-ignore
      router.push(url)
    }
  }

  return {redirectToLogin, callback}
}