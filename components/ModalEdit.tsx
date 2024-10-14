import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { styles } from './styleModal'
import { useDispatch, useSelector } from 'react-redux';
import { updateTodo } from '@/store/reducers/apiReducers';
import { AppDispatch, RootState } from '@/store/store';

interface ModalAddProps {
    ide: string;
    title: string;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

const ModalEdit: React.FC<ModalAddProps> = ({ ide, title, visible, setVisible }) => {
    const todos = useSelector((state: RootState) => state.api.todos);
    const [editInput, setEditInput] = useState<string>(title);
    const dispatch = useDispatch<AppDispatch>();
    const modalEdit = () => { 
        setVisible(!visible); 
    };

    useEffect(() => {
        setEditInput(title);
    }, [title]);

    const handleEditTodo = () => {
        if (editInput.trim() !== '') {
            const originalTodo = todos.find(todo => todo.id === ide); 
            if (!originalTodo) {
                console.error('Todo not found');
                return;
            }
            
            const updatedTodo = {
                ...originalTodo,
                title: editInput,
                updatedAt: new Date().toISOString()
            };
            dispatch(updateTodo(updatedTodo)); 
            setEditInput('');
            modalEdit(); 
        }
    };
    

    return (
        <Modal isVisible={visible}>
            <View style={[styles.modal, { position: 'relative' }]}>
                <TouchableOpacity onPress={modalEdit} style={{ position: 'absolute', zIndex: 1, top: 10, right: 15 }}>
                    <Feather name="x-circle" size={25} color="#cecece" />
                </TouchableOpacity>
                <View style={[styles.modalContent, { marginTop: 35 }]}>
                    <TextInput
                        style={styles.editInput}
                        value={editInput}
                        onChangeText={setEditInput}
                        placeholder={title}
                    />
                </View>
                <TouchableOpacity onPress={handleEditTodo} style={[styles.modalButton, { backgroundColor: '#00A911', width: '100%', marginTop: 10 }]}>
                    <Text style={styles.modalTextButton}>Edit</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default ModalEdit