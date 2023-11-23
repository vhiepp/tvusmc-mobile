import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Colors from '@/constants/Colors'
import WebView from 'react-native-webview'

const INJECTED_JAVASCRIPT = `(function() {
  const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);
})();`

const Page = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams<{id: string}>()

  const handleCloseModal = () => {
    router.back()
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={1} style={styles.backgroundTouchable} onPress={handleCloseModal}></TouchableOpacity>
      <View style={styles.ytbContent}>
        {
          <WebView
            style={{backgroundColor: Colors.dark}}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            injectedJavaScript={INJECTED_JAVASCRIPT}
            automaticallyAdjustContentInsets={true}
            scalesPageToFit={false}
            scrollEnabled={false}
            source={{uri: `https://www.youtube.com/embed/${id}?autoplay=1`}}
          />
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    backgroundColor: Colors.dark,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ytbContent: {
    height: 260,
    width: '100%',
    backgroundColor: Colors.dark,
  },
  backgroundTouchable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.9
  }
})

export default Page