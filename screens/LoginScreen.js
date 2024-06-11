import { useState,useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native'
import config from '../config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../firebase/index';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({navigation}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            console.error('Email and password fields cannot be empty');
            return;
        }
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            navigation.navigate('Home', {userId});
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                console.error('Invalid email, user not found, or wrong password');
            } else {
                console.log('An error occurred during login:', error.message);
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
        <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
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
        borderRadius: 6,
        backgroundColor: 'white'
    },
    button: {
        width: '100%',
        height: 36,
        backgroundColor: config.color.button,
        borderRadius: 6,
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