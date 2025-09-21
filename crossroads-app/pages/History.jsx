import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from "react-native-svg";

import PersonIcon from '../components/Profile';
import Icon from "react-native-vector-icons/Ionicons";
import InfoCircleIcon from '../components/InfoCircle';

export default function History({ navigation }) {
  const insets = useSafeAreaInsets();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load saved meals from AsyncStorage
  const loadMealHistory = async () => {
    try {
      const savedMeals = await AsyncStorage.getItem('mealHistory');
      if (savedMeals) {
        const parsedMeals = JSON.parse(savedMeals);
        setEntries(parsedMeals);
      } else {
        // Set default sample data if no saved meals exist
        setEntries([
          {
            id: "sample1",
            title: "Spaghetti Bolognese",
            date: "October 26, 2024",
            image: "https://images.unsplash.com/photo-1551892374-ecf8985c9da3?w=400",
            stats: { Calories: "560", Carbs: "65g", Fats: "22g", Proteins: "25g" },
            isHealthy: false,
          },
          {
            id: "sample2", 
            title: "Avocado Toast",
            date: "October 25, 2024",
            image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400",
            stats: { Calories: "320", Carbs: "30g", Fats: "20g", Proteins: "8g" },
            isHealthy: true,
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading meal history:', error);
      Alert.alert('Error', 'Failed to load meal history');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh function for pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadMealHistory();
    setRefreshing(false);
  };

  // Load data when component mounts
  useEffect(() => {
    loadMealHistory();
  }, []);

  // Reload data when screen comes into focus (when user navigates back from other screens)
  useFocusEffect(
    React.useCallback(() => {
      loadMealHistory();
    }, [])
  );

  // Delete a meal entry
  const deleteMeal = async (mealId) => {
    try {
      const updatedMeals = entries.filter(meal => meal.id !== mealId);
      await AsyncStorage.setItem('mealHistory', JSON.stringify(updatedMeals));
      setEntries(updatedMeals);
      Alert.alert('Success', 'Meal deleted from history');
    } catch (error) {
      console.error('Error deleting meal:', error);
      Alert.alert('Error', 'Failed to delete meal');
    }
  };

  // Confirm deletion
  const confirmDelete = (mealId, mealTitle) => {
    Alert.alert(
      'Delete Meal',
      `Are you sure you want to delete "${mealTitle}" from your history?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteMeal(mealId) },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image && (
        <Image 
          source={{ uri: item.image }} 
          style={styles.image}
          onError={(error) => console.log('Image load error:', error)}
        />
      )}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.isHealthy !== undefined && (
              <View style={[
                styles.healthBadge, 
                item.isHealthy ? styles.healthyBadge : styles.unhealthyBadge
              ]}>
                <Text style={[
                  styles.healthBadgeText,
                  item.isHealthy ? styles.healthyBadgeText : styles.unhealthyBadgeText
                ]}>
                  {item.isHealthy ? 'Healthy' : 'Unhealthy'}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            onPress={() => confirmDelete(item.id, item.title)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardDate}>{item.date}</Text>
        <View style={styles.statsRow}>
          {Object.entries(item.stats).map(([label, value]) => (
            <View style={styles.stat} key={label}>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Svg width={24} height={24} fill="currentColor" viewBox="0 0 256 256">
            <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History ({entries.length})</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Entries */}
      {entries.length > 0 ? (
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No meals saved yet!</Text>
          <Text style={styles.emptySubtext}>
            Scan some food and save it to see your history here.
          </Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.scanButtonText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer nav */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 6 }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
          <PersonIcon
            size={23}
            path="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("History")}>
          <PersonIcon
            size={20}
            path="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"
          />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Help")}>
          <InfoCircleIcon
            size={20}
            path="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
          />
          <Text style={styles.navText}>Info</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f8f7" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "rgba(246,248,247,0.9)",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#38e07b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#122017',
    fontWeight: 'bold',
    fontSize: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: { width: "100%", height: 180 },
  cardContent: { padding: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginRight: 8,
    flex: 1,
  },
  healthBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  healthyBadge: {
    backgroundColor: "#bbf7d0",
  },
  unhealthyBadge: {
    backgroundColor: "#fecaca",
  },
  healthBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  healthyBadgeText: {
    color: "#14532d",
  },
  unhealthyBadgeText: {
    color: "#7f1d1d",
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "#dc2626",
    fontWeight: 'bold',
  },
  cardDate: { fontSize: 12, color: "#666", marginBottom: 12 },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  stat: { alignItems: "center", flex: 1 },
  statLabel: { fontSize: 12, color: "#666" },
  statValue: { fontSize: 16, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    backgroundColor: "rgba(246,248,247,0.9)",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: { alignItems: "center" },
  navText: {
    fontSize: 12,
    color: 'rgba(18,32,23,0.5)',
  },
});