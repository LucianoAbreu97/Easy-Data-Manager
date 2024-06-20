import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { auth, db, collection, doc, setDoc } from '../firebase/index';
import config from '../config';
import { Ionicons } from '@expo/vector-icons';
//<MaterialIcons name="delete" size={24} color="black" />


export default function NewTableScreen({navigation, route}) {

  const {userId} = route?.params || {};
  console.log('Received userId:', userId);

  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([]); 
  const [newColumnName, setNewColumnName] = useState('');

  const handleAddColumn = () => {
    setNewColumnName(''); // Clear input before showing dialog
    navigation.navigate('AddColumn', {
        onSave: (columnName) => {
            setColumns([...columns, { name: columnName, type: 'string' }]);
            setNewColumnName(''); // Clear input after saving
        },
    });
  };

  const handleAddLine = () => {
    if (columns.length === 0) {
      Alert.alert('Por favor, insira pelo menos uma coluna');
      return;
    }
    const newLine = columns.reduce((acc, column) => {
      acc[column.name] = '';
      return acc;
    }, {});
    setTableData([...tableData, newLine]);
  };

const saveTable = async () => {
  if (!tableName) {
    Alert.alert('Por favor, insira um nome para a tabela');
    return;
  }
  if (columns.length === 0) {
    Alert.alert('Por favor, insira pelo menos uma coluna');
    return;
  }
  if (tableData.length === 0) {
    Alert.alert('Por favor, insira pelo menos uma linha');
    return;
  }
  if (tableData.some((line) => Object.values(line).some((value) => !value))) {
    Alert.alert('Por favor, preencha todas as linhas');
    return;
  }
  try {
    const userRef = doc(collection(db, 'users'), userId);
    const newTableRef = doc(collection(userRef, 'objetos'), tableName);
    
    await setDoc(newTableRef, {
      nome: tableName,
      colunas: columns.map(({ name, type }) => ({ name, tipo: type })),
      linhas: tableData,
    });
    navigation.navigate('Home', { userId: auth.currentUser.uid });
  } catch (error) {
    Alert.alert('Ocorreu um error durante a gravação da tabela: ', error);
  }
};


  const renderColumnInputs = () => (
    columns.map((column, index) => (
      <TextInput
        style={styles.textInput}
        key={index}
        value={column.name}
        onChangeText={(text) => {
          const updatedColumns = [...columns];
          updatedColumns[index].name = text;
          setColumns(updatedColumns);
        }}
        placeholder={`Coluna ${index + 1} : Nome`}
      />
    ))
  );

  const handleClearInputs = () => {
    setTableName('');
    setColumns([]);
    setTableData([]);
    setNewColumnName('');
  }


  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => {navigation.navigate('Home', {userId: auth.currentUser.uid})}}>
        <Ionicons name="arrow-back" size={36} color="white" />
        </TouchableOpacity> 
        <Text style={styles.headerText}>Nova Tabela</Text>
      </View>
      <TextInput
            value={tableName}
            onChangeText={setTableName}
            placeholder="Nome da Coluna"
            style={[styles.textInput, {width: '80%'}]}
          />
      <View style={styles.bodyContainer}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text style={styles.divisorText}>Colunas</Text>
            {renderColumnInputs()}
            <TouchableOpacity style={styles.button} onPress={handleAddColumn}>
              <Text style={styles.separator}>Adicionar Coluna</Text>
            </TouchableOpacity>
            <Text style={styles.divisorText}>Linhas</Text>
            <View style={styles.rowsContainer}>
              {tableData.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {columns.map((column, colIndex) => (
                    <TextInput
                      key={`${rowIndex}-${colIndex}`}
                      value={row[column.name]} // Access value by column name
                      onChangeText={(text) => {
                        const updatedData = [...tableData];
                        updatedData[rowIndex][column.name] = text;
                        setTableData(updatedData);
                      }}
                      /* placeholder={`Row ${rowIndex + 1}, Col ${colIndex + 1}`} */
                      placeholder={column.name}
                      style={styles.rowInput}
                    />
                  ))}
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleAddLine}>
              <Text>Adicionar Linha</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.bottomButton} onPress={handleClearInputs}>
              <Text>Limpar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomButton} onPress={saveTable}>
              <Text>Salvar</Text>
            </TouchableOpacity>
          </View>
    </KeyboardAvoidingView>
    )
};

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: config.color.primary,
    },
    headerContainer: {
      height: 100,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
    bodyContainer: {
      flex: 1,
      height: 'auto',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 90,
    },
    scrollView: {
      width: '90%',
      flexGrow: 1,
      padding: 10,
    },
    textInput: {
      height: 40,
      width: '100%',
      borderWidth: 2,
      backgroundColor: config.color.secondary,
      justifyContent: 'center',
      textAlign: 'center',
      marginBottom: 10,
    },
    button: {
      width: '60%',
      height: 36,
      backgroundColor: config.color.button,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25,
      marginBottom: 10,
    },
    rowsContainer: {
      width: '100%',
      borderRadius: 8,
      marginBottom: 14,
    },
    row: {
      padding: 6,
      marginTop: 5,
    },
    rowInput: {
      backgroundColor: 'white',
      marginBottom: 10,
      padding: 5,
      borderWidth: 2,
      borderBlockColor: 'black',
    },
    divisorText: {
      color: 'white',
      margin: 10,
      fontSize: 16,
      fontWeight: 'bold'
    },
    bottomContainer: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 20,
      padding: 10,
    },
    bottomButton: {
      width: 140,
      height: 36,
      backgroundColor: config.color.button,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25,
      marginHorizontal: 20,
    },
    backButton: {
      position: 'absolute',
      width: '100%',
      right: 20,
      padding: 10,
    }
    });
