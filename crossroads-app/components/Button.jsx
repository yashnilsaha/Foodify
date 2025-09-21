import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

export default function Button(props) {
  const { onPress, title = 'Save', paddingVertical = 12, paddingHorizontal = 32, borderRadius = 10, marginBottom} = props;

  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: paddingVertical,
      paddingHorizontal: paddingHorizontal,
      borderRadius: borderRadius,
      marginBottom: marginBottom,
      borderColor : "black",
      borderWidth : 2,
      elevation: 3,
      backgroundColor: 'pink',
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
  });

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

