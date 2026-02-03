import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, Animated } from 'react-native';
import axios from 'axios';

export default function DoctorListScreen({ navigation, route }) {
  const { patientId, patientName } = route.params;
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    axios.get('http://172.20.10.2:3000/doctors')
      .then(res => {
        if (res.data.success) {
          setDoctors(res.data.doctors);
        } else {
          Alert.alert('Gabim', 'Nuk u gjetën doktorët.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.log('Gabim:', err);
        Alert.alert('Gabim', 'Nuk mund të ngarkohen doktorët.');
        setLoading(false);
      });
  }, []);

  const openChat = (doctor) => {
    if (!doctor || !doctor.username) {
      Alert.alert('Gabim', 'Doktori nuk ka të dhëna të vlefshme.');
      return;
    }
    navigation.navigate('Chat', {
      doctorId: doctor.username,
      doctorName: doctor.full_name,
      patientId: patientId,
      patientName: patientName,
      role: 'patient'
    });
  };

  const onPressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, friction: 6 }).start();
  };

  const onPressOut = (cb) => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 6 }).start(() => {
      if(cb) cb();
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (doctors.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ fontSize:18, color:'gray' }}>Nuk ka doktorë të regjistruar.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Takoni doktorët tuaj</Text>
      <Text style={styles.subtitle}>Bisedoni dhe menaxhoni vizitat me lehtësi</Text>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.left}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.full_name.charAt(0)}</Text>
              </View>
              <View style={{ marginLeft: 15 }}>
                <Text style={styles.doctorName}>{item.full_name}</Text>
                <Text style={styles.doctorSubtitle}>Kontaktoni me doktorin tuaj</Text>
              </View>
            </View>
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => onPressOut(() => openChat(item))} 
              onPressIn={onPressIn}>
              <Animated.View style={[styles.chatButton, { transform: [{ scale: scaleAnim }] }]}>
                <Text style={styles.chatButtonText}>Bisedo</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#F0F2F5' },
  loadingContainer: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:26, fontWeight:'700', color:'#333', textAlign:'center', marginBottom:6 },
  subtitle: { fontSize:14, color:'#666', textAlign:'center', marginBottom:20 },
  card: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#fff',
    padding:18,
    marginVertical:8,
    borderRadius:20,
    shadowColor:'#000',
    shadowOpacity:0.06,
    shadowOffset:{ width:0, height:10 },
    shadowRadius:15,
    elevation:6,
  },
  left: { flexDirection:'row', alignItems:'center' },
  avatar: {
    width:50, height:50, borderRadius:25,
    backgroundColor:'#FF6B6B',
    justifyContent:'center', alignItems:'center'
  },
  avatarText: { color:'#fff', fontSize:20, fontWeight:'700' },
  doctorName: { fontSize:18, fontWeight:'700', color:'#222' },
  doctorSubtitle: { fontSize:12, color:'#888', marginTop:2 },
  chatButton: {
    backgroundColor:'#4ECDC4',
    paddingVertical:8,
    paddingHorizontal:18,
    borderRadius:12,
    justifyContent:'center',
    alignItems:'center'
  },
  chatButtonText: { color:'#fff', fontWeight:'700', fontSize:14 },
});
