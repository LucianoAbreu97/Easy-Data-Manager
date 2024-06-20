import { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
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
          // Create a new user in Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
          // Get the user's ID
          const userId = userCredential.user.uid;
      
          // Create a new document in Firestore with the user's data
          await setDoc(doc(db, "users", userId), {
            name: name,
            surname: surname,
            email: email,
          });

            const userDocRef = doc(db, "users", userId);
            // Create an empty collection for the user's objects
            const userRef = collection(userDocRef, 'objetos'); // Referencing the subcollection
            await addDoc(userRef, {}); // Add an empty document to mark the collection
      
          console.log("User created successfully!");
          navigation.navigate('Login'); // Navigate to Login screen after successful registration
        } catch (error) {
          Alert.alert('Falha ao registrar. Tente novamente. ');
        }
      };
//(password !== repeatPassword)
      const handleSignUp = async () => {
        if (!name || !surname || !email || !password) {
          Alert.alert('Por favor digite todos os dados.');
          return;
        } if (password !== repeatPassword) {
          Alert.alert('As senhas não correspondem.');
          return;
        }

        await createUser(name, surname, email, password)
      };

    return (
        <KeyboardAvoidingView style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
                <TouchableOpacity>
                    <Image style={styles.profileIcon} source={require('../assets/ProfileIc.png')} />
                </TouchableOpacity>
            <ScrollView style={styles.scrollView}>
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
                            keyboardType='email-address'
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
                        {/* BOTTOM */}
                        <View style={styles.bottomContainer}>
                            <Text>Já tem uma conta?</Text>
                            <TouchableOpacity>
                                <Text style={[{color: config.color.button}, {marginLeft: 8}]} onPress={() => {navigation.navigate('Login')}}>Entrar</Text>
                            </TouchableOpacity>
                        </View>
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
    scrollView: {
        width: '100%',
        alignSelf: 'center',
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
        backgroundColor: 'white'
    },
    text: {
        alignSelf: 'flex-start',
        padding: 4,
    },
    button: {
        width: '60%',
        height: 36,
        backgroundColor: config.color.button,
        borderRadius: 20,
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
    },
})
