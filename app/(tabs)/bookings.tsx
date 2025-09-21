import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

// --- Type Definitions ---

interface Service {
  id: number;
  type: 'hotel' | 'bus';
  name: string;
  location?: string;
  route?: string;
  price: string;
  rating?: number;
  amenities?: string[];
  departure?: string;
  category: string;
}

type UserCategory = 'child' | 'student' | 'adult' | 'senior';

interface UserTypeInfo {
  discount: number;
  benefits: string[];
}

type UserTypes = Record<UserCategory, UserTypeInfo>;

// --- Data for Booking Screen ---

const govServices: Service[] = [
  {
    id: 1,
    type: 'hotel',
    name: 'ITDC Hotel Ashok',
    location: 'Chankyapuri',
    price: '₹2,500/night',
    rating: 4.2,
    amenities: ['WiFi', 'Restaurant', 'Parking'],
    category: 'Premium',
  },
  {
    id: 3,
    type: 'bus',
    name: 'DTC Volvo Service',
    route: 'Delhi - Agra',
    price: '₹450',
    departure: '06:30 AM',
    category: 'Express',
  },
];

const userTypes: UserTypes = {
  child: { discount: 50, benefits: ['Free meals', 'Priority seating'] },
  student: { discount: 30, benefits: ['Educational tours', 'Group discounts'] },
  adult: { discount: 0, benefits: ['Standard booking', 'Loyalty points'] },
  senior: { discount: 40, benefits: ['Priority boarding', 'Medical assistance'] },
};

// --- Helper Components ---

interface IconProps {
  name: string;
  size?: number;
  style?: StyleProp<TextStyle>;
}

const Icon = ({ name, size = 24, style }: IconProps) => {
  const icons: Record<string, string> = {
    user: '👤',
    child: '👶',
    student: '🎓',
    senior: '👴',
    government: '🏛',
    hotel: '🏨',
    bus: '🚌',
    rating: '⭐',
    time: '⏱',
    accessibility: '♿',
    shield: '🛡',
  };
  return <Text style={[{ fontSize: size }, style]}>{icons[name] || '●'}</Text>;
};

interface ServiceCardProps {
  service: Service;
  userType: UserCategory;
  setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
  styles: ReturnType<typeof getStyles>;
}

