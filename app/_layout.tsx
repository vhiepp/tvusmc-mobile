import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as SecureStore from 'expo-secure-store';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import useRedirectLogin from '@/hooks/useRedirectLogin';

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'mon': require('../assets/fonts/Montserrat-Regular.ttf'),
    'mon-sb': require('../assets/fonts/Montserrat-SemiBold.ttf'),
    'mon-b': require('../assets/fonts/Montserrat-Bold.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY!}>
      <RootLayoutNav />
    </ClerkProvider>
  )
}

function RootLayoutNav() {
  const router = useRouter()
  const { redirectToLogin } = useRedirectLogin()
  const { isLoaded, isSignedIn } = useAuth()

  useEffect(() => {    
    if (isLoaded && !isSignedIn) {
      redirectToLogin('/')
    }
  }, [isLoaded])

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(modals)/login"
        options={{
          title: 'Đăng nhập',
          presentation: 'modal',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'mon-sb'
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-circle-outline" size={28} color={Colors.grey} />
            </TouchableOpacity>
          ),
          animation: 'slide_from_right'
        }}
      />

      <Stack.Screen
        name="(modals)/search"
        options={{
          title: 'Tìm kiếm',
          presentation: 'transparentModal',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'mon-sb'
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back-circle-outline" size={28} color={Colors.grey} />
            </TouchableOpacity>
          ),
          animation: 'fade'
        }}
      />

      <Stack.Screen
        name="(modals)/youtube/[id]"
        options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerTransparent: true,
          headerShown: false
        }}
      />

      <Stack.Screen
        name="post/[slug]"
        options={{
          headerTitle: '',
          animation: 'flip'
        }}
      />

      <Stack.Screen 
        name='oauth-native-callback'
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}
