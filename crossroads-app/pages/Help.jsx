import React from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Svg, { Path, Polyline } from "react-native-svg";

export default function Help({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40, height: 40 }} />
        <Text style={styles.headerTitle}>Info & Help</Text>
        <View style={{ width: 40, height: 40 }} />
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is this App for?</Text>
          <Text style={styles.sectionText}>
            Our app helps you track your food intake and suggests healthier
            alternatives. Just snap a photo of your meal to get started!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use the App</Text>

          {/* Step 1 */}
          <View style={styles.stepRow}>
            <View style={styles.iconCircle}>
              <Svg
                width={24}
                height={24}
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                viewBox="0 0 24 24"
              >
                <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </Svg>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>1. Snap a Photo of Your Meal</Text>
              <Text style={styles.sectionText}>
                Use the camera to take a clear picture of your food. Our AI will
                identify the items on your plate.
              </Text>
            </View>
          </View>

          <View style={styles.imageWrapper}>
            <Image
              source={require("../assets/goodExample.png")}
              style={styles.exampleImage}
            />
          </View>

          {/* Step 2 */}
          <View style={styles.stepRow}>
            <View style={styles.iconCircle}>
              <Svg
                width={24}
                height={24}
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                viewBox="0 0 24 24"
              >
                <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </Svg>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>2. Get Healthier Alternatives</Text>
              <Text style={styles.sectionText}>
                The app will analyze the nutrition and suggest healthier food
                choices to help you achieve your goals.
              </Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.stepRow}>
            <View style={styles.iconCircle}>
              <Svg
                width={24}
                height={24}
                stroke="currentColor"
                strokeWidth={2}
                fill="none"
                viewBox="0 0 24 24"
              >
                <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </Svg>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>3. View Your History</Text>
              <Text style={styles.sectionText}>
                Track your progress and review your past meals and nutritional
                intake in the 'History' tab.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Svg
            width={24}
            height={24}
            stroke="white"
            strokeWidth={2}
            fill="none"
            viewBox="0 0 24 24"
          >
            <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <Polyline points="9 22 9 12 15 12 15 22" />
          </Svg>
          <Text style={styles.homeButtonText}>Return Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f8f7" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#111" },
  scrollContent: { padding: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  sectionText: { fontSize: 14, color: "#444" },
  stepRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(56,224,123,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  imageWrapper: { alignItems: "center", marginVertical: 16 },
  exampleImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },
  footer: { padding: 16, borderTopWidth: 1, borderColor: "#ddd" },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#38e07b",
    borderRadius: 30,
    height: 48,
    gap: 8,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