const ServiceCard = ({ service, userType, setSelectedService, styles }: ServiceCardProps) => {
  const discount = userTypes[userType]?.discount || 0;
  const originalPrice = parseInt(service.price.replace(/[^\d]/g, ''), 10);
  const discountedPrice = originalPrice - originalPrice * (discount / 100);

  return (
    <View style={styles.serviceCard}>
      {/* Header */}
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Icon name={service.type} size={20} style={styles.serviceIcon} />
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceLocation}>{service.location || service.route}</Text>
          </View>
        </View>
        <View style={styles.servicePricing}>
          {discount > 0 && <Text style={styles.originalPrice}>{service.price}</Text>}
          <Text style={styles.discountedPrice}>₹{discountedPrice}</Text>
          <Text style={styles.serviceCategory}>{service.category}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.serviceFooter}>
        <View style={styles.serviceMetrics}>
          {service.rating && (
            <View style={styles.ratingContainer}>
              <Icon name="rating" size={14} />
              <Text style={styles.ratingText}>{service.rating}</Text>
            </View>
          )}
          {service.departure && (
            <View style={styles.timeContainer}>
              <Icon name="time" size={14} />
              <Text style={styles.timeText}>{service.departure}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={() => setSelectedService(service)}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- Main Component ---

interface BookingScreenProps {
  darkMode: boolean;
}

const BookingScreen = ({ darkMode }: BookingScreenProps) => {
  const [selectedUserType, setSelectedUserType] = useState<UserCategory>('adult');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const styles = getStyles(darkMode);

  return (
    <ScrollView style={styles.container} contentContainerStyle ={styles.Scrollcontent} showsVerticalScrollIndicator={false}>
      {/* User Type Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="user" size={20} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Select User Type</Text>
        </View>
        <View style={styles.userTypeGrid}>
          {(Object.keys(userTypes) as UserCategory[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.userTypeButton,
                selectedUserType === type && styles.userTypeButtonActive,
              ]}
              onPress={() => setSelectedUserType(type)}
            >
              <Icon name={type === 'adult' ? 'user' : type} size={16} />
              <Text
                style={[
                  styles.userTypeText,
                  selectedUserType === type && styles.userTypeTextActive,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <View style={styles.discountRow}>
            <Text style={styles.benefitsTitle}>Discount:</Text>
            <Text style={styles.discountValue}>{userTypes[selectedUserType].discount}% OFF</Text>
          </View>
          <Text style={styles.benefitsSubtitle}>Benefits:</Text>
          {userTypes[selectedUserType].benefits.map((b, i) => (
            <Text key={i} style={styles.benefitItem}>
              • {b}
            </Text>
          ))}
        </View>
      </View>

      {/* Government Services */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="government" size={20} style={styles.cardIcon} />
          <Text style={styles.cardTitle}>Government Services</Text>
        </View>
        {govServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            userType={selectedUserType}
            setSelectedService={setSelectedService}
            styles={styles}
          />
        ))}
      </View>

      {/* Booking Modal */}
      {selectedService && (
        <View style={styles.bookingModal}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle}>Quick Booking</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedService(null)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bookingContent}>
            <Text style={styles.bookingServiceName}>{selectedService.name}</Text>
            <View style={styles.bookingRow}>
              <Text>Final Price:</Text>
              <Text style={styles.finalPriceValue}>
                ₹
                {parseInt(selectedService.price.replace(/[^\d]/g, ''), 10) -
                  parseInt(selectedService.price.replace(/[^\d]/g, ''), 10) *
                    (userTypes[selectedUserType]?.discount || 0) /
                    100}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                Alert.alert('Booking Confirmed!');
                setSelectedService(null);
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

// --- Styles (Properly Typed) ---

const getStyles = (darkMode: boolean) =>
  StyleSheet.create({
    container: { paddingHorizontal: 16 } as ViewStyle,
    card: {
      backgroundColor: darkMode ? '#1e1e1e' : '#fff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      marginTop: 16,
    } as ViewStyle,
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 } as ViewStyle,
    cardIcon: { marginRight: 8, color: darkMode ? '#3b82f6' : '#1e3a8a' } as TextStyle,
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: darkMode ? '#fff' : '#000' } as TextStyle,
    userTypeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' } as ViewStyle,
    userTypeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: darkMode ? '#333' : '#f0f0f0',
      borderRadius: 8,
      padding: 10,
      width: '48%',
      marginBottom: 10,
    } as ViewStyle,
    userTypeButtonActive: { backgroundColor: '#3b82f6' } as ViewStyle,
    userTypeText: { marginLeft: 8, color: darkMode ? '#fff' : '#000' } as TextStyle,
    userTypeTextActive: { color: '#fff' } as TextStyle,
    benefitsCard: {
      backgroundColor: darkMode ? '#22c55e1a' : '#dcfce7',
      borderRadius: 8,
      padding: 12,
      marginTop: 12,
    } as ViewStyle,
    discountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 } as ViewStyle,
    benefitsTitle: { fontWeight: 'bold', color: darkMode ? '#fff' : '#000' } as TextStyle,
    discountValue: { fontWeight: 'bold', color: '#22c55e' } as TextStyle,
    benefitsSubtitle: { marginBottom: 4, color: darkMode ? '#ccc' : '#333' } as TextStyle,
    benefitItem: { color: darkMode ? '#ccc' : '#333' } as TextStyle,
    serviceCard: {
      backgroundColor: darkMode ? '#333' : '#f9f9f9',
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
    } as ViewStyle,
    serviceHeader: { flexDirection: 'row', justifyContent: 'space-between' } as ViewStyle,
    serviceInfo: { flexDirection: 'row', alignItems: 'center' } as ViewStyle,
    serviceIcon: { marginRight: 8, color: '#3b82f6' } as TextStyle,
    serviceDetails: {} as ViewStyle,
    serviceName: { fontWeight: 'bold', color: darkMode ? '#fff' : '#000' } as TextStyle,
    serviceLocation: { color: darkMode ? '#aaa' : '#666' } as TextStyle,
    servicePricing: { alignItems: 'flex-end' } as ViewStyle,
    originalPrice: { textDecorationLine: 'line-through', color: darkMode ? '#aaa' : '#666' } as TextStyle,
    discountedPrice: { fontWeight: 'bold', color: '#22c55e' } as TextStyle,
    serviceCategory: { fontSize: 12, color: darkMode ? '#aaa' : '#666' } as TextStyle,
    serviceFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    } as ViewStyle,
    serviceMetrics: { flexDirection: 'row' } as ViewStyle,
    ratingContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 16 } as ViewStyle,
    ratingText: { marginLeft: 4, color: darkMode ? '#fff' : '#000' } as TextStyle,
    timeContainer: { flexDirection: 'row', alignItems: 'center' } as ViewStyle,
    timeText: { marginLeft: 4, color: darkMode ? '#fff' : '#000' } as TextStyle,
    bookButton: {
      backgroundColor: '#3b82f6',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
    } as ViewStyle,
    bookButtonText: { color: '#fff', fontWeight: 'bold' } as TextStyle,
    bookingModal: {
      backgroundColor: darkMode ? '#22c55e' : '#dcfce7',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    } as ViewStyle,
    bookingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } as ViewStyle,
    bookingTitle: { fontSize: 18, fontWeight: 'bold', color: darkMode ? '#fff' : '#000' } as TextStyle,
    closeButton: { padding: 8 } as ViewStyle,
    closeButtonText: { fontSize: 18, color: darkMode ? '#fff' : '#000' } as TextStyle,
    bookingContent: { marginTop: 12 } as ViewStyle,
    bookingServiceName: { fontWeight: 'bold', fontSize: 16, color: darkMode ? '#fff' : '#000' } as TextStyle,
    bookingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 } as ViewStyle,
    finalPriceValue: { fontWeight: 'bold', fontSize: 18, color: '#22c55e' } as TextStyle,
    confirmButton: {
      backgroundColor: '#22c55e',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginTop: 12,
    } as ViewStyle,
    confirmButtonText: { color: '#fff', fontWeight: 'bold' } as TextStyle,
    Scrollcontent:{
        paddingBottom: 20,
        paddingTop: 50
    }
  });

export default BookingScreen;
