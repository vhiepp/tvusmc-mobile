import { useEffect } from 'react'
import useRedirectLogin from '@/hooks/useRedirectLogin'
import { useUser } from '@clerk/clerk-expo'
import { StyleSheet, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { useUserStateContext } from '@/contexts/UserContextProvider'

const Page = () => {
  const { callback } = useRedirectLogin()
  // const { user } = useUser()
  const {user} = useUserStateContext()

  useEffect(() => {
    if (user) {      
      callback()
    } 
  }, [user])

  return (
    <View style={styles.container}>
      <Spinner visible={true} textContent='Welcome to SMC...' textStyle={styles.textSpinner} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textSpinner: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#ccc'
  }
})

export default Page