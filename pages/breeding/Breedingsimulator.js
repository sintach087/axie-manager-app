import React from 'react';
import {Text, View, StyleSheet, TextInput, Alert, TouchableOpacity, ScrollView, Dimensions} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Asset} from 'expo-asset';
import { GetImageOfAxie } from './breedfunc';
import { getAxie, getTraits, sumProbs, isBreedable } from './breedfunc';

export default function BreedingSimulator() {

    const [axieone, setAxieOne] = React.useState('');
    const [axietwo, setAxieTwo] = React.useState('');
    const [timer1, setTimer1] = React.useState(null);
    const [timer2, setTimer2] = React.useState(null);
    const [axie1, setAxie1] = React.useState(Asset.fromModule(require('../../assets/images/froot_loop_white.png')).uri);
    const [axie2, setAxie2] = React.useState(Asset.fromModule(require('../../assets/images/star_boy_white.png')).uri);

    function SetImageAxie1(val) {
        if (val === '') {
            setAxie1(Asset.fromModule(require('../../assets/images/froot_loop_white.png')).uri);
            setAxieOne('');
        }
        else if (isNaN(val) === false && val !== '') {
            setAxieOne(val);

            if (timer1) {
                clearTimeout(timer1);
                setTimer1(null);
            }
            setTimer1(
                setTimeout(() => {
                    setAxie1(GetImageOfAxie(val));
                }, 1000)
            );
        }
    }
    function SetImageAxie2(val) {
        if (val === '') {
            setAxie2(Asset.fromModule(require('../../assets/images/star_boy_white.png')).uri);
            setAxieTwo('');
        }
        else if (isNaN(val) === false && val !== '') {
            setAxieTwo(val);

            if (timer2) {
                clearTimeout(timer2);
                setTimer2(null);
            }
            setTimer2(
                setTimeout(() => {
                    setAxie2(GetImageOfAxie(val));
                }, 1000)
            );
        }
    }
    async function Calculate() {
        if (axieone === "" || axietwo === "") {
            Alert.alert("Error","Kindly specify the axie ID. Thanks!");
            console.log("Kindly specify the axie ID. Thanks!");
        }
        else if (axieone === axietwo) {
            Alert.alert("Error","Cannot calculate same axie!");
            console.log("Cannot calculate same axie!");
        }
        else {
            let axie1details = await getAxie(axieone);
            let axie2details = await getAxie(axietwo);

            if (!axie1details) {
                Alert.alert("Error","Axie #" + axieone + " has no genes or not exists!");
                console.log("Axie #" + axieone + " has no genes or not exists!");
                return;
            }
            if (!axie2details) {
                Alert.alert("Error","Axie #" + axietwo + " has no genes or not exists!");
                console.log("Axie #" + axietwo + " has no genes or not exists!");
                return;
            }
            if (!isBreedable(axie1details, axie2details)) {
                Alert.alert("Error","These two axie is related to each other and cannot be breed!");
                console.log("These two axie is related to each other and cannot be breed!");
                return;
            }

            let axie1Traits = getTraits(axie1details.genes);
            let axie2Traits = getTraits(axie2details.genes);

            var patternProbs = sumProbs(axie1Traits.pattern, axie2Traits.pattern);
            var colorProbs = sumProbs(axie1Traits.color, axie2Traits.color);
            var eyesProbs = sumProbs(axie1Traits.eyes, axie2Traits.eyes);
            var mouthProbs = sumProbs(axie1Traits.mouth, axie2Traits.mouth);
            var earsProbs = sumProbs(axie1Traits.ears, axie2Traits.ears);
            var hornProbs = sumProbs(axie1Traits.horn, axie2Traits.horn);
            var backProbs = sumProbs(axie1Traits.back, axie2Traits.back);
            var tailProbs = sumProbs(axie1Traits.tail, axie2Traits.tail);

            console.log(patternProbs);
            console.log(colorProbs);
            console.log(eyesProbs);
            console.log(mouthProbs);
            console.log(earsProbs);
            console.log(hornProbs);
            console.log(backProbs);
            console.log(tailProbs);
        }
    }

    return (
        <ScrollView style={styles.scrollview}>
            <TitleView />
            <StartUpView input={SetImageAxie1} axie_1={axie1} _axie1={axieone}/>
            <StartDownView input={SetImageAxie2} axie_2={axie2} _axie2={axietwo}/>
            <CalcBreed setimage={Calculate}/>
            <CalcResult />
        </ScrollView>
    );
}

function TitleView() {
    return (
        <View style={styles.title_view}>
            <Text style={styles.title_text_view}>Breeding Simulator</Text>
            <Text style={styles.title_text2_view}>
                Paste two IDs of the Axies you want to breed into the following form and simulate breeding as often as you want, to get an idea of what outcome to expect.
            </Text>
        </View>
    );
}

function StartUpView(props) {
    return (
        <View style={styles.start_view}>
            <Animatable.Image 
                 style={styles.axieimg}
                source={{uri: props.axie_1}}
                resizeMode="stretch"
            />
            <Text style={styles.title_text2_view}>Axie 1</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, padding: 5, marginTop: 10, width: '50%', color: 'white', textAlign: 'center' }}
                onChangeText={text => props.input(text)}
                value={props._axie1}
            />
        </View>
    );
}
function StartDownView(props) {
    return (
        <View style={styles.start_view}>
            <Animatable.Image 
                style={styles.axieimg}
                source={{uri: props.axie_2}}
                resizeMode="stretch"
            />
            <Text style={styles.title_text2_view}>Axie 2</Text>
            <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 20, padding: 5, marginTop: 10, width: '50%', color: 'white', textAlign: 'center' }}
                onChangeText={text => props.input(text)}
                value={props._axie2}
            />
        </View>
    );
}
function CalcBreed(props) {
    return (
        <View style={styles.button_view}>
            <TouchableOpacity style={{ borderRadius: 10, width: '40%', backgroundColor: '#007bff', height: '35%', alignItems: 'center', padding: 10 }} onPress={() => props.setimage()}>
                <Text style={{ color: 'white', letterSpacing: 2, fontSize: 15 }}>Calculate</Text>
            </TouchableOpacity>
        </View>
    );
}

function CalcResult() {
    return (
        <View style={styles.calcresult}>
            <View style={styles.calcaxie}>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    calcresult: {
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get("screen").height * 0.7,
        width: Dimensions.get("screen").width,
    },
    calcaxie: {
        width: Dimensions.get("window").width * 0.7,
        height: Dimensions.get("window").height * 0.6,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        backgroundColor: 'rgba(0,0,0,.4)',
        borderColor: 'rgba(255,255,255,.3)',
    },
    title_view: {
        height: Dimensions.get("window").height * 0.14,
        width: Dimensions.get("screen").width,
        padding: 20,
    },
    title_text_view: {
        fontSize: 21,
        color: 'white',
        letterSpacing: 2,
    },
    title_text2_view: {
        marginTop: 10,
        fontSize: 13,
        color: 'white',
        letterSpacing: 2,
    },
    start_view: {
        height: Dimensions.get("screen").height * 0.29,
        width: Dimensions.get("screen").width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_view: {
        height: Dimensions.get("window").height * 0.14,
        width: Dimensions.get("screen").width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    axieimg: {
        width: Dimensions.get("window").height * 0.27,
        height: Dimensions.get("window").width * 0.4,
    },
    scrollview: {
        marginHorizontal: 0,
        flex: 1,
        backgroundColor: '#242735',
    },
});