import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser'
import Colors from '@/constants/Colors'
import { TextInput } from 'react-native-gesture-handler'
import { defaultStyles } from '@/constants/Styles'
import { useAuth, useOAuth } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import * as WebBrowser from "expo-web-browser"
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session'
import { jwtDecode } from 'jwt-decode'

enum Strategy {
  Google = 'oauth_google'
}

WebBrowser.maybeCompleteAuthSession();

const Page = () => {
  const router = useRouter()
  
  useWarmUpBrowser()

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google'})

  const onSelectAuth = useCallback(async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth()
      
      if (createdSessionId) {
        await setActive!({ session: createdSessionId })        
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])

  // Endpoint
  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/common/v2.0',
  );
  const redirectUri = makeRedirectUri({
    scheme: undefined,
    path: 'login',
  });
  const clientId = process.env.EXPO_PUBLIC_MICROSOFT_CLIENT_ID || ''

  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri,
    },
    discovery,
  );

  const handleLoginMicrosoft = async () => {
    promptAsync().then((codeResponse) => {
      if (request && codeResponse?.type === 'success' && discovery) {
        exchangeCodeAsync(
          {
            clientId,
            code: codeResponse.params.code,
            extraParams: request.codeVerifier
              ? { code_verifier: request.codeVerifier }
              : undefined,
            redirectUri,
          },
          discovery,
        ).then((res) => {

          const {email}: {email: string} = jwtDecode(res.idToken!)

          const user: {family_name: string} = jwtDecode(res.accessToken!);
          console.log(user);
          
        });
      }
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
      />

      <TouchableOpacity style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>or</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>

      <View style={{ gap: 20 }}>
        <TouchableOpacity style={styles.btnOutline} onPress={handleLoginMicrosoft}>
          <Image source={require('@/assets/images/icon/microsoft.png')} style={[defaultStyles.btnIcon, styles.btnIcon]} />
          <Text style={styles.btnOutlineText}>Đăng nhập với Microsoft</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Google)}>
          <Image source={require('@/assets/images/icon/google.png')} style={[defaultStyles.btnIcon, styles.btnIcon]} />
          <Text style={styles.btnOutlineText}>Đăng nhập với Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26,
  },
  seperatorView: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  seperator: {
    fontFamily: 'mon-sb',
    color: Colors.grey,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  btnIcon: {
    width: 22,
    height: 22
  }
})

export default Page