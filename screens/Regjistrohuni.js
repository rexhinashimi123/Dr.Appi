import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Regjistrohuni({ navigation }) {
  const [user, setUser] = useState({
    full_name: '',
    password: '',
    email: '',
    city: '',
    phone: '',
    date_of_birth: '',
  });

 
  const generateUsername = (fullName) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      
      return (parts[0] + '.' + parts[1]).toLowerCase();
    } else {
      
      return fullName.toLowerCase();
    }
  };

  const handleRegister = async () => {
    const { full_name, password, email, city, phone, date_of_birth } = user;

   
    if (!full_name || !password) {
      Alert.alert('Gabim', 'Ju lutem plotësoni emrin dhe fjalëkalimin!');
      return;
    }

    
    const username = generateUsername(full_name);

    try {
      
      const response = await axios.post('http://172.20.10.2:3000/register-patient', {
        username: username.toLowerCase().trim(),
        password, 
        full_name,
        email: email || null,          
        city: city || null,
        phone: phone || null,
        date_of_birth: date_of_birth || null
      });

      
      if (response.data.success) {
        Alert.alert('Sukses', `Regjistrimi u krye! Username juaj: ${username}`);
        navigation.navigate('Login'); 
      } else {
        Alert.alert('Gabim', response.data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Gabim', 'Probleme me serverin!');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Regjistrohu si Pacient</Text>

      {}
      <TextInput
        style={styles.input}
        placeholder="Emër Mbiemër"
        value={user.full_name}
        onChangeText={text => setUser({ ...user, full_name: text })}
      />

      {}
      <TextInput
        style={styles.input}
        placeholder="Fjalëkalimi"
        secureTextEntry
        value={user.password}
        onChangeText={text => setUser({ ...user, password: text })}
      />

      {}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={text => setUser({ ...user, email: text })}
      />

      {}
      <TextInput
        style={styles.input}
        placeholder="Qyteti"
        value={user.city}
        onChangeText={text => setUser({ ...user, city: text })}
      />

      {}
      <TextInput
        style={styles.input}
        placeholder="Numri i telefonit"
        value={user.phone}
        onChangeText={text => setUser({ ...user, phone: text })}
      />

      {}
      <TextInput
        style={styles.input}
        placeholder="Data e lindjes (YYYY-MM-DD)"
        value={user.date_of_birth}
        onChangeText={text => setUser({ ...user, date_of_birth: text })}
      />

      {}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Regjistrohu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 10, marginBottom: 15 },
  button: { backgroundColor: 'cornflowerblue', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
