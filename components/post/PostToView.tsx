import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constants/Colors'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import * as WebBrowser from "expo-web-browser"

interface Props {
  post: any
}

interface ElementPostList {
  youtubeList: string[] | never[],
  paragrapList: string[] | never[],
  linkList: string[] | never[]
}

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

var DomParser = require('react-native-html-parser').DOMParser

const PostToView = ({post}: Props) => {
  useWarmUpBrowser()
  const [elementPostList, setElementPostList] = useState<ElementPostList>({
    youtubeList: [],
    paragrapList: [],
    linkList: []
  })
  
  useEffect(() => {    
    try {
      if (post.content) {
        let doc = new DomParser().parseFromString(`${post.content}`,'text/html')
        let pList: any[] = []
        let yList: any[] = []
        let aList: any[] = []
        for (let i = 0; i < doc.getElementsByTagName('p').length; i++) {
          pList.push(doc.getElementsByTagName('p')[i]?.textContent)
        }    
        for (let i = 0; i < doc.querySelect('iframe').length; i++) {
          const parts = doc.querySelect('iframe')[i].getAttribute('src').split('/');
          const videoId = parts.pop().split('?')[0];
          yList.push(videoId)
        }
        for (let i = 0; i < doc.querySelect('a').length; i++) {
          const parts = doc.querySelect('a')[i].getAttribute('href')
          aList.push(parts)
        }        
        setElementPostList({
          youtubeList: yList,
          paragrapList: pList,
          linkList: aList
        })
      }
    }catch (error) {
      console.log(error);
      
    }
  }, [post])

  const handleOpenLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url)
    } catch (error) {console.log(error)}
  }
  
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{post.title}</Text>
      <Text style={styles.rooms}>
        Đăng ngày {post.created_time}
      </Text>
      <View style={styles.divider} />
      <View style={styles.hostView}>
        <Image source={{uri: post.author?.avatar}} style={styles.host} />
        <View>
          <Text style={{ fontWeight: '500', fontSize: 16 }}>{post.author?.name}</Text>
          <Text>{post.author?.email}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={{marginHorizontal: -20}}>
        {
          elementPostList.youtubeList.length > 0 &&
          elementPostList.youtubeList.map((yId: string, index: number) => (
            <Link href={`/youtube/${yId}`} key={yId} asChild>
              <TouchableOpacity activeOpacity={0.8}>
                <View style={{ width: '100%', height: 220, marginTop: 10, position: 'relative' }}>
                  <View style={styles.viewPlayYTB}>
                    <Entypo style={styles.iconPlayYTB} name="youtube-with-circle"/>
                  </View>
                  <Image style={{width: '100%', height: '100%'}} source={{uri: `https://img.youtube.com/vi/${yId}/0.jpg`}} />
                </View>
              </TouchableOpacity>
            </Link>
          ))
        }
      </View>
      <View>
        {
          elementPostList.paragrapList.length > 0 &&
          elementPostList.paragrapList.map((p: any, index: number) => <Text style={styles.description} key={index + Math.random()}>{p}</Text>)
        }
      </View>
      {
        elementPostList.linkList.length > 0 && 
        <View style={{marginTop: 50}}>
          <Text style={[styles.description, {fontStyle: 'italic', marginBottom: 2}]}>Liên kết:</Text>
          {
            elementPostList.linkList.map((p: any, index: number) => (<Text style={{marginVertical: 5}} key={index + Math.random()} onPress={async () => await handleOpenLink(p)}>
              ({index + 1}) <Text style={{color: '#00adea'}}>{p}</Text>
            </Text>))
          }
        </View>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'mon-sb',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'mon-sb',
  },
  rooms: {
    fontSize: 13,
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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },

  description: {
    fontSize: 16,
    marginTop: 24,
    fontFamily: 'mon',
    textAlign: 'justify'
  },
  viewPlayYTB: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark,
  },
  iconPlayYTB: {
    color: '#ff0000',
    fontSize: 45,
    borderRadius: 40,
    padding: 0,
    backgroundColor: '#fff'
  }
});

export default PostToView