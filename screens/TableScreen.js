import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { doc, getDoc, getDocs, collection, db } from '../firebase/index';
import { MaterialIcons } from '@expo/vector-icons';

export default function TableScreen({ route, navigation }) {
    const { userId, objectId } = route.params;
    const [objectData, setObjectData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const fetchObjectData = async () => {
            try {
                console.log('Fetching object data...');
                const objectRef = doc(collection(db, 'users', userId, 'objetos'), objectId);
                const objectDoc = await getDoc(objectRef);
                console.log('Object data fetched:', objectDoc.data());
                setObjectData(objectDoc.data());
                setIsLoading(false);
            } catch (error) {
                console.error('An error occurred while fetching object data:', error);
            }
        };

        const fetchColumns = async () => {
            try {
                console.log('Fetching columns...');
                const columnsRef = collection(db, 'users', userId, 'columns');
                const columnsSnapshot = await getDocs(columnsRef);
                const fetchedColumns = columnsSnapshot.docs.map(doc => doc.data());
                setColumns(fetchedColumns);
                console.log('Columns fetched:', fetchedColumns);
            } catch (error) {
                console.error('An error occurred while fetching columns:', error);
            }
        };

        fetchObjectData();
        fetchColumns();
    }, [userId, objectId]);

    // ...

    return (
        <View style={styles.container}>
        {isLoading ? (
            <Text>Loading...</Text>
        ) : objectData ? (
            <View style={styles.objectContainer}>
                <View style={styles.tableRow}>
                    {objectData.colunas.map((column, index) => (
                        <Text key={index} style={styles.tableHeaderCell}>
                            {column.name}
                        </Text>
                    ))}
                </View>

                {objectData.linhas.map((row, index) => (
                    <View key={index} style={styles.tableRow}>
                        {objectData.colunas.map((column, columnIndex) => (
                            <Text key={columnIndex} style={styles.tableCell}>
                                {row[column.name]}
                            </Text>
                        ))}
                    </View>
                ))}
            </View>
        ) : null}
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    objectContainer: {
        padding: 16,
        width: '80%',
    },
    objectTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    objectDescription: {
        fontSize: 16,
    },
});
