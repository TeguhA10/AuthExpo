// components/BottomSheet.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Checkbox } from 'react-native-paper';

interface BottomSheetProps {
    bottomSheetModalRef: React.RefObject<BottomSheetModal>;
    snapPoints: string[];
    handleSheetChanges: (index: number) => void;
    onFilterChange: (filter: { done: boolean, undone: boolean }) => void;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ bottomSheetModalRef, handleSheetChanges, snapPoints, onFilterChange }) => {
    const [doneChecked, setDoneChecked] = useState<boolean>(false);
    const [undoneChecked, setUndoneChecked] = useState<boolean>(false);

    const handleDoneChange = () => {
        setDoneChecked(!doneChecked);
        onFilterChange({ done: !doneChecked, undone: undoneChecked });
    };

    const handleUndoneChange = () => {
        setUndoneChecked(!undoneChecked);
        onFilterChange({ done: doneChecked, undone: !undoneChecked });
    };

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
        >
            <BottomSheetView style={styles.contentContainer}>
                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Filter category</Text>
                <View style={styles.containerFilter}>
                    <View style={styles.checkBox}>
                        <Checkbox
                            status={doneChecked ? 'checked' : 'unchecked'}
                            onPress={handleDoneChange}
                            color={doneChecked ? '#00A911' : undefined}
                        />
                        <Text style={styles.textContent}>Done Todo</Text>
                    </View>
                    <View style={styles.checkBox}>
                        <Checkbox
                            status={undoneChecked ? 'checked' : 'unchecked'}
                            onPress={handleUndoneChange}
                            color={undoneChecked ? '#00A911' : undefined}
                        />
                        <Text style={styles.textContent}>Undone Todo</Text>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 45
    },
    containerFilter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15
    },
    textContent: {
        fontWeight: 'bold',
    },
    checkBox: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default BottomSheet;