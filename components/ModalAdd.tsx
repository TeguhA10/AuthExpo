import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux'; // import useDispatch hook
import { addTodo } from '@/store/reducers/apiReducers';
import { AppDispatch } from '@/store/store';
import { styles } from './styleModal';

interface ModalAddProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    isNewTodoAdded: boolean;
    setIsNewTodoAdded: (isNewTodoAdded: boolean) => void;
}

const ModalAdd: React.FC<ModalAddProps> = ({ visible, setVisible, isNewTodoAdded, setIsNewTodoAdded }) => {
    const [addInput, setAddInput] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();

    const handleAdd = (text: string) => setAddInput(text);
    const modalAdd = () => {
        setVisible(!visible);
    };

    const MAX_CHAR_LIMIT = 100;

    const handleAddTodo = () => {
        if (addInput.trim() !== '' && addInput.length <= MAX_CHAR_LIMIT) {
            const newTodo = { 
                id: Math.random().toString(), 
                title: addInput, 
                status: 'unchecked',
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString() 
            };
            dispatch(addTodo(newTodo));
            setAddInput('');
            modalAdd();
            setIsNewTodoAdded(true); 
        } else if (addInput.length > MAX_CHAR_LIMIT) {
            alert(`Input exceeds maximum character limit of ${MAX_CHAR_LIMIT}`);
        }
    };

    return (
        <Modal isVisible={visible}>
            <View style={[styles.modal, { position: 'relative' }]}>
                <TouchableOpacity onPress={modalAdd} style={{ position: 'absolute', zIndex: 1, top: 10, right: 15 }}>
                    <Feather name="x-circle" size={25} color="#cecece" />
                </TouchableOpacity>
                <View style={[styles.modalContent, { marginTop: 35 }]}>
                    <TextInput
                        style={styles.editInput}
                        value={addInput}
                        onChangeText={handleAdd} // use handleAdd function to update input value
                        placeholder='Add todo'
                    />
                </View>
                <TouchableOpacity onPress={handleAddTodo} style={[styles.modalButton, { backgroundColor: '#00A911', width: '100%', marginTop: 10 }]}>
                    <Text style={styles.modalTextButton}>Add</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default ModalAdd