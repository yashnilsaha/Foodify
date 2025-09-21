import React from "react";
import { StyleSheet, Text, Image, Pressable } from "react-native";

function getResponseData() {
    return [['1','2','3','4'],['5','6','7']];
}

export default function HistoryEntry({ navigation, text, imageURI }) {
    return (
        <Pressable style={styles.container} onPress={() => {
            navigation.navigate("Breakdown", { imagePath: imageURI, responseData: getResponseData()});
        }}>
            <Image source={require('../assets/goodExample.png')} style={styles.icon} />
            <Text style={styles.text}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth : 2,
        padding: 8,
        borderRadius: 10
    },
    text: {
        paddingRight: 10,
        paddingLeft: 5,
        paddingTop: 25,
        fontSize: 20
    },
    icon: {
        width: '50%',
        height: 100,
        resizeMode: 'contain',
        borderRadius: 5
    }
})
