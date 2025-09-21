import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PersonIcon from '../components/Profile';
import Icon from "react-native-vector-icons/Ionicons";
import InfoCircleIcon from '../components/InfoCircle';

export default function Breakdown({ route, navigation }) {
  const { imagePath, responseData } = route.params;
  const insets = useSafeAreaInsets();
  const [isSaved, setIsSaved] = useState(false);

  // Debug: Log the response data to see its structure
  console.log('Response Data:', responseData);
  console.log('Current Response Structure:', JSON.stringify(responseData, null, 2));
  
  // Handle different possible response formats
  let detectedFoods, nutritionData, foodCategory;
  
  if (Array.isArray(responseData) && responseData.length >= 2) {
    // The first element is an array that contains [food_name, nutrition_object]
    if (Array.isArray(responseData[0])) {
      const firstArray = responseData[0];
      
      // Extract food name (first element) and nutrition data (second element if it's an object)
      detectedFoods = [firstArray[0]]; // Just the food name
      
      // Check if second element in the array is the nutrition object
      if (firstArray.length > 1 && typeof firstArray[1] === 'object' && firstArray[1].calories) {
        nutritionData = firstArray[1];
      } else {
        nutritionData = null;
      }
      
      // The second element is the category
      foodCategory = responseData[1];
    } else {
      // Fallback for other formats
      detectedFoods = [responseData[0]];
      nutritionData = responseData[1];
      foodCategory = null;
    }
  } else {
    detectedFoods = ["Unknown Food"];
    nutritionData = null;
    foodCategory = null;
  }
  
  console.log('Detected Foods:', detectedFoods);
  console.log('Nutrition Data:', nutritionData);
  console.log('Food Category:', foodCategory);
  
  // Get the primary food (first one in the array)
  let yourFood = Array.isArray(detectedFoods) && detectedFoods.length > 0 
    ? detectedFoods[0] 
    : "Unknown Food";
  
  // Format the display name and ensure it's a string
  let displayName = "Unknown Food";
  if (typeof yourFood === 'string') {
    displayName = yourFood.includes("_") ? yourFood.split("_").join(" ") : yourFood;
  } else if (yourFood && yourFood.name) {
    // If yourFood is an object with a name property
    displayName = yourFood.name.includes("_") ? yourFood.name.split("_").join(" ") : yourFood.name;
  }
  
  // Handle suggestions based on available data
  let suggestions;
  if (nutritionData && nutritionData.healthier_suggestion) {
    suggestions = [nutritionData.healthier_suggestion];
  } else {
    suggestions = [
      "Try to balance your meal with more vegetables and lean proteins",
      "Consider portion control and mindful eating",
      "Add more whole grains and fiber to your diet"
    ];
  }
  
  // All detected foods
  const detected = Array.isArray(detectedFoods) ? detectedFoods : [displayName];

  // Determine if food is unhealthy based on calories and other factors
  const isUnhealthy = nutritionData && (
    nutritionData.calories > 500 || 
    nutritionData.fat_g > 15 ||
    (typeof displayName === 'string' && (
      displayName.toLowerCase().includes('fried') ||
      displayName.toLowerCase().includes('cake') ||
      displayName.toLowerCase().includes('dessert')
    ))
  );

  const saveMeal = async () => {
    try {
      // Create meal entry object with real nutrition data
      const mealEntry = {
        id: Date.now().toString(),
        title: displayName,
        date: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        image: imagePath,
        isHealthy: !isUnhealthy,
        detected: detected,
        suggestions: suggestions,
        // Use actual nutrition data from AI analysis
        stats: {
          Calories: nutritionData?.calories?.toString() || "N/A",
          Carbs: nutritionData?.carbs_g ? `${nutritionData.carbs_g}g` : "N/A",
          Fats: nutritionData?.fat_g ? `${nutritionData.fat_g}g` : "N/A",
          Proteins: nutritionData?.protein_g ? `${nutritionData.protein_g}g` : "N/A"
        },
        servingSize: nutritionData?.serving_size || "N/A"
      };

      // Get existing meals from storage
      const existingMeals = await AsyncStorage.getItem('mealHistory');
      const meals = existingMeals ? JSON.parse(existingMeals) : [];
      
      // Add new meal to the beginning of the array
      meals.unshift(mealEntry);
      
      // Save back to storage
      await AsyncStorage.setItem('mealHistory', JSON.stringify(meals));
      
      setIsSaved(true);
      Alert.alert("Success", "Meal saved to history!");
    } catch (error) {
      console.error('Error saving meal:', error);
      Alert.alert("Error", "Failed to save meal. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 48 }} />
        <Text style={styles.headerTitle}>Breakdown</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Text style={{ fontSize: 18 }}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Image */}
        <ImageBackground
          source={{ uri: imagePath }}
          style={styles.imageBackground}
        />

        {/* Badge */}
        <View style={styles.badgeContainer}>
          <Text style={[styles.badge, isUnhealthy ? styles.badgeUnhealthy : styles.badgeHealthy]}>
            {isUnhealthy ? "Unhealthy" : "Healthy"}
          </Text>
        </View>

        {/* Detected Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Foods</Text>
          <View style={styles.card}>
            <Text style={styles.smallLabel}>Primary Item</Text>
            <Text style={styles.primaryItem}>{displayName}</Text>
            {nutritionData?.serving_size && (
              <Text style={styles.servingSize}>Serving: {nutritionData.serving_size}</Text>
            )}
          </View>
          {detected.length > 1 && detected.slice(1).map((item, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.additionalItem}>
                {typeof item === 'string' ? item : 'Unknown Item'}
              </Text>
            </View>
          ))}
          {foodCategory && Array.isArray(foodCategory) && foodCategory.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.smallLabel}>Category</Text>
              <Text style={styles.categoryText}>{foodCategory.join(", ")}</Text>
            </View>
          )}
        </View>

        {/* Nutrition Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrition Information</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {nutritionData?.calories ? nutritionData.calories.toString() : "N/A"}
              </Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {nutritionData?.carbs_g ? `${nutritionData.carbs_g}g` : "N/A"}
              </Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {nutritionData?.fat_g ? `${nutritionData.fat_g}g` : "N/A"}
              </Text>
              <Text style={styles.nutritionLabel}>Fats</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {nutritionData?.protein_g ? `${nutritionData.protein_g}g` : "N/A"}
              </Text>
              <Text style={styles.nutritionLabel}>Proteins</Text>
            </View>
          </View>
          {!nutritionData && (
            <Text style={styles.nutritionNote}>
              Specific nutrition data not available for multiple food detection
            </Text>
          )}
        </View>

        {/* Healthy Alternatives */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Healthy Alternative Suggestions</Text>
          {suggestions.map((item, i) => (
            <View key={i} style={styles.card}>
              <Text>{typeof item === 'string' ? item : JSON.stringify(item)}</Text>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={[styles.saveButton, isSaved && styles.saveButtonDisabled]} 
            onPress={saveMeal}
            disabled={isSaved}
          >
            <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextDisabled]}>
              {isSaved ? "✓ Saved to History" : "Save to History"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <PersonIcon size={23} path="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("History")}>
          <PersonIcon size={20} path="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Help")}>
          <InfoCircleIcon size={20} path="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
          <Text style={styles.navText}>Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f8f7" },
  header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 16,
  paddingTop: 16, // keep normal padding
  marginTop: 30, // 👈 push header down
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
},
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: { width: "100%", height: 200 },
  badgeContainer: { alignItems: "center", marginVertical: 16 },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 9999,
    fontWeight: "bold",
    fontSize: 14,
  },
  badgeUnhealthy: { backgroundColor: "#fecaca", color: "#7f1d1d" },
  badgeHealthy: { backgroundColor: "#bbf7d0", color: "#14532d" },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  card: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    marginBottom: 8,
  },
  smallLabel: { fontSize: 12, color: "#666" },
  primaryItem: { fontSize: 16, fontWeight: "bold" },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 16,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#122017',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  additionalItem: {
    fontSize: 14,
    color: '#333',
  },
  categoryText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  nutritionNote: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  servingSize: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: "#38e07b",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  saveButtonText: { 
    color: "#122017", 
    fontWeight: "bold",
    fontSize: 16,
  },
  saveButtonTextDisabled: {
    color: "#ffffff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    backgroundColor: "rgba(246,248,247,0.95)",
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  navItem: { alignItems: "center" },
  navText: {
    fontSize: 12,
    color: "rgba(18,32,23,0.7)",
    marginTop: 4,
  },
});