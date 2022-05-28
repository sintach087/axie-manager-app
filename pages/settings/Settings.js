import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native';

export default function Settings() {
    const [currency, setCurrency] = useState("PHP");
    const [colorMode, setColorMode] = useState("DARK");

    const db = SQLite.openDatabase('AppDatabase.db');

    const isFocused = useIsFocused();

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql(
                "SELECT SetValue from Settings WHERE UserSettings='Currency'", null,
                (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {
                        setCurrency(results.rows.item(i).SetValue);
                        console.log(results.rows.item(i).SetValue);
                    }
                }
            );
            tx.executeSql(
                "SELECT SetValue from Settings WHERE UserSettings='ColorMode'", null,
                (tx, results) => {
                    for (let i = 0; i < results.rows.length; i++) {
                        setColorMode(results.rows.item(i).SetValue);
                        console.log(results.rows.item(i).SetValue);
                    }
                }
            );
        })
    }, [isFocused])

    function updateCurrency(val) {
        db.transaction(tx => {
            tx.executeSql("UPDATE Settings SET SetValue = ? WHERE UserSettings='Currency'", [val],
                (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        setCurrency(val);
                        console.log(val);
                    }
                }
            )
        })
    }

    function updateColorMode(val) {
        db.transaction(tx => {
            tx.executeSql("UPDATE Settings SET SetValue = ? WHERE UserSettings='ColorMode'", [val],
                (txObj, resultSet) => {
                    if (resultSet.rowsAffected > 0) {
                        setColorMode(val);
                        console.log(val);
                    }
                }
            )
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cryptoPrice}>
                <View style={styles.currencyTextView}>
                    <Text style={styles.currencyText}>Currency:</Text>
                </View>
                <View style={styles.cryptoCurrencyPicker}>
                    <Picker
                        selectedValue={currency}
                        style={styles.cryptoCurrency}
                        onValueChange={(itemValue, itemIndex) => updateCurrency(itemValue)}
                        dropdownIconColor="white"
                        mode='dropdown'
                    >
                        <Picker.Item label="PHP" value="PHP" />
                        <Picker.Item label="USD" value="USD" />
                    </Picker>
                </View>
            </View>
            <View style={styles.cryptoPrice}>
                <View style={styles.currencyTextView}>
                    <Text style={styles.currencyText}>Mode:</Text>
                </View>
                <View style={styles.cryptoCurrencyPicker}>
                    <Picker
                        selectedValue={colorMode}
                        style={styles.cryptoCurrency}
                        onValueChange={(itemValue, itemIndex) => updateColorMode(itemValue)}
                        dropdownIconColor="white"
                        mode='dropdown'
                        itemStyle={{ backgroundColor: "white", color: "white", fontFamily:"Ebrima", fontSize:17 }}
                    >
                        <Picker.Item label="DARK" value="DARK" />
                        <Picker.Item label="LIGHT" value="LIGHT" />
                    </Picker>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212331',
    },
    cryptoPrice: {
        width: '100%',
        flexDirection: 'row',
    },
    cryptoCurrency: {
        color: 'white',
    },
    cryptoCurrencyPicker: { 
        borderWidth: 1, 
        borderColor: 'white', 
        borderRadius: 8, 
        width: '50%',
        height: 50,
        marginLeft: 10,
        marginTop: 20,
        padding: 10,
        justifyContent: 'center',
    },
    currencyTextView: {
        justifyContent: 'center',
        width: '40%',
    },
    currencyText: {
        color: 'white',
        fontSize: 25,
        marginLeft: 30,
        letterSpacing: 2,
        marginTop: 20,
    }
});