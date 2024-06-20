import { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, KeyboardAvoidingView } from 'react-native'
import config from '../config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../firebase/index';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Por favor digite o e-mail e a senha.');
            return;
        } 
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            navigation.navigate('Home', {userId});
        } catch (error) {
            if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                Alert.alert('E-mail ou senha inválidos.');
            } else {
                Alert.alert('Um error ocorreu durante o login: \n', error.message);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            const userId = user.uid;
            navigation.navigate('Home', {userId});
                } else {          }
        });
      
        return () => {
          unsubscribe();
        };
      }, []);

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            {/* HEADER */}
            <Image style={styles.logo} source={require('../assets/Logo.jpg')}/>
            {/* BODY */}
            <View style={styles.bodyContainer}>
                <View style={styles.bodyAuxContainer}>
                    <Text style={styles.text}>Email</Text>
                    <TextInput style={styles.input}
                        onChangeText={(text) => {setEmail(text)}}
                        value={email}
                        paddingLeft={16}
                    />
                    <Text style={styles.text}>Password</Text>
                    <TextInput style={styles.input}
                        onChangeText={(text) => {setPassword(text)}}
                        value={password}
                        secureTextEntry
                        paddingLeft={16}
                    />
                    <TouchableOpacity style={{alignSelf: 'flex-end', paddingRight: 6}}
                    >
                        <Text style={[styles.text, {color: config.color.button}]}>Esqueceu a senha?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}
                        onPress={handleLogin}
                    >
                        <Text style={[styles.text, {alignSelf: 'center'}]}>Entrar</Text>
                    </TouchableOpacity>
                </View>
                {/* BOTTOM */}
                <View style={styles.bottomContainer}>
                    <Text>Não tem uma conta?</Text>
                    <TouchableOpacity style={{paddingLeft: 8}}
                        onPress={() => {navigation.navigate('Register')}}
                    >
                        <Text style={[styles.text, {color: config.color.button}]}>Cadastre-se</Text>
                    </TouchableOpacity>
                </View>
            </View>
    </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: config.color.primary
    },
    logo:{
        height: 200,
        width: 300
    },
    bodyContainer: {
        flex: 1,
        marginTop: 'auto',
        width: '100%',
        backgroundColor: config.color.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    bodyAuxContainer: {
        width: '80%',
        alignItems: 'center'
    },
    input: {
        height: 40,
        width: '100%',
        borderWidth: 2,
        borderColor: config.color.primary,
        backgroundColor: 'white'
    },
    button: {
        width: '60%',
        height: 36,
        backgroundColor: config.color.button,
        borderRadius: 20,
        margin: 30
    },
    text: {
        alignSelf: 'flex-start',
        padding: 6,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})
