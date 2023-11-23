import { SignedIn, SignedOut, useAuth, useUser } from '@clerk/clerk-expo'
import useRedirectLogin from '@/hooks/useRedirectLogin'
import { Text, ScrollView, Dimensions, Share, StyleSheet, View, TouchableOpacity, Image, Button } from 'react-native'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles'
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { useUserStateContext } from '@/contexts/UserContextProvider'

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 280;

const Page = () => {
  const { redirectToLogin } = useRedirectLogin()
  const router = useRouter()
  const { user, removeUserInfo } = useUserStateContext()
  const navigation = useNavigation()
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const [userThumbnailUrl, setUserThumbnailUrl] = useState<string | null>(null)
  
  useEffect(() => {
    SecureStore.getItemAsync(process.env.EXPO_PUBLIC_KEY_STORE_USER_THUMBNAIL!).then(res => {
      setUserThumbnailUrl(res || 'https://mega.com.vn/media/news/2006_hinh-nen-sky-galaxy-laptop66.jpg')
    })
  }, [])
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
      ),
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton} activeOpacity={0.5}>
            <Ionicons name="search" size={20} color="black" />
          </TouchableOpacity>
        </View>
      )
    })
  }, [])

  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
      }
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: false,
    });
    if (!result.canceled) {
      SecureStore.setItemAsync(process.env.EXPO_PUBLIC_KEY_STORE_USER_THUMBNAIL!, result.assets[0].uri)
      setUserThumbnailUrl(result.assets[0].uri)
    }
    
  };

  const handleOnPressLoginButton = () => {
    redirectToLogin('/(tabs)/account')
  }

  const handleLogout = () => {
    removeUserInfo()
  } 

  return (
    <View style={styles.container} >
      <Animated.ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        ref={scrollRef}
        scrollEventThrottle={16}>
        <Animated.Image
          source={{uri: userThumbnailUrl!}}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <TouchableOpacity style={styles.btnChangeThumbnail} activeOpacity={0.7} onPress={pickImage}>
            <Ionicons name="ios-camera-outline" size={21} color="black" />
          </TouchableOpacity>
          <View style={styles.boxAvatar}>
            <TouchableOpacity style={styles.btnChangeAvatar} activeOpacity={0.7}>
              <Ionicons name="ios-camera" size={24} color="black" />
            </TouchableOpacity>
            {
              // @ts-ignore
              <Image style={styles.avatar} source={{uri: user?.avatar || 'https://tvusmc.com/assets/img/avt/default.jpg'}} />
            }
          </View>
          {
            // @ts-ignore
            <Text style={styles.name}>{user?.name}</Text>
          }
          <Text style={styles.description}>Nắm bắt xu thế - Phát triển đam mê</Text>
        </View>

        <View style={{height: 500, backgroundColor: '#fff'}}>
          {
            user && 
            <Button title='Đăng xuất' onPress={handleLogout}/>
          }
          {
            !user &&
            <Button title='Đăng nhập' onPress={handleOnPressLoginButton}/>
          }
        </View>

      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // paddingHorizontal:
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 24,
    fontFamily: 'mon',
    marginTop: 2
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'mon-sb',
  },
  rooms: {
    fontSize: 16,
    color: Colors.grey,
    marginVertical: 4,
    fontFamily: 'mon',
  },
  ratings: {
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'mon-sb',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16
  },
  header: {
    backgroundColor: '#fff',
    height: defaultStyles.header.height,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
    paddingVertical: 10
  },
  description: {
    fontSize: 14,
    fontFamily: 'mon',
  },
  infoContainer: {
    position: 'relative',
    minHeight: 200,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 20
  },
  boxAvatar: {
    width: 130,
    height: 130,
    borderRadius: 100,
    position: 'absolute',
    left: 16,
    top: -95,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    }
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  btnChangeAvatar: {
    position: 'absolute',
    zIndex: 10,
    bottom: 4,
    right: 4,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    }
  },
  btnChangeThumbnail: {
    position: 'absolute',
    zIndex: 10,
    top: -46,
    right: 16,
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    }
  }
})

export default Page