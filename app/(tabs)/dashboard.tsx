import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
// @ts-ignore
import { PieChart } from 'react-native-chart-kit';

const { width: screenWidth } = Dimensions.get('window');

// Type Definitions
type TripMode = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

type TrafficZone = {
  zone: string;
  level: number;
  color: string;
};

type IconName = "mapPin" | "gift" | "sun" | "moon" | "refresh" | "leaf" | "flame" | "steps" | "savings";

interface IconProps {
  name: IconName;
  size?: number;
  style?: StyleProp<TextStyle>;
}

interface StatCardProps {
  icon: IconName;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  styles: ReturnType<typeof getStyles>;
}

export interface HomeScreenProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  refreshing: boolean;
  handleRefresh: () => void;
  userPoints: number;
}

// Data
const tripsByMode: TripMode[] = [
  { name: "Car", population: 120, color: "#0088FE", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  { name: "Bus", population: 80, color: "#00C49F", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  { name: "Metro", population: 60, color: "#FFBB28", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  { name: "Walk", population: 40, color: "#FF8042", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  { name: "Bike", population: 30, color: "#A020F0", legendFontColor: "#7F7F7F", legendFontSize: 12 },
];

const trafficZones: TrafficZone[] = [
  { zone: "Downtown", level: 90, color: "#ef4444" },
  { zone: "Airport", level: 75, color: "#f97316" },
  { zone: "Mall Area", level: 60, color: "#eab308" },
  { zone: "Suburbs", level: 30, color: "#22c55e" },
];

// Helper Components
const Icon: React.FC<IconProps> = ({ name, size = 24, style }) => {
  const icons: Record<IconName, string> = {
    mapPin: "📍", gift: "🎁", sun: "☀️", moon: "🌙", refresh: "🔄",
    leaf: "🌱", flame: "🔥", steps: "👣", savings: "💵",
  };
  return <Text style={[{ fontSize: size }, style]}>{icons[name] || "●"}</Text>;
};

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, color, styles }) => (
  <View style={[styles.statCard, { borderColor: color + '40' }]}>
    <Icon name={icon} size={28} style={{ color, marginBottom: 8 }} />
    <Text style={styles.statCardTitle}>{title}</Text>
    <Text style={[styles.statCardValue, { color }]}>{value}</Text>
    <Text style={styles.statCardSubtitle}>{subtitle}</Text>
  </View>
);

// Main Component
const HomeScreen: React.FC<HomeScreenProps> = ({ darkMode, setDarkMode, refreshing, handleRefresh, userPoints }) => {
  const styles = getStyles(darkMode);
  const totalCO2Saved = 240.5;
  const totalCalories = 1250;
  const totalSteps = 8450;
  const savedMoney = 120.75;

  return (
    <ScrollView 
  style={styles.container} 
  contentContainerStyle={styles.scrollContent} 
  showsVerticalScrollIndicator={false}
>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}><View style={styles.titleRow}><Icon name="mapPin" size={24} style={styles.headerIcon} /><Text style={styles.headerTitle}>EcoTravel Dashboard</Text></View><Text style={styles.headerSubtitle}>Smart mobility for a greener tomorrow</Text></View>
          <View style={styles.headerRight}><View style={styles.pointsBadge}><Icon name="gift" size={16} /><Text style={styles.pointsText}>{userPoints}</Text></View><TouchableOpacity style={styles.themeToggle} onPress={() => setDarkMode(!darkMode)}><Icon name={darkMode ? "sun" : "moon"} size={20} style={styles.themeIcon} /></TouchableOpacity></View>
        </View>
        <TouchableOpacity style={[styles.refreshButton, refreshing && styles.refreshButtonDisabled]} onPress={handleRefresh} disabled={refreshing}><Icon name="refresh" size={16} style={styles.refreshIcon} /><Text style={styles.refreshText}>{refreshing ? "Refreshing..." : "Refresh Data"}</Text></TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <StatCard styles={styles} icon="leaf" title="CO₂ Saved" value={`${totalCO2Saved} kg`} subtitle="vs driving" color="#22c55e" />
        <StatCard styles={styles} icon="flame" title="Calories" value={totalCalories} subtitle="burned" color="#f97316" />
        <StatCard styles={styles} icon="steps" title="Steps Today" value={totalSteps.toLocaleString()} subtitle="steps" color="#3b82f6" />
        <StatCard styles={styles} icon="savings" title="Money Saved" value={`$${savedMoney}`} subtitle="this week" color="#8b5cf6" />
      </View>

      <View style={styles.card}><View style={styles.cardHeader}><Icon name="mapPin" size={20} style={styles.cardIcon} /><Text style={styles.cardTitle}>Live Traffic Zones</Text></View><View>{trafficZones.map((zone) => (<View key={zone.zone} style={styles.trafficZone}><Text style={styles.zoneName}>{zone.zone}</Text><View style={styles.trafficInfo}><View style={styles.progressBar}><View style={[styles.progressFill, { width: `${zone.level}%`, backgroundColor: zone.color }]} /></View><Text style={[styles.trafficLevel, { color: zone.color }]}>{zone.level}%</Text></View></View>))}</View></View>
      <View style={styles.card}><Text style={styles.cardTitle}>Transport Modes</Text><View style={styles.chartContainer}><PieChart data={tripsByMode} width={screenWidth - 60} height={220} chartConfig={{ color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})` }} accessor="population" backgroundColor="transparent" paddingLeft="15" absolute /></View></View>
    </ScrollView>
  );
};

// Styles remain the same, but the function signature is typed
const getStyles = (darkMode: boolean) => StyleSheet.create({
  container: { paddingHorizontal: 16 },
  header: { backgroundColor: darkMode ? '#1e3a8a' : '#3b82f6', borderRadius: 16, padding: 16, marginBottom: 16, marginTop: 16 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  headerIcon: { color: '#fff', marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#dbeafe' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f59e0b', borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4, marginRight: 8 },
  pointsText: { marginLeft: 4, fontWeight: 'bold' },
  themeToggle: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 16, padding: 6 },
  themeIcon: { color: '#fff' },
  refreshButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginTop: 12, alignSelf: 'flex-start' },
  refreshButtonDisabled: { opacity: 0.5 },
  refreshIcon: { color: '#fff', marginRight: 8 },
  refreshText: { color: '#fff' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { width: '48%', backgroundColor: darkMode ? '#1e1e1e' : '#fff', borderRadius: 12, padding: 12, alignItems: 'center', marginBottom: 12, borderWidth: 1 },
  statCardTitle: { fontSize: 12, color: darkMode ? '#aaa' : '#666' },
  statCardValue: { fontSize: 20, fontWeight: 'bold', marginVertical: 2 },
  statCardSubtitle: { fontSize: 12, color: darkMode ? '#aaa' : '#666' },
  card: { backgroundColor: darkMode ? '#1e1e1e' : '#fff', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardIcon: { marginRight: 8, color: darkMode ? '#3b82f6' : '#1e3a8a' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: darkMode ? '#fff' : '#000' },
  trafficZone: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  zoneName: { color: darkMode ? '#fff' : '#000' },
  trafficInfo: { flexDirection: 'row', alignItems: 'center' },
  progressBar: { width: 80, height: 8, backgroundColor: darkMode ? '#333' : '#e0e0e0', borderRadius: 4, marginRight: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  trafficLevel: { fontWeight: 'bold' },
  chartContainer: { alignItems: 'center' },
  scrollContent: {
    paddingTop: 50, // This pushes the content down. Adjust the number as you like.
    paddingBottom: 94, // Optional: Adds nice spacing at the bottom
  },
});

export default HomeScreen;