import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';

interface Coupon {
  id: number;
  title: string;
  calories: number;
  expires: string;
  claimed: boolean;
  points: number;
}

interface IconProps {
  name: 'gift' | 'flame' | 'user';
  size?: number;
  style?: any;
}

// --- Sample Data ---
const coupons: Coupon[] = [
  { id: 1, title: "30% Off Metro Pass", calories: 250, expires: "Dec 31", claimed: false, points: 50 },
  { id: 2, title: "Free Bus Day Pass", calories: 180, expires: "Dec 28", claimed: false, points: 30 },
  { id: 3, title: "Bike Rental Discount", calories: 320, expires: "Jan 5", claimed: true, points: 70 },
  { id: 4, title: "Walking Tour Voucher", calories: 400, expires: "Jan 10", claimed: false, points: 100 },
];

const Icon: React.FC<IconProps> = ({ name, size = 24, style }) => {
  const icons: Record<string, string> = {
    gift: "🎁",
    flame: "🔥",
    user: "👤",
  };
  return <Text style={[{ fontSize: size }, style]}>{icons[name] || "●"}</Text>;
};

const ProfileScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [claimedCoupons, setClaimedCoupons] = useState<Set<number>>(new Set([3]));
  const [userPoints, setUserPoints] = useState<number>(180);

  const totalSteps = 8450;
  const totalCalories = 1250;

  const claimCoupon = (coupon: Coupon) => {
    if (totalCalories < coupon.calories) {
      Alert.alert(
        "Not enough calories!",
        `You need ${coupon.calories} calories to claim this reward.`
      );
      return;
    }
    setClaimedCoupons(prev => new Set([...prev, coupon.id]));
    setUserPoints(prev => prev + coupon.points);
    Alert.alert('Coupon Claimed!', `You earned ${coupon.points} points.`);
  };

  const styles = getStyles(darkMode);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="user" size={24} style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Profile</Text>
          </View>

          <View style={styles.profileContainer}>
            {/* Avatar with Circle Border */}
            <View style={styles.avatar}>
              <Image
                source={{
                  uri: 'https://i.fbcd.co/products/original/6151832f1b07826daab36cc23865043ae682bb7bd6e55aac6aed34c6a538b68e.jpg',
                }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>

            {/* Name & Email */}
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Snow Flex</Text>
              <Text style={styles.profileEmail}>snowflex@example.com</Text>
            </View>

            {/* Profile Stats */}
            <View style={styles.profileStats}>
              <View style={styles.profileStat}>
                <Text style={[styles.profileStatValue, { color: '#22c55e' }]}>45</Text>
                <Text style={styles.profileStatLabel}>Eco Trips</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={[styles.profileStatValue, { color: '#3b82f6' }]}>128</Text>
                <Text style={styles.profileStatLabel}>Total Trips</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={[styles.profileStatValue, { color: '#8b5cf6' }]}>{totalSteps.toLocaleString()}</Text>
                <Text style={styles.profileStatLabel}>Steps</Text>
              </View>
              <View style={styles.profileStat}>
                <Text style={[styles.profileStatValue, { color: '#f97316' }]}>Gold</Text>
                <Text style={styles.profileStatLabel}>Status</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rewards Section */}
        <View style={styles.rewardsCard}>
          <View style={styles.cardHeader}>
            <Icon name="gift" size={20} style={styles.rewardsIcon} />
            <Text style={[styles.cardTitle, { color: '#fff' }]}>My Rewards</Text>
          </View>
          <Text style={styles.rewardsSubtitle}>Claim rewards with your earned calories!</Text>

          <View style={styles.couponsContainer}>
            {coupons.map((coupon) => {
              const isClaimed = claimedCoupons.has(coupon.id);
              const canClaim = totalCalories >= coupon.calories;

              return (
                <View key={coupon.id} style={[styles.couponCard, isClaimed && styles.couponCardClaimed]}>
                  <View style={styles.couponHeader}>
                    <Text style={[styles.couponTitle, isClaimed && styles.couponTitleClaimed]}>
                      {coupon.title}
                    </Text>
                    {isClaimed && (
                      <View style={styles.claimedBadge}>
                        <Text style={styles.claimedBadgeText}>Claimed</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.couponFooter}>
                    <View style={styles.caloriesRequired}>
                      <Icon name="flame" size={16} />
                      <Text style={styles.caloriesText}>{coupon.calories} cal required</Text>
                    </View>
                    <TouchableOpacity
                      disabled={isClaimed || !canClaim}
                      onPress={() => claimCoupon(coupon)}
                      style={[styles.claimButton, (isClaimed || !canClaim) && styles.claimButtonDisabled]}
                    >
                      <Text style={styles.claimButtonText}>
                        {isClaimed ? 'Claimed' : canClaim ? `+${coupon.points} pts` : 'Locked'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const getStyles = (darkMode: boolean) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: darkMode ? '#121212' : '#f0f4f8' },
    container: { paddingHorizontal: 16 },
    card: { backgroundColor: darkMode ? '#1e1e1e' : '#fff', borderRadius: 16, padding: 16, marginBottom: 16, marginTop: 16 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    cardIcon: { marginRight: 8, color: darkMode ? '#3b82f6' : '#1e3a8a' },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: darkMode ? '#fff' : '#000' },
    profileContainer: { alignItems: 'center' },
    avatar: {
      width: 110,
      height: 110,
      borderRadius: 55,
      borderWidth: 4,
      borderColor: '#4CAF50', // nice green border (change to theme color if needed)
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginBottom: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4, // for Android shadow
    },
    avatarImage: { width: '100%', height: '100%' },
    profileInfo: { alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    profileName: { fontSize: 20, fontWeight: 'bold', color: darkMode ? '#fff' : '#000' },
    profileEmail: { color: darkMode ? '#aaa' : '#666', marginTop: 4 },
    profileStats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    profileStat: { alignItems: 'center' },
    profileStatValue: { fontSize: 18, fontWeight: 'bold' },
    profileStatLabel: { color: darkMode ? '#aaa' : '#666', fontSize: 12 },
    rewardsCard: { backgroundColor: '#8b5cf6', borderRadius: 16, padding: 16, marginBottom: 16 },
    rewardsIcon: { color: '#fff', marginRight: 8 },
    rewardsSubtitle: { color: '#ddd', marginBottom: 12 },
    couponsContainer: {},
    couponCard: { backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)', borderRadius: 12, padding: 12, marginBottom: 8 },
    couponCardClaimed: { opacity: 0.6 },
    couponHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    couponTitle: { fontWeight: 'bold', color: darkMode ? '#fff' : '#000', flex: 1 },
    couponTitleClaimed: { color: darkMode ? '#aaa' : '#666' },
    claimedBadge: { backgroundColor: '#aaa', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8 },
    claimedBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    couponFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    caloriesRequired: { flexDirection: 'row', alignItems: 'center' },
    caloriesText: { marginLeft: 4, color: darkMode ? '#ccc' : '#333', fontSize: 12 },
    claimButton: { backgroundColor: '#a78bfa', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
    claimButtonDisabled: { backgroundColor: '#555' },
    claimButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  });

export default ProfileScreen;
