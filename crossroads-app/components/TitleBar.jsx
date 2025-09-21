import { View, Text, StyleSheet } from "react-native";

export default function TitleBar({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,        // status bar spacing
    paddingBottom: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f8f7", // matches "background-light" from HTML
    width: "100%",
  },
  title: {
    fontSize: 45,           // matches "text-lg"
    fontWeight: "bold",
    color: "#122017",       // matches "background-dark"
    textAlign: "center",
  },
});
