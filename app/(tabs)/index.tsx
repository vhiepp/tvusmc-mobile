import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import SearchHeader from '@/components/SearchHeader'
import { PostList } from '@/components/post'
import { defaultStyles } from '@/constants/Styles'
import { axiosClient } from '@/api'

const Page = () => {
  const [postList, setPostList] = useState([])
  const [apiPostList, setApiPostList] = useState('blogs/gets')


  useEffect(() => {
    try {
      handleGetPostList()
    } catch (error) {}
  }, [])

  const handleGetPostList = async () => {
    // console.log("get post");
    if (apiPostList) {
      const { data } = await axiosClient.post(apiPostList)
      setApiPostList(data.next_page_url)
      // @ts-ignore
      setPostList(prev => [...prev, ...data.data])
    }
  }

  return (
    <View style={{ flex: 1, marginTop: defaultStyles.header.height }}>
      <Stack.Screen 
        options={{
          header: () => <SearchHeader />,
        }}
      />
      <PostList postList={postList} isPageEnd={apiPostList === null} isPageFirst={postList.length === 0} onLoadMore={handleGetPostList}/>
    </View>
  )
}

export default Page