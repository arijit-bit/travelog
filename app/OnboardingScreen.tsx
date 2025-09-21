import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface OnboardingPage {
  id: number;
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  isLast?: boolean;
}

const onboardingData: OnboardingPage[] = [
  {
    id: 1,
    icon: 'location',
    title: 'Track Your Journeys',
    description: 'Automatically detect and record your daily trips across Kerala to help improve transportation planning.',
    buttonText: 'Continue',
  },
  {
    id: 2,
    icon: 'shield-checkmark',
    title: 'Your Privacy Matters',
    description: 'All data is anonymized and secure. We never store personal information or share individual travel patterns.',
    buttonText: 'Continue',
  },
  {
    id: 3,
    icon: 'stats-chart',
    title: 'Building Better Transport',
    description: 'Your contributions help create data-driven insights for smarter public transportation and infrastructure planning.',
    buttonText: 'Get Started',
    isLast: true,
  },
];

const OnboardingScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [agreedToShare, setAgreedToShare] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const navigation = useNavigation();

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({ x: nextPage * width, animated: true });
    } else {
      // Navigate to auth screen
      (navigation as any).navigate('(tabs)');
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      scrollViewRef.current?.scrollTo({ x: prevPage * width, animated: true });
    }
  };

  const renderPage = (page: OnboardingPage, index: number) => (
    <View key={page.id} style={styles.pageContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#666" />
        </TouchableOpacity>
        <View style={styles.pageIndicator}>
          {onboardingData.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
        <View style={styles.spacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, page.id === 2 ? styles.greenIcon : styles.blueIcon]}>
            <Ionicons
              name={page.icon as any}
              size={40}
              color={page.id === 2 ? '#10B981' : '#3B82F6'}
            />
          </View>
        </View>

        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.description}>{page.description}</Text>

        {page.isLast && (
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreedToShare(!agreedToShare)}
            >
              <View style={[styles.checkboxInner, agreedToShare && styles.checkboxChecked]}>
                {agreedToShare && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text style={styles.checkboxText}>
                I agree to share anonymized travel data to help improve Kerala's transportation system
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleNext}
          style={[
            styles.continueButton,
            page.isLast && !agreedToShare && styles.disabledButton,
          ]}
          disabled={page.isLast && !agreedToShare}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {page.buttonText}
          <Ionicons name="chevron-forward" size={20} color="white" style={styles.buttonIcon} />
        </Button>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
      >
        {onboardingData.map((page, index) => renderPage(page, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  pageContainer: {
    width,
    height,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
  },
  spacer: {
    width: 40,
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3B82F6',
  },
  inactiveDot: {
    backgroundColor: '#CBD5E1',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueIcon: {
    backgroundColor: '#DBEAFE',
  },
  greenIcon: {
    backgroundColor: '#D1FAE5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  checkboxContainer: {
    width: '100%',
    marginTop: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingTop: 20,
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    elevation: 0,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  buttonContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default OnboardingScreen;
