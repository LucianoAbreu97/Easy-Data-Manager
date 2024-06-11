import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { doc, getDoc, getDocs, collection, db } from '../firebase/index';
import { MaterialIcons } from '@expo/vector-icons';

export default function TableScreen({ route, navigation }) {
  const { userId, objectId } = route.params;
  const [objectData, setObjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editableData, setEditableData] = useState({});

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

    fetchObjectData();
  }, [userId, objectId]);

  const renderTableHeader = () => {
    return (
      <View style={styles.tableRow}>
        {objectData?.colunas.map((column, index) => (
          <Text key={index} style={styles.tableHeaderCell}>
            {column.name}
          </Text>
        ))}
      </View>
    );
  };

  const renderTableRow = (row) => {
    return (
      <View key={row.prop} style={styles.tableRow}>
        {objectData?.colunas.map((column, columnIndex) => (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}>
            <Text key={columnIndex} style={[styles.tableCell, { numberOfLines: 1 }]}>
              {row[column.name]}
            </Text>
          </ScrollView>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Carregando...</Text>
      ) : objectData ? (

        <View style={styles.objectContainer}>
          {/* Table header */}
          {renderTableHeader()}

          {/* Table rows */}
          <FlatList
            data={objectData.linhas}
            renderItem={({ item }) => renderTableRow(item)}
            keyExtractor={(item) => item.prop || item.id}
          />
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
    backgroundColor: config.color.primary,
  },
  objectContainer: {
    padding: 16,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: config.color.secondary,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
