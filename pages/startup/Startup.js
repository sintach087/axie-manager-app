import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Main from '../main/Main';
import * as SQLite from 'expo-sqlite';

export default function Startup() {

    const [isFirstTime, setIsFirstTime] = useState(true);
    const [progress, setProgress] = useState("");
    const [isProgress, setIsProgress] = useState(false);

    const db = SQLite.openDatabase('AppDatabase.db');

    useEffect(() => {

        db.transaction(txn => {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='Settings'",
                null,
                (tx, res) => {
                    if (res.rows.length == 0) {
                        setIsProgress(true);
                        setProgress("Initializing necessary files...");
                        console.log("Creating Settings Table");
                        txn.executeSql('DROP TABLE IF EXISTS Settings', null);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS Settings(UserSettings VARCHAR(255), SetValue VARCHAR(255))',
                            []
                        );
                        
                        txn.executeSql(
                            'INSERT INTO Settings (UserSettings, SetValue) VALUES (?,?)',
                            ['Currency', 'PHP'],
                            (tx, results) => {
                                if (results.rowsAffected > 0) {
                                    console.log("Done");
                                } 
                                else {
                                    setProgress("An error occured while creating database");
                                }
                            },
                            (tx, error) => {
                                setProgress("An error occured while creating database");
                            }
                        );
                        txn.executeSql(
                            'INSERT INTO Settings (UserSettings, SetValue) VALUES (?,?)',
                            ['ColorMode', 'DARK'],
                            (tx, results) => {
                                if (results.rowsAffected > 0) {
                                    console.log("Done");
                                    setIsProgress(false);
                                    setProgress(""); 
                                    let splash = setTimeout(() => {
                                        setIsFirstTime(false);
                                    }, 3000);
                                
                                    return () => {
                                        clearTimeout(splash);
                                    }
                                } 
                                else {
                                    setProgress("An error occured while creating database");
                                }
                            },
                            (tx, error) => {
                                setProgress("An error occured while creating database");
                            }
                        );   
                    }
                    else {
                        console.log("Database exists!");
                        let splash = setTimeout(() => {
                            setIsFirstTime(false);
                        }, 3000);
                
                        return () => {
                            clearTimeout(splash);
                        }
                    }
                },
                (tx, error) => {
                    setProgress("An error occured while creating database. Error: " + error.message);
                }
            );
        });
    }, []);

    return (
        <View style={styles.con}>
            { isFirstTime ? <SplashScreen _isprogress={isProgress} _progress={progress}/> : <Main /> }
        </View>
    );
}

function SplashScreen(props) {
    return (
        <View style={styles.container}>
            <StatusBar hidden={true} />
            <Animatable.Image 
                animation="pulse" 
                easing="ease-out" 
                iterationCount="infinite"
                style={styles.logoImage}
                source={require('../../assets/images/slp.png')}
                resizeMode="center"
            />
            <Text style={styles.logoTitle}>Axie Manager App</Text>
            <Text style={styles.progress}>{props._progress}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    con: {
        flex: 1,
        backgroundColor: '#212331',
    },
    container: {
        flex: 1,
        backgroundColor: '#212331',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 100,
        height: 100,
        marginBottom: 15,
    },
    logoTitle: {
        color: '#fff',
        fontSize: 24,
    },
    progress: {
        color: '#fff',
        fontSize: 24,
        marginTop: 20,
    },
});