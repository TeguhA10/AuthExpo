import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { Box } from 'native-base';

const App = () => {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center bg-black p-4">
            <Text className='text-green-500 font-bold text-3xl font-bold text-center'>Welcome to my application</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)')} className='my-4'>
                <Box>Hello world</Box>
                <Text className=' text-2xl text-blue-500 font-bold'>go to my TodoApp</Text>
            </TouchableOpacity>
        </View>
    )
}

export default App