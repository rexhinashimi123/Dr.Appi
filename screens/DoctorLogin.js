import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function DoctorDashboard({ route }) {
  
  const { username, full_name } = route.params;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      console.log("Fetching appointments for doctor:", username);

      try {
        const response = await axios.get(`http://172.20.10.2:3000/doctor/appointments/${username}`);
        console.log("Response from server:", response.data);

        if (response.data.success) {
          console.log("Appointments fetched:", response.data.appointments);
          setAppointments(response.data.appointments);
        } else {
          console.log("Server returned no success:", response.data.message);
        }
      } catch (error) {
        console.log("Gabim fetch appointments:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [username]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard i Dr. {full_name}</Text>

      {loading ? (
        <Text>Duke u ngarkuar rezervimet...</Text>
      ) : appointments.length === 0 ? (
        <Text>Nuk ka rezervime ende.</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.patientName}>{item.name}</Text>
              <Text>Mosha: {item.age}</Text>
              <Text>Simptomat: {item.symptoms}</Text>
              <Text>Data: {item.date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E5E4E2' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  card: { padding: 15, backgroundColor: 'white', borderRadius: 10, marginBottom: 10 },
  patientName: { fontWeight: 'bold', fontSize: 16 },
});
