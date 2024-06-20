import { useState } from 'react'
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingViewComponent, ScrollView, KeyboardAvoidingView, Alert } from 'react-native'
import config from '../config'
import { Ionicons } from '@expo/vector-icons';
import { auth, db, doc, setDoc } from '../firebase/index';

export default function RegisterScreen({navigation, route}) {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const {userId} = route?.params || {};
    console.log('NewTable userId:', userId);

    const updateUserData = async () => {
        try {
            if (!name || !surname) {
                Alert.alert('Por favor, preencha todos os campos.');
                return;
            }
            const userRef = doc(db, 'users', userId);
            await setDoc(userRef, {
                name: name,
                surname: surname 
            });
            console.log('User data updated successfully');
            navigation.navigate('Home', {userId: auth.currentUser.uid});
        } catch (error) {
            Alert.alert('Ocorreu um error durante a atualização dos dados: ', error);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
                <View style={styles.backIcContainer}>
                    <TouchableOpacity
                        onPress={() => {navigation.navigate('Home', {userId: auth.currentUser.uid})}}
                    >
                        <Ionicons name="arrow-back" size={36} color="white" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <Image style={styles.profileIcon} source={require('../assets/ProfileIc.png')} />
                </TouchableOpacity>
            <ScrollView style={styles.scrollView}>
                <View style={styles.bodyContainer}>
                    <View style={styles.bodyContainerAux}>
                        <Text style={styles.text}>Nome</Text>
                        <TextInput style={styles.input}
                            onChangeText={(text) => setName(text)}
                            value={name}
                            padding={16}
                        />
                        <Text style={styles.text}>Sobrenome</Text>
                        <TextInput style={styles.input}
                            onChangeText={(text) => setSurname(text)}
                            value={surname}
                            padding={16}
                        />
                        <TouchableOpacity style={styles.button}>
                            <Text style={[styles.text, {alignSelf: 'center'}]}>Nova Senha</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={updateUserData}>
                            <Text style={[styles.text, {alignSelf: 'center'}]}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: config.color.primary,
    },
    backIcContainer: {
        width: '100%',
        position: 'absolute',
        top: 26,
        left: 16,
        padding: 10,
    },
    scrollView: {
        flex: 1,
        width: '100%',
        height: 'auto',
    },
    profileIcon: {
        height: 120,
        width: 120,
        margin: 50,
        borderWidth: 4,
        borderColor: 'white',
        borderRadius: 100
    },
    bodyContainer: {
        flex: 1,
        backgroundColor: config.color.secondary,
        width: '100%',
        height: 'auto',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bodyContainerAux: {
        width: '80%',
        alignItems: 'center'
    },
    input:{
        height: 50,
        width: '100%',
        borderWidth: 2,
        borderColor: config.color.primary,
        borderRadius: 6,
        backgroundColor: 'white'
    },
    text: {
        alignSelf: 'flex-start',
        padding: 6,
    },
    button: {
        width: '100%',
        height: 36,
        backgroundColor: config.color.button,
        borderRadius: 6,
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center,'
    },
    modalPassword: {
        flex: 1,
        height: 500,
        width: 500,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
