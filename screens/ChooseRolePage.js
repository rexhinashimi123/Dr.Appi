import React, { useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');

export default function ChooseRolePage({ navigation }) {
  // Animated scale refs for the two buttons
  const scalePatient = useRef(new Animated.Value(1)).current;
  const scaleDoctor = useRef(new Animated.Value(1)).current;

  const onPressIn = (anim) => {
    Animated.spring(anim, { toValue: 0.96, useNativeDriver: true, friction: 6 }).start();
  };
  const onPressOut = (anim, cb) => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 6 }).start(() => {
      if (cb) cb();
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      {/* Decorative background blobs */}
      <View style={styles.bg}>
        <View style={[styles.blob, styles.blob1]} />
        <View style={[styles.blob, styles.blob2]} />
        <View style={[styles.blob, styles.blob3]} />
      </View>

      {/* Content */}
      <View style={styles.container}>
        <Text style={styles.appName}>Doctor Appi</Text>
        <Text style={styles.tagline}>Lehtëson komunikimin midis pacientëve dhe doktorëve</Text>

        <Text style={styles.sectionTitle}>Zgjidh rolin</Text>

        <View style={styles.rolesRow}>
          <TouchableWithoutFeedback
            onPressIn={() => onPressIn(scalePatient)}
            onPressOut={() => onPressOut(scalePatient, () => navigation.navigate('Login'))}
          >
            <Animated.View style={[styles.roleCard, { transform: [{ scale: scalePatient }] }]}>
              <View style={styles.roleLeft}>
                <View style={[styles.iconCircle, styles.patientIconBg]}>
                  <Text style={styles.iconText}>🩺</Text>
                </View>
                <View style={styles.roleText}>
                  <Text style={styles.roleTitle}>Pacient</Text>
                  <Text style={styles.roleSubtitle}>Rezervo takime dhe komuniko me lehtësi</Text>
                </View>
              </View>
              <View style={styles.arrowCircle}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPressIn={() => onPressIn(scaleDoctor)}
            onPressOut={() => onPressOut(scaleDoctor, () => navigation.navigate('DoctorLoginMySQL'))}
          >
            <Animated.View style={[styles.roleCard, { transform: [{ scale: scaleDoctor }] }]}>
              <View style={styles.roleLeft}>
                <View style={[styles.iconCircle, styles.doctorIconBg]}>
                  <Text style={styles.iconText}>👨‍⚕️</Text>
                </View>
                <View style={styles.roleText}>
                  <Text style={styles.roleTitle}>Doktor</Text>
                  <Text style={styles.roleSubtitle}>Menaxho takimet dhe bisedo me pacientët</Text>
                </View>
              </View>
              <View style={styles.arrowCircle}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.footer}>
          <Text style={styles.smallNote}>Privatësia dhe siguria e të dhënave janë të rëndësishme për ne.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const CARD_WIDTH = width * 0.9;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F172A', // dark deep background so blobs contrast
  },
  bg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.12,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: '#6C63FF',
    top: -80,
    left: -80,
  },
  blob2: {
    width: 220,
    height: 220,
    backgroundColor: '#FF6B6B',
    top: 40,
    right: -60,
  },
  blob3: {
    width: 180,
    height: 180,
    backgroundColor: '#00C2A8',
    bottom: -60,
    left: -40,
  },

  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 40,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  appName: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  tagline: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 20,
    maxWidth: '95%',
  },

  sectionTitle: {
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 6,
  },

  rolesRow: {
    // stack vertical cards with space
    flexDirection: 'column',
    gap: 12, // not supported on all RN versions but harmless; spacing also controlled by marginBottom
  },

  roleCard: {
    width: '100%',
    backgroundColor: '#0B1220', // slightly lighter than background
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },

  roleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  patientIconBg: {
    backgroundColor: '#FF6B6B',
  },
  doctorIconBg: {
    backgroundColor: '#6C63FF',
  },
  iconText: {
    fontSize: 26,
  },

  roleText: {
    flexShrink: 1,
  },
  roleTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 2,
  },
  roleSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    flexWrap: 'wrap',
    maxWidth: CARD_WIDTH - 140,
  },

  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  arrowText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 20,
  },

  footer: {
    marginTop: 18,
    alignItems: 'center',
  },
  smallNote: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: '90%',
  },
});
