import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './Home';
import BreedingSimulator from '../breeding/Breedingsimulator';
import Settings from '../settings/Settings';
import Tracker from '../tracker/Tracker';
import * as Animatable from 'react-native-animatable';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();

export default function Main() {
    return (
        <NavigationContainer>
            <Drawer.Navigator 
                initialRouteName="Home"
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    drawerStyle: {
                        backgroundColor: '#36394F',
                    },
                    drawerLabelStyle: {
                        fontSize: 18
                    },
                    drawerActiveTintColor: 'white',
                    drawerInactiveTintColor: 'white',
                }}
            >
                <Drawer.Screen 
                    name="Dashboard" 
                    component={Home} 
                    options={{ 
                        title: 'Dashboard',
                        headerStyle: {
                            backgroundColor: '#212331',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                        },
                        headerTitleStyle: {
                            fontSize: 23,
                            letterSpacing: 2,
                            color: '#fff',
                            fontWeight: 'bold',
                        },
                        headerTintColor: '#fff',
                        drawerIcon: ({focused, size}) => (
                            <FontAwesome5 name="home" size={24} color="white" />
                        ),
                    }}
                />
                <Drawer.Screen 
                    name="Scholar Tracker" 
                    component={Tracker} 
                    options={{ 
                        title: 'Scholar Tracker',
                        headerStyle: {
                            backgroundColor: '#212331',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                        },
                        headerTitleStyle: {
                            fontSize: 23,
                            letterSpacing: 2,
                            color: '#fff',
                            fontWeight: 'bold',
                        },
                        headerTintColor: '#fff',
                        drawerIcon: ({focused, size}) => (
                            <MaterialCommunityIcons name="trackpad" size={24} color="white" />
                        ),
                    }}
                />
                <Drawer.Screen 
                    name="Breeding" 
                    component={BreedingSimulator} 
                    options={{ 
                        title: 'Breeding Simulator',
                        headerStyle: {
                            backgroundColor: '#212331',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                        },
                        headerTitleStyle: {
                            fontSize: 23,
                            letterSpacing: 2,
                            color: '#fff',
                            fontWeight: 'bold',
                        },
                        headerTintColor: '#fff',
                        drawerIcon: ({focused, size}) => (
                            <Fontisto name="test-tube" size={24} color="white" />
                        ),
                    }}
                />
                <Drawer.Screen 
                    name="Settings" 
                    component={Settings} 
                    options={{ 
                        title: 'Settings',
                        headerStyle: {
                            backgroundColor: '#212331',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                        },
                        headerTitleStyle: {
                            fontSize: 23,
                            letterSpacing: 2,
                            color: '#fff',
                            fontWeight: 'bold',
                        },
                        headerTintColor: '#fff',
                        drawerIcon: ({focused, size}) => (
                            <FontAwesome5 name="tools" size={24} color="white" />
                        ),
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

function CustomDrawerContent(props) {
    return (
        <SafeAreaView style={{ flex: 1}}>
            <Animatable.Image 
                animation="pulse" 
                easing="ease-out" 
                iterationCount="infinite"
                style={customStyles.sideMenuProfileIcon}
                source={require('../../assets/images/slp.png')}
                resizeMode="center"
            />
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem 
                    label={() => (
                            <Text style={{ fontSize: 18, color: 'white' }}>About App</Text>
                    )}
                    onPress={() => 
                        Alert.alert(
                            "About App",
                            "Axie Manager Mobile Application @ 2021")
                    } 
                    icon={() =>
                        <FontAwesome5 name="info-circle" size={24} color="white" />
                    }
                />
            </DrawerContentScrollView>
            <Text style={{ fontSize: 18, textAlign: 'left', color: 'white', marginBottom: 5, marginLeft: 15 }}>
                Please if you find this application useful consider donating any SLP, AXS, WETH. Thank you for using this tool. 💙💙💙
            </Text>
            <Text style={{ fontSize: 18, textAlign: 'left', color: 'lightblue', marginBottom: 50, marginLeft: 15 }}>
                Donate <FontAwesome5 name="copy" size={18} color="lightblue" onPress={() => CopyRonin()}/>
            </Text>
            <Text style={{ fontSize: 18, textAlign: 'center', color: 'white', marginBottom: 16 }}>
                Axie Manager App @ 2021
            </Text>
        </SafeAreaView>
    );
}

function CopyRonin() {
    Clipboard.setString('ronin:abe87f7302f0297462b2201649159b78edebe58ff');
    Alert.alert("", "Copied Ronin Address. Thanks for the support! 💙");
}

const customStyles = StyleSheet.create({
    sideMenuProfileIcon: {
        marginTop: 16,
        marginBottom: 16,
        resizeMode: 'center',
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        alignSelf: 'center',
    },
    iconStyle: {
      width: 15,
      height: 15,
      marginHorizontal: 5,
    },
    customItem: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
    },
});