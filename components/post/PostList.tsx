import { View, Text, FlatList, FlatListProps } from 'react-native'
import React, { useEffect, useState } from 'react'
import { defaultStyles } from '@/constants/Styles'
import PostCart from './PostCart'
import Colors from '@/constants/Colors'

interface Props {
  postList: any[],
  onLoadMore?: any,
  isPageEnd?: boolean,
  isPageFirst?: boolean
}

export const PostList = ({ postList, onLoadMore, isPageEnd, isPageFirst }: Props) => {

  const handleLoadMore = async () => {
    if (!isPageEnd && !isPageFirst) {
      onLoadMore()
    }
  }

  return (
    <View style={defaultStyles.container}>
      <FlatList
        ListFooterComponent={() => {
          return (<View style={{paddingBottom: 40, justifyContent: 'center', alignItems: 'center', opacity: 0.2}}>
            {
              isPageEnd &&
              <Text style={{fontSize: 14, fontStyle: 'italic', paddingTop: 10, color: Colors.grey}}>Đã hiển thị tất cả bài viết!</Text>
            }
          </View>)
        }}
        renderItem={PostCart}
        data={postList}
        keyExtractor={(item, index) => index.toString()}
        // onEndReachedThreshold={5}
        onEndReached={handleLoadMore}
      />
    </View>
  )
}