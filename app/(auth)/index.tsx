// login.tsx
import React, { useEffect, useState } from 'react';
import { Box, Input, Text, Button, VStack, Pressable, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { login } from '@/services/authServices';
import { setError } from '@/store/reducers/authReducers';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const LoginForm = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector((state: RootState) => state.auth.error);
  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(login(values));
    }, 
  });

  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(setError(''));
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Box flex={1} justifyContent="center" p={4} bg="black">
      <Text fontSize="3xl" fontWeight="bold" mb={4} color="green.500">
        Welcome back
      </Text>
      
      {error && <Text color="red.600">{error}</Text>}

      <VStack space={4}>
        <Box>
          <Input
            placeholder="Username"
            onChangeText={handleChange('username')}
            value={values.username}
            bg="white"
            borderColor="gray.400"
            _focus={{ borderColor: 'green.500', backgroundColor: 'white' }}
            InputRightElement={<Icon as={<MaterialIcons name="person" />} size={5} mr="3" color="muted.400" />}
          />
          {touched.username && errors.username && <Text color="red.500">{errors.username}</Text>}
        </Box>

        <Box>
          <Input
            placeholder="Password"
            type={show ? "text" : "password"}
            onChangeText={handleChange('password')}
            value={values.password}
            bg="white"
            borderColor="gray.400"
            _focus={{ borderColor: 'green.500', backgroundColor: 'white' }}
            InputRightElement={
              <Pressable onPress={() => setShow(!show)}>
                <Icon
                  as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />}
                  size={5}
                  mr="3"
                  color="muted.400"
                />
              </Pressable>
            }
          />
          {touched.password && errors.password && <Text color="red.500">{errors.password}</Text>}
        </Box>

        <Button onPress={() => handleSubmit()} colorScheme="green">
          Login
        </Button>

        <Button onPress={() => router.push('/register')} variant="outline" colorScheme="green">
          Register
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginForm;
