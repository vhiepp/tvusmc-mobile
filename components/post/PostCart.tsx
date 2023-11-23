import { View, Text, ListRenderItem, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Ionicons, MaterialCommunityIcons, Octicons, SimpleLineIcons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'

interface Props {
  item: any
}

const PostCart: ListRenderItem<any> = ({ item }: Props) => {  
  return (
    <View style={styles.container}>
      <Link href={`/post/${item.slug}`} asChild >
        <TouchableOpacity activeOpacity={0.7} style={styles.content}>
          <Image source={{ uri: `https://tvusmc.com${item.thumb}` }} style={styles.image} />
          <TouchableOpacity style={[{ position: 'absolute', right: 8, top: 8 }, styles.iconShare]}>
            <MaterialCommunityIcons name="cards-heart-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.body}>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {/* <Ionicons name="star" size={16} /> */}
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    // gap: 10,
    marginVertical: 16,
  },
  content: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: "hidden"
  },
  image: {
    width: '100%',
    height: 270
  },
  iconShare: {
    // backgroundColor: "#fff",
    padding: 3,
    borderRadius: 10
  },
  body: {
    paddingHorizontal: 12,
    paddingVertical: 16
  },
  title: {
    fontSize: 16,
    fontFamily: 'mon-sb',
    textAlign: 'justify'
  },
  info: {
    textAlign: 'center',
    fontFamily: 'mon-sb',
    fontSize: 16,
    marginTop: 4,
  },
});

export default PostCart