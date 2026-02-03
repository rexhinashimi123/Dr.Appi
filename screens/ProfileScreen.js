import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { DoctorData } from './DoctorData'; 

export default function ProfileScreen({ route }) {
  const { username } = route.params;
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const doc = DoctorData.find(d => d.username === username);
    if (doc) setDoctor(doc);
  }, [username]);

  if (!doctor) return <Text style={{textAlign:'center', marginTop:50}}>Loading...</Text>;

  const handleSave = () => {
    Alert.alert('Sukses', 'Të dhënat janë ruajtur në app (vetëm lokal, nuk ndryshon DB)');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Emri dhe Mbiemri</Text>
      <TextInput
        style={styles.input}
        value={doctor.full_name}
        onChangeText={(text) => setDoctor({...doctor, full_name: text})}
      />

      <Text style={styles.label}>Mosha</Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        value={doctor.age.toString()}
        onChangeText={(text) => setDoctor({...doctor, age: parseInt(text)})}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={doctor.email}
        onChangeText={(text) => setDoctor({...doctor, email: text})}
      />

      <Text style={styles.label}>Specializimi</Text>
      <TextInput
        style={styles.input}
        value={doctor.specialization}
        onChangeText={(text) => setDoctor({...doctor, specialization: text})}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Ruaj</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
  label: { fontSize: 16, marginTop: 20, color: 'cornflowerblue', fontWeight: 'bold' },
  input: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginTop: 5 },
  button: { backgroundColor: 'cornflowerblue', padding: 15, marginTop: 30, borderRadius: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }
});
