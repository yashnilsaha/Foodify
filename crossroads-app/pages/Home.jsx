import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import TitleBar from '../components/TitleBar';
import PersonIcon from '../components/Profile';
import Icon from "react-native-vector-icons/Ionicons";
import InfoCircleIcon from '../components/InfoCircle';

export default function Home({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <TitleBar title="Foodify" />

      {/* Main Content */}
      <View style={styles.main}>
        <ImageBackground
          source={{
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIcRO0iM-OW7ffhfnxl3NB0EcpdLpewt3yhk5LbOa71SUegY_MD2tbhpSFSkbalKqSIzONZlw3BmTbjZHlpll0pUXHf_mTkyxNjsP3eiMsSgG6Up4ADTdHfESV1jO27h3vgvrspFFfrOYXeCMVX98xmmlN4lJas0-KJV0dVqqlEPXhX4s1byBrS6iS1aodbPa5JjENCmuWdJWp6fSGmqMK0ilx6MEWEwbcf3zFTz0L-Lfu25-Tkayug5F4u1W9hmHlKEz6F5R2UP4"
  }}
          style={styles.imageBox}
          imageStyle={{ borderRadius: 20 }}
        />

        <Text style={styles.headline}>
          Track your meals, discover healthier options
        </Text>
        <Text style={styles.subtext}>
          Snap a photo of your food, and we'll identify it and suggest better alternatives.
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("FoodScanner")}
        >
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
            <PersonIcon size={23} path = "M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
            <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("History")}>
            <PersonIcon size={20} path = "M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
            <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
       <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Help")}>
        <InfoCircleIcon size={20} path = "M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
        <Text style={styles.navText}>Info</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8f7',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'flex-start',
  },
  imageBox: {
    width: '100%',
    aspectRatio: 3 / 2,
    marginBottom: 20,
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#122017',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: 'rgba(18,32,23,0.7)',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  ctaButton: {
    backgroundColor: '#38e07b',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#122017',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(18,32,23,0.1)',
    paddingVertical: 12,
    backgroundColor: '#f6f8f7',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: 'rgba(18,32,23,0.5)',
  },
  navTextActive: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#38e07b',
  },
  footer: {
  flexDirection: "row",
  justifyContent: "space-around",
  borderTopWidth: 1,
  borderColor: "#ddd",
  paddingTop: 8,
  backgroundColor: "rgba(246,248,247,0.9)",
},
});



