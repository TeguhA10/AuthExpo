import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { RootState } from '@/store/reducers';
import { checkTokenExpiration } from '@/services/authServices';
import { AppDispatch } from '@/store/store';

const AuthLayout = () => {
  const [showLoading, setShowLoading] = useState(true);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeAuth = async () => {
      await dispatch(checkTokenExpiration());
      setShowLoading(false);
    };
    
    initializeAuth();
  }, [dispatch]);
  
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        setShowLoading(false);
      }
    }
  }, [isAuthenticated, loading, router]);

  if (showLoading || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
