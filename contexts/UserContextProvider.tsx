import { createContext, useState, useContext, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'

interface Props {
    children: any
}

const StateContext = createContext({
    user: null,
    setUser: () => {},
    setUserInfo: () => {},
    isLoad: false,
    removeUserInfo: () => {}
})

export const ContextProvider = ({ children }: Props) => {
    const [user, setUser] = useState<any>()
    const [isLoad, setIsLoad] = useState(false)

    useEffect(() => {
        checkUser()
    }, [])

    const checkUser = async () => {
        if (!user) {
        await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_KEY_STORE_USER_INFO!).then((res) => {
            if (res) {
            setUser(JSON.parse(res!))
            }
            setIsLoad(true)
        })
        }
    }

    const setUserInfo = (user: any) => {
        if (user) {
            SecureStore.setItemAsync(process.env.EXPO_PUBLIC_KEY_STORE_ACCESSTOKEN!, JSON.stringify(user.token))
            SecureStore.setItemAsync(process.env.EXPO_PUBLIC_KEY_STORE_USER_INFO!, JSON.stringify(user.user))
            setUser(user.user)
            setIsLoad(false)
        }
    }    

    const removeUserInfo = async () => {
        SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_KEY_STORE_USER_INFO!)
        SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_KEY_STORE_ACCESSTOKEN!)
        // @ts-ignore
        setUser(null)
    }

    return (
        <StateContext.Provider value={{
            user,
            // @ts-ignore
            setUser,
            // @ts-ignore
            setUserInfo,
            isLoad,
            removeUserInfo
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useUserStateContext = () => useContext(StateContext)