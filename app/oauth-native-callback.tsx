import { useEffect } from 'react'
import useRedirectLogin from '@/hooks/useRedirectLogin'
import { useUser } from '@clerk/clerk-expo'
import { StyleSheet, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'

const Page = () => {
  const { callback } = useRedirectLogin()
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      console.log(user.lastName);
      
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