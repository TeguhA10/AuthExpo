import React, { useEffect, useState } from 'react';
import { Box, Input, Text, Button, Pressable, Icon, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setError } from '@/store/reducers/authReducers';
import { register } from '@/services/authServices';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector((state: RootState) => state.auth.error);
  const router = useRouter();

  const { handleChange, handleSubmit, values, errors, touched } = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(register(values));
    },
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(setError(''));
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Box flex={1} p={4} justifyContent="center" bg="black">
      <VStack space={4}>
        <Text fontSize="3xl" fontWeight="bold" color="green.500">
          Create Account
        </Text>

        {error && <Text color="red.600">{error}</Text>}

        <Box>
          <Input
            placeholder="Name"
            onChangeText={handleChange('name')}
            value={values.name}
            variant="filled"
            bg="white"
            color="green.500"
            borderColor={touched.name && errors.name ? 'red.500' : 'gray.400'}
            InputRightElement={<Icon as={<MaterialIcons name="person" />} size={5} mr="3" color="muted.400" />}
          />
          {touched.name && errors.name && <Text color="red.500">{errors.name}</Text>}
        </Box>

        <Box>
          <Input
            placeholder="Username"
            onChangeText={handleChange('username')}
            value={values.username}
            variant="filled"
            bg="white"
            color="green.500"
            InputRightElement={<Icon as={<MaterialIcons name="person" />} size={5} mr="3" color="muted.400" />}
            borderColor={touched.username && errors.username ? 'red.500' : 'gray.400'}
          />
          {touched.username && errors.username && <Text color="red.500">{errors.username}</Text>}
        </Box>

        <Box>
          <Input
            placeholder="Email"
            onChangeText={handleChange('email')}
            value={values.email}
            variant="filled"
            bg="white"
            color="green.500"
            keyboardType="email-address"
            borderColor={touched.email && errors.email ? 'red.500' : 'gray.400'}
            InputRightElement={<Icon as={<MaterialIcons name="mail" />} size={5} mr="3" color="muted.400" />}
          />
          {touched.email && errors.email && <Text color="red.500">{errors.email}</Text>}
        </Box>

        <Box>
          <Input
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            onChangeText={handleChange('password')}
            value={values.password}
            variant="filled"
            bg="white"
            color="green.500"
            borderColor={touched.password && errors.password ? 'red.500' : 'gray.400'}
            InputRightElement={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  as={<MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} />}
                  size={5}
                  mr={3}
                  color="muted.400"
                />
              </Pressable>
            }
          />
          {touched.password && errors.password && <Text color="red.500">{errors.password}</Text>}
        </Box>

        <Button onPress={() => handleSubmit()} bg="green.500">
          Register
        </Button>

        <Button onPress={() => router.push('/(auth)')} variant="outline" colorScheme="green">
          Login
        </Button>
      </VStack>
    </Box>
  );
};

export default RegisterForm;
