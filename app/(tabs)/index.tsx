import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { logoutApp, Token, getTokenFromStorage } from '@/services/authServices';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { jwtDecode } from 'jwt-decode';


export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [getToken, setGetToken] = useState<Token | null>(null);

  useEffect(() => {
    const fetchTokenAndDecode = async () => {
      try {
        const token = await getTokenFromStorage();
        if (token) {
          const decoded: Token = jwtDecode(token);
          setGetToken(decoded);
        }
      } catch (error) {
        console.error('Failed to retrieve or decode token:', error);
      }
    };

    fetchTokenAndDecode();
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutApp());
      router.replace('/(auth)');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <SafeAreaView className='p-4 flex-1 justify-center bg-black'>
      <View >
        <Text className='text-green-500 text-xl'>Selamat datang <Text className='text-white'>{getToken?.username || 'User'}</Text></Text>
      </View>
      <TouchableOpacity onPress={() => handleLogout()} >
        <Text className='text-white text-xl bg-blue-500 text-center py-2 rounded-lg my-4'>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
