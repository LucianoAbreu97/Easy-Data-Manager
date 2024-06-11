import { useState, useEffect } from "react"
import { View,  Text, TouchableOpacity, StyleSheet} from "react-native"
import { collection, doc, getDocs, db, deleteDoc, onDelete} from '../firebase/index'
import config from '../config'
import { MaterialIcons } from '@expo/vector-icons';

export default function UserObject({userId, object, onPress, onDelete}) {

    const [tableNames, setTableNames] = useState([]);

    useEffect(() => {
        const fetchTableNames = async () => {
          try {
            const userRef = doc(collection(db, 'users'), userId);
            const objetosRef = collection(userRef, 'objetos');
            const querySnapshot = await getDocs(objetosRef);
            const tableNames = querySnapshot.docs.map((doc) => doc.id);
            setTableNames(tableNames);
          } catch (error) {
            console.error('An error occurred while fetching table names:', error);
          }
        };

    
    fetchTableNames();
    }, [userId]);

    const handleDelete = async (collectionPath, documentId) => {
        try {
            const userRef = doc(collection(db, 'users'), userId);
            const objetosRef = collection(userRef, 'objetos');
            const docRef = doc(objetosRef, documentId);
            await deleteDoc(docRef);
            onDelete(collectionPath, documentId)
            console.log('Collection deleted successfully');
        } catch (error) {
            console.error('An error occurred while deleting the collection:', error);
        }
    }

    return{
            handleDelete,
            render: () => (
            <TouchableOpacity onPress={() => onPress(object.id)}>
                <View style={styles.container}>
                    <Text>{object.nome}</Text>
                    <TouchableOpacity style={styles.button} onPress={() => {handleDelete('users', object.id)}}>
                        <MaterialIcons name="delete" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        height: 60,
        padding:10,
        backgroundColor: 'white',
        borderWidth: 2,
        borderRadius: 8,
        borderColor: config.color.button,
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        marginRight: 10,
    },
    title: {},
    button: {
        position:'absolute',
        left: 230,
    }
})