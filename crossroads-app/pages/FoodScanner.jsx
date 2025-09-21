import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

export default function FoodScanner({ navigation }) {
  const [type, setType] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState("");
  const [camera, setCamera] = useState();

  function toggleCameraType() {
    setType((current) => (current === "back" ? "front" : "back"));
  }

  async function postImage() {
    const response = await fetch(image);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const baseString = reader.result;
      try {
        const res = await axios.post("http://10.48.135.164:5001/image-receiver", {
          baseString,
        });
        navigation.navigate("Breakdown", { imagePath: image, responseData: res.data });
      } catch (err) {
        alert(err);
      }
    };
  }

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity onPress={requestPermission} style={styles.submitButton}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Preview mode
  if (image) {
    return (
      <SafeAreaView style={styles.previewContainer}>
        <Image source={{ uri: image }} style={styles.previewImage} />
        <View style={styles.confirmBox}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Image
              source={{ uri: image }}
              style={{ width: 56, height: 56, borderRadius: 8 }}
            />
            <View>
              <Text style={{ color: "white", fontWeight: "bold" }}>Is this correct?</Text>
              <Text style={{ color: "white", fontSize: 12 }}>Confirm to analyze</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => setImage("")}
            >
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={postImage}>
              <Text style={styles.darkText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Camera mode
  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        type={type}
        ref={(ref) => setCamera(ref)}
        ratio="1:1"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("Home")}
          >
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.shutterButton}
          onPress={async () => {
            if (camera) {
              const data = await camera.takePictureAsync({ base64: true });
              setImage(data.uri);
            }
          }}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>
       
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  footerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  shutterInner: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  previewImage: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },
  confirmBox: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
    padding: 12,
    backgroundColor: "rgba(18,32,23,0.7)",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  retakeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#38e07b",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  darkText: {
    color: "#122017",
    fontWeight: "bold",
  },
});
