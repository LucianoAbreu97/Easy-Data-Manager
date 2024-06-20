import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { auth, getAuth, db, doc, getDoc, collection, getDocs, signOut } from '../firebase/index';
import UserObject from '../components/UserObject';
import config from '../config'
import { documentId } from 'firebase/firestore';

export default function HomeScreen({navigation, route}) {

    const [currentUserData, setCurrentUserData] = useState(null);
    const {userId} = route?.params || {};
    console.log('Home userId:', userId);
    const [userObjects, setUserObjects] = useState([]);

    console.log('HomeScreen rendered');


    useEffect(() => {
        const fetchUserObjects = async () => {
          try {
            const userRef = doc(collection(db, 'users'), userId);
            const objectsRef = collection(userRef, 'objetos');
            const querySnapshot = await getDocs(objectsRef);
            const objects = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setUserObjects(objects); // Update state with new array
          } catch (error) {
            console.error('An error occurred while fetching user objects:', error);
          }
        };
      
        fetchUserObjects();
      }, [userId]);

      useEffect(() => {
        console.log('Fetching user data...');
        const fetchUserData = async () => {
          try {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            console.log('UserData fetched: ', userDoc.data());
            setCurrentUserData(userDoc.data());
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchUserData();
      }, []);

      const handleDeleteFromHomeScreen = (collectionPath, documentId) => {
          handleDelete(collectionPath, documentId);
      };

      const handleLogout = async () => {
        try {
            const auth = getAuth();
            await signOut(auth)
                .then (() => {
            console.log('User logged out successfully');
            navigation.navigate('Login');
        });
        } catch (error) {
            console.error(error);
            Alert.alert('Ocorreu um error durante o logout:', error.message);
        }
      }

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.headerContainer}>
                <View style={styles.headerCountainerAux}>
                    <Image style={styles.profileIcon} source={require('../assets/ProfileIc.png')} />
                    {currentUserData && (
                        <Text style={styles.profileName}>
                            {currentUserData.name} {currentUserData.surname}
                        </Text>
                    )}
                </View>
                <TouchableOpacity style={styles.logOutIc}
                    onPress={handleLogout}
                >
                    <MaterialIcons name="logout" size={36} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.EditPerfilContainer}>
                <TouchableOpacity
                    onPress={() => {navigation.navigate('ProfileEdit', {userId: userId})}}
                >
                    <Text style={[styles.text, {color: 'white'}]}>Editar Perfil</Text>
                </TouchableOpacity>
            </View>
            {/* BODY */}
            <View style={styles.bodyContainer}>
                <View style={styles.listContainer}>
                    <FlatList
                        data={userObjects}
                        renderItem={({ item }) => (
                            <UserObject userId={userId} 
                                object={item} 
                                onPress={() => {navigation.navigate('Table', {userId: userId, objectId: item.id})}}
                                onDelete={handleDeleteFromHomeScreen}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                {/* BOTTOM */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.button}
                        onPress={() => {navigation.navigate('NewTable', {userId: auth.currentUser.uid})}}
                    >
                        <Text>Criar Tabela</Text>
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
    headerContainer: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerCountainerAux: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
    },
    EditPerfilContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginBottom: 12,
    },
    profileIcon: {
        height: 80,
        width: 80,
        borderRadius: 100,
    },
    profileName: {
        marginLeft: 16,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    logOutIc: {
        width: '100%',
        left: 150,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        position: 'absolute'
    },
    bodyContainer: {
        flex: 1,
        height: 'auto',
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    listContainer: {
        margin: 40,
        marginBottom: 90,
        padding: 20,
        width: '80%',
    },
    bottomContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    button: {
        width: '60%',
        height: 36,
        backgroundColor: config.color.button,
        borderRadius: 25,
        margin: 30,
        justifyContent: 'center',
        alignItems: 'center',   
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold'
    },
})
