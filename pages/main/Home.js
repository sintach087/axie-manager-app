import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import * as SQLite from 'expo-sqlite';
import * as Animatable from 'react-native-animatable';
import {Asset} from 'expo-asset';
import { useIsFocused } from '@react-navigation/native';

export default function Home() {

    const [SLPPrice, setSLPPrice] = useState("------");
    const [AXSPrice, setAXSPrice] = useState("------");
    const [ETHPrice, setETHPrice] = useState("------");
    const [SLPPer, setSLPPer] = useState("----- %");
    const [AXSPer, setAXSPer] = useState("----- %");
    const [ETHPer, setETHPer] = useState("----- %");

    const db = SQLite.openDatabase('AppDatabase.db');

    const isFocused = useIsFocused();

    async function getPriceInfo() {
        return new Promise((resolve, _reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    "SELECT SetValue from Settings WHERE UserSettings='Currency'", null,
                    (tx, results) => {
                        for (let i = 0; i < results.rows.length; i++) {
                            resolve(results.rows.item(i).SetValue);
                        }
                    }
                );
            }, (t, error) => { console.log("Error: " + error); resolve() },
            (t, success) => { resolve() })
        })
    }

    async function getPriceInfos() {

        const currency = await getPriceInfo();

        console.log("Currency: " + currency);

        const result_slp = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=smooth-love-potion&vs_currencies=" + currency + "&include_24hr_change=true", {timeout: 2000})
            .then(res => res.data).catch(err => {
                console.log("Error: " + err.message);
        });

        if (result_slp != null) {
            Object.keys(result_slp).forEach(
                val => {
                    if (currency === "PHP") {
                        console.log(result_slp[val].php);
                        console.log(result_slp[val].php_24h_change);

                        if (result_slp[val].php > 999999) {
                            let a = (result_slp[val].php/1000000).toFixed(3).toString() + "M";
                            setSLPPrice(currency + " " + a);
                        }
                        else if (result_slp[val].php > 99999) {
                            let a = (result_slp[val].php/1000).toFixed(2).toString() + "k";
                            setSLPPrice(currency + " " + a);
                        }
                        else if (result_slp[val].php > 999) {
                            let a = (result_slp[val].php/1000).toFixed(3).toString() + "k";
                            setSLPPrice(currency + " " + a);
                        }
                        else {
                            setSLPPrice(currency + " " + result_slp[val].php.toFixed(2).toString());
                        }

                        setSLPPer(result_slp[val].php_24h_change.toFixed(2).toString() + " %");
                    }
                    if (currency === "USD") {
                        console.log(result_slp[val].usd);
                        console.log(result_slp[val].usd_24h_change);

                        if (result_slp[val].usd > 999999) {
                            let a = (result_slp[val].usd/1000000).toFixed(3).toString() + "M";
                            setSLPPrice(currency + " " + a);
                        }
                        else if (result_slp[val].usd > 99999) {
                            let a = (result_slp[val].usd/1000).toFixed(2).toString() + "k";
                            setSLPPrice(currency + " " + a);
                        }
                        else if (result_slp[val].usd > 999) {
                            let a = (result_slp[val].usd/1000).toFixed(3).toString() + "k";
                            setSLPPrice(currency + " " + a);
                        }
                        else {
                            setSLPPrice(currency + " " + result_slp[val].usd.toFixed(2).toString());
                        }

                        setSLPPer(result_slp[val].usd_24h_change.toFixed(2).toString() + " %");
                    }
                }
            )
        }

        const result_axs = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=axie-infinity&vs_currencies=" + currency + "&include_24hr_change=true", {timeout: 2000})
            .then(res => res.data).catch(err => {
                console.log("Error: " + err.message);
        });

        if (result_axs != null) {
            Object.keys(result_axs).forEach(
                val => {
                    if (currency === "PHP") {
                        console.log(result_axs[val].php);
                        console.log(result_axs[val].php_24h_change);

                        if (result_axs[val].php > 999999) {
                            let a = (result_axs[val].php/1000000).toFixed(3).toString() + "M";
                            setAXSPrice(currency + " " + a);
                        }
                        else if (result_axs[val].php > 99999) {
                            let a = (result_axs[val].php/1000).toFixed(2).toString() + "k";
                            setAXSPrice(currency + " " + a);
                        }
                        else if (result_axs[val].php > 999) {
                            let a = (result_axs[val].php/1000).toFixed(3).toString() + "k";
                            setAXSPrice(currency + " " + a);
                        }
                        else {
                            setAXSPrice(currency + " " + result_axs[val].php.toFixed(2).toString());
                        }

                        setAXSPer(result_axs[val].php_24h_change.toFixed(2).toString() + " %");
                    }
                    if (currency === "USD") {
                        console.log(result_axs[val].usd);
                        console.log(result_axs[val].usd_24h_change);

                        if (result_axs[val].usd > 999999) {
                            let a = (result_axs[val].usd/1000000).toFixed(3).toString() + "M";
                            setAXSPrice(currency + " " + a);
                        }
                        else if (result_axs[val].usd > 99999) {
                            let a = (result_axs[val].usd/1000).toFixed(2).toString() + "k";
                            setAXSPrice(currency + " " + a);
                        }
                        else if (result_axs[val].usd > 999) {
                            let a = (result_axs[val].usd/1000).toFixed(3).toString() + "k";
                            setAXSPrice(currency + " " + a);
                        }
                        else {
                            setAXSPrice(currency + " " + result_axs[val].usd.toFixed(2).toString());
                        }
                        
                        setAXSPer(result_axs[val].usd_24h_change.toFixed(2).toString() + " %");
                    }
                }
            )
        }

        const result_eth = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=" + currency + "&include_24hr_change=true", {timeout: 2000})
            .then(res => res.data).catch(err => {
                console.log("Error: " + err.message);
        });

        if (result_eth != null) {
            Object.keys(result_eth).forEach(
                val => {
                    if (currency === "PHP") {
                        console.log(result_eth[val].php);
                        console.log(result_eth[val].php_24h_change);

                        if (result_eth[val].php > 999999) {
                            let a = (result_eth[val].php/1000000).toFixed(3).toString() + "M";
                            setETHPrice(currency + " " + a);
                        }
                        else if (result_eth[val].php > 99999) {
                            let a = (result_eth[val].php/1000).toFixed(2).toString() + "k";
                            setETHPrice(currency + " " + a);
                        }
                        else if (result_eth[val].php > 999) {
                            let a = (result_eth[val].php/1000).toFixed(3).toString() + "k";
                            setETHPrice(currency + " " + a);
                        }
                        else {
                            setETHPrice(currency + " " + result_eth[val].php.toFixed(2).toString());
                        }

                        setETHPer(result_eth[val].php_24h_change.toFixed(2).toString() + " %");
                    }
                    if (currency === "USD") {
                        console.log(result_eth[val].usd);
                        console.log(result_eth[val].usd_24h_change);

                        if (result_eth[val].usd > 999999) {
                            let a = (result_eth[val].usd/1000000).toFixed(3).toString() + "M";
                            setETHPrice(currency + " " + a);
                        }
                        else if (result_eth[val].usd > 99999) {
                            let a = (result_eth[val].usd/1000).toFixed(2).toString() + "k";
                            setETHPrice(currency + " " + a);
                        }
                        else if (result_eth[val].usd > 999) {
                            let a = (result_eth[val].usd/1000).toFixed(3).toString() + "k";
                            setETHPrice(currency + " " + a);
                        }
                        else {
                            setETHPrice(currency + " " + result_eth[val].usd.toFixed(2).toString());
                        }
                        
                        setETHPer(result_eth[val].usd_24h_change.toFixed(2).toString() + " %");
                    }
                }
            )
        }
    }

    useEffect(() => {
        getPriceInfos();
    }, []);

    useEffect(() => { 
        const newtime = setInterval(getPriceInfos, 30000);
        return () => clearInterval(newtime);
    }, [isFocused]);

    const slp = Asset.fromModule(require('../../assets/images/slp.png')).uri;
    const axs = Asset.fromModule(require('../../assets/images/axs.png')).uri;
    const etherium = Asset.fromModule(require('../../assets/images/etherium.png')).uri;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cryptocon}>
                <CryptoPriceContainer url={slp} price={SLPPrice} per={SLPPer} />
                <CryptoPriceContainer url={axs} price={AXSPrice} per={AXSPer} />
                <CryptoPriceContainer url={etherium} price={ETHPrice} per={ETHPer} />
            </View>
            <ScrollView style={styles.scrollview}>
                <View style={styles.totalmaincontainer}>
                    <View style={styles.totalcontainer}>

                    </View>
                </View>
                <View style={styles.totalmaincontainer}>
                    <View style={styles.totalLeftContainer}>

                    </View>
                    <View style={styles.totalRightContainer}>

                    </View>
                </View>
                <View style={styles.totalmaincontainer}>
                    <View style={styles.totalLeftContainer}>

                    </View>
                    <View style={styles.totalRightContainer}>

                    </View>
                </View>
                <View style={styles.totalmaincontainer}>
                    <View style={styles.totalLeftBottomContainer}>

                    </View>
                    <View style={styles.totalRightBottomContainer}>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function CryptoPriceContainer(props) {
    return (
        <View style={styles.cryptocomp}>
            <View style={styles.cryptoimage}>
                <Animatable.Image 
                    animation="pulse" 
                    easing="ease-out" 
                    iterationCount="infinite"
                    style={styles.cryptoimg}
                    source={{uri: props.url}}
                    resizeMode="stretch"
                />
            </View>
            <View style={styles.crytoinfo}>
                <Text style={styles.cryptoPrice}>{props.price}</Text>
                {props.per.includes('-') ? 
                    <Text style={styles.cryptoPerDown}>{props.per}</Text> : 
                    <Text style={styles.cryptoPerUp}>{props.per}</Text>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#212331',
    },
    scrollview: {
        marginHorizontal: 0,
    },  
    cryptocon: {
        flexDirection: 'row',
        marginTop: 20,
    },
    cryptocomp: {
        width: '30%',
        height: 60,
        marginLeft: '2.5%',
        borderRadius: 25,
        flexDirection: 'row',
    },
    cryptoimage: {
        width: '30%',
        height: '70%',
        marginLeft: '5%',
        marginTop: '7%',
        justifyContent: 'center',
    },
    cryptoimg: {
        width: '100%',
        height: '100%',
    },
    crytoinfo: {
        width: '60%',
        height: '70%',
        marginTop: '7%',
        marginLeft: '3%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cryptoPrice: {
        color: 'white',
        fontSize: 15,
    },
    cryptoPerUp: {
        color: 'green',
        fontSize: 15,
    },
    cryptoPerDown: {
        color: 'red',
        fontSize: 15,
    },
    totalcontainer: {
        height: 150,
        width: '94.6%',
        marginLeft: '2.7%',
        marginRight: '2.7%',
        backgroundColor: '#36394F',
        borderRadius: 40,
    },
    totalmaincontainer: {
        flex: 1,
        backgroundColor: '#212331',
        marginTop: 15,
        flexDirection: 'row',
    },
    totalLeftContainer: {
        height: 160,
        width: '46%',
        backgroundColor: '#36394F',
        marginLeft: '2.7%',
        marginRight: '1.3%',
        borderRadius: 40,
    },
    totalRightContainer: {
        height: 160,
        width: '46%',
        backgroundColor: '#36394F',
        marginLeft: '1.3%',
        marginRight: '2.7%',
        borderRadius: 40,
    },
    totalLeftBottomContainer: {
        height: 160,
        width: '46%',
        backgroundColor: '#36394F',
        marginLeft: '2.7%',
        marginRight: '1.3%',
        borderRadius: 40,
        marginBottom: 15,
    },
    totalRightBottomContainer: {
        height: 160,
        width: '46%',
        backgroundColor: '#36394F',
        marginLeft: '1.3%',
        marginRight: '2.7%',
        borderRadius: 40,
        marginBottom: 15,
    },
});