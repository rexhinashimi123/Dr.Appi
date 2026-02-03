import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function Perdoruesi({ route }) {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState({});

  const username = route.params.username; 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://172.20.10.2:3000/patient/${username}`);
        if (response.data.success) {
          const patient = response.data.patient;
          setUser(patient);
          setEditing({
            full_name: false,
            email: false,
            city: false,
            phone: false,
            date_of_birth: false
          });
        } else {
          Alert.alert('Gabim', response.data.message || 'Pacienti nuk u gjet');
        }
      } catch (err) {
        console.log("Gabim GET:", err);
        Alert.alert('Gabim', 'Nuk mund të merren të dhënat e pacientit');
      }
    };
    fetchUser();
  }, []);

  const handleUpdateField = async (field) => {
    try {
      const value = user[field];
      const response = await axios.put(`http://172.20.10.2:3000/update-patient/${username}`, { field, value });
      if (response.data.success) {
        Alert.alert('Sukses', response.data.message);
        setEditing({ ...editing, [field]: false });
      } else {
        Alert.alert('Gabim', response.data.message || 'Ndryshimi nuk u ruajt');
      }
    } catch (err) {
      console.log("Gabim update:", err);
      Alert.alert('Gabim', 'Ndryshimi nuk u ruajt');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Profili juaj</Text>

      {user && Object.keys(user).map(key => {
        if (key === 'password' || key === 'id' || key === 'username') return null; 
        return (
          <View key={key} style={styles.fieldContainer}>
            <Text style={styles.label}>{formatLabel(key)}</Text>
            {editing[key] ? (
              <TextInput
                style={styles.input}
                value={user[key]}
                onChangeText={text => setUser({ ...user, [key]: text })}
                onEndEditing={() => handleUpdateField(key)}
              />
            ) : (
              <TouchableOpacity onPress={() => setEditing({ ...editing, [key]: true })}>
                <Text style={styles.value}>{user[key] || '-'}</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}


function formatLabel(key) {
  switch (key) {
    case 'full_name': return 'Emri i plotë';
    case 'email': return 'Email';
    case 'city': return 'Qyteti';
    case 'phone': return 'Telefoni';
    case 'date_of_birth': return 'Datëlindja';
    default: return key;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a90e2',
    marginBottom: 20,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 17,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#eef3fb',
    borderRadius: 12,
    color: '#333',
  },
  input: {
    fontSize: 17,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4a90e2',
    backgroundColor: '#fff',
    color: '#333',
  },
});
