import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import config from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';      

export default function GraphScreen() {

    return (
        <View style={styles.container}>
            <Text>Graph Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {                    
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

