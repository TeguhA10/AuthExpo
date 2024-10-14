import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux';
import { deleteTodo } from '@/store/reducers/apiReducers';
import { styles } from './styleModal';
import { AppDispatch } from '@/store/store';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, withSequence, runOnJS } from 'react-native-reanimated';

interface ModalDeleteProps {
    idd: string;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

type IconName = 'alert-circle' | 'trash';

const ModalDelete: React.FC<ModalDeleteProps> = ({ idd, visible, setVisible }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [iconName, setIconName] = useState<IconName>('alert-circle');
    const fadeAnim = useSharedValue(1);
    const shakeAnim = useSharedValue(0);

    const modalDelete = () => {
        setVisible(!visible);
    };

    const handleDeleteTodo = () => {
        fadeAnim.value = withTiming(0, { duration: 500, easing: Easing.linear }, (isFinished) => {
            if (isFinished) {
                
                runOnJS(setIconName)('trash');
                fadeAnim.value = withTiming(1, { duration: 500, easing: Easing.linear }, (isFinished) => {
                    if (isFinished) {
                        shakeAnim.value = withSequence(
                            withTiming(1, { duration: 100, easing: Easing.linear }),
                            withTiming(-1, { duration: 100, easing: Easing.linear }),
                            withTiming(1, { duration: 100, easing: Easing.linear }),
                            withTiming(-1, { duration: 100, easing: Easing.linear }),
                            withTiming(0, { duration: 100, easing: Easing.linear })
                        );

                    }
                });
            }
        });
        setTimeout(() => {
            shakeAnim.value = withTiming(0, { duration: 1500, easing: Easing.linear }, () => {
                runOnJS(setIconName)('alert-circle');
            });
            dispatch(deleteTodo(idd));
            modalDelete();
        }, 1500);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
        transform: [{ rotate: `${shakeAnim.value * 10}deg` }]
    }));

    return (
        <Modal isVisible={visible}>
            <View style={styles.modal}>
                <View style={styles.modalContent}>
                    <Animated.View style={animatedStyle}>
                        <Ionicons name={iconName} size={65} color="red" />
                    </Animated.View>
                    <Text style={styles.modalText}>Are you sure you want to delete this item?</Text>
                </View>
                <View style={styles.modalContainerButton}>
                    <TouchableOpacity onPress={modalDelete} style={[styles.modalButton, { backgroundColor: '#00A911' }]}>
                        <Text style={styles.modalTextButton}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDeleteTodo} style={[styles.modalButton, { backgroundColor: 'red' }]}>
                        <Text style={styles.modalTextButton}>Yes</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ModalDelete;