import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';

const SearchHeader = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          <Link href={'/(modals)/search'} asChild>
            <TouchableOpacity>
              <View style={styles.searchBtn}>
                <Ionicons name="search" size={24} />
                <View>
                  <Text style={{ fontFamily: 'mon-sb' }}>Search...?</Text>
                  <Text style={{ color: Colors.grey, fontFamily: 'mon', fontSize: 12 }}>Welcome to TVU SMC</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href={'/(tabs)/account'} asChild>
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.6}>
              <Octicons name="person" size={30} color='#ccc' style={{width: 42, height: 42, textAlign: 'center', lineHeight: 42}} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: '#fff',
    height: defaultStyles.header.height,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
    paddingTop: Platform.OS === 'android' ? 36 : 0
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },

  searchBtn: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    width: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: '#A2A0A2',
    borderRadius: 100,
    backgroundColor: '#cccccc30',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default SearchHeader