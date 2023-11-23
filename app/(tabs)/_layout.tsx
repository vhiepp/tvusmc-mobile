import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Colors from '@/constants/Colors'
import { Octicons } from '@expo/vector-icons'

const Layout = () => {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.primary,
      tabBarLabelStyle: {
        fontFamily: "mon-sb"
      },
      tabBarIconStyle: {
        fontSize: 1
      }
    }}>

      <Tabs.Screen
        name='index'
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, size }) => <Octicons name="home" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name='event'
        options={{
          tabBarLabel: 'Sự kiện',
          tabBarIcon: ({ color, size }) => <Octicons name="calendar" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name='job'
        options={{
          tabBarLabel: 'Công việc',
          tabBarIcon: ({ color, size }) => <Octicons name="device-camera-video" size={size} color={color} />
        }}
      />

      <Tabs.Screen
        name='account'
        options={{
          tabBarLabel: 'Bạn',
          tabBarIcon: ({ color, size }) => <Octicons name="person" size={size} color={color} />
        }}
      />

    </Tabs>
  )
}

export default Layout