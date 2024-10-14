import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    modal: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
    },
    modalContent: {
        alignItems: 'center',
        marginVertical: 5
    },
    editInput: {
        borderWidth: 1,
        borderColor: '#cecece',
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 5,
    },
    modalButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        width: '40%',
    },
    modalTextButton: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalContainerButton: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
    },
});