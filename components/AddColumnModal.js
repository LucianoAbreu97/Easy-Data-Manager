import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const AddColumnModal = ({ navigation, route }) => {
    const [columnName, setColumnName] = useState('');
    const { onSave } = route.params;


    return (
        <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Digite o nome da coluna:</Text>
            <TextInput
                value={columnName}
                onChangeText={setColumnName}
                placeholder="Nome da Coluna"
                style={styles.modalInput}
            />
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.button} onPress={() => {navigation.goBack();}}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => {onSave(columnName); navigation.goBack();}}>
                    <Text style={styles.buttonText}>Adicionar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


export default AddColumnModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: config.color.primary,
    },
    modalText: {
        fontSize: 20,
        marginBottom: 10,
        color: 'white',
    },
    modalInput: {
        borderWidth: 2,
        borderColor: config.color.button,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        marginHorizontal: 15,
    },
    button: {
        backgroundColor: config.color.button,
        padding: 10,
        borderRadius: 25,
        marginHorizontal: 10,
        width: 100,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});
