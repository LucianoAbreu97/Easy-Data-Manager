import { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import config from '../config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth, setDoc, db, doc, collection, addDoc } from '../firebase/index';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterScreen({navigation}) {

    
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const createUser = async (name, surname, email, password) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
          const userId = userCredential.user.uid;
      
          await setDoc(doc(db, "users", userId), {
            name: name,
            surname: surname,
            email: email,
          });

            const userDocRef = doc(db, "users", userId);
            const userRef = collection(userDocRef, 'objetos');
            await addDoc(userRef, {});
      
          console.log("User created successfully!");
          navigation.navigate('Login');
        } catch (error) {
          console.error(error);
        }
      };

      const handleSignUp = async () => {
        if (password !== repeatPassword) {
          alert('Passwords do not match');
          return;
        } if (!name || !surname || !email || !password) {
          alert('Please fill in all fields');
          return;
        }

        await createUser(name, surname, email, password)
      };

    return (
        <SafeAreaView style={styles.container}>
                <TouchableOpacity>
                    <Image style={styles.profileIcon} source={require('../assets/ProfileIc.png')} />
                </TouchableOpacity>
            <View style={styles.bodyContainer}>
                <View style={styles.bodyContainerAux}>
                    <Text style={styles.text}>Nome</Text>
                    <TextInput style={styles.input}
                        onChangeText={setName}
                        value={name}
                        padding={16}
                    />
                    <Text style={styles.text}>Sobrenome</Text>
                    <TextInput style={styles.input}
                        onChangeText={setSurname}
                        value={surname}
                        padding={16}
                    />
                    <Text style={styles.text}>E-Mail</Text>
                    <TextInput style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        padding={16}
                    />
                    <Text style={styles.text}>Senha</Text>
                    <TextInput style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                        padding={16}
                    />
                    <Text style={styles.text}>Repita a Senha</Text>
                    <TextInput style={styles.input}
                        onChangeText={setRepeatPassword}
                        value={repeatPassword}
                        secureTextEntry
                        padding={16}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                        <Text style={[styles.text, {alignSelf: 'center'}]}>Cadastrar</Text>
                    </TouchableOpacity>
                    <View style={styles.bottomContainer}>
                        <Text>Já tem uma conta?</Text>
                        <TouchableOpacity>
                            <Text style={[{color: config.color.button}, {marginLeft: 8}]} onPress={() => {navigation.navigate('Login')}}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: config.color.primary,
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
})
