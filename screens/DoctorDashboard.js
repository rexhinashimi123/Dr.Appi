import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import axios from 'axios';

export default function DoctorDashboard({ route, navigation }) {
  const { username, full_name } = route.params;

  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments'); 

  const [searchAppointments, setSearchAppointments] = useState('');
  const [searchMessages, setSearchMessages] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`http://172.20.10.2:3000/doctor/appointments/${username}`);
      if (res.data.success) setAppointments(res.data.appointments);
    } catch (error) {
      console.log("Gabim gjatë marrjes së formularëve:", error);
      Alert.alert("Gabim", "Nuk mund të ngarkohen rezervimet.");
    }
    setLoadingAppointments(false);
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://172.20.10.2:3000/messages/${username}`);
      if (res.data.success) {
        const chats = {};
        res.data.messages.forEach(msg => {
          const patient = msg.sender_username !== username ? msg.sender_username : msg.receiver_username;
          if (!chats[patient] || new Date(msg.created_at) > new Date(chats[patient].created_at)) {
            chats[patient] = msg;
          }
        });
        const chatList = Object.keys(chats).map(patientUsername => ({
          patientUsername,
          message: chats[patientUsername].message,
          created_at: chats[patientUsername].created_at,
        }));
        setMessages(chatList);
      }
    } catch (error) {
      console.log("Gabim marrje mesazhesh:", error);
      Alert.alert("Gabim", "Nuk mund të ngarkohen mesazhet.");
    }
    setLoadingMessages(false);
  };

  useEffect(() => {
    fetchAppointments();
    fetchMessages();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://172.20.10.2:3000/appointments/${id}`, { status: newStatus });
      if (res.data.success) {
        Alert.alert("Sukses", `Rezervimi u ${newStatus}`);
        fetchAppointments();
      }
    } catch (error) {
      console.log("Gabim update status:", error);
      Alert.alert("Gabim", "Nuk mund të përditësohet rezervimi");
    }
  };

  const filteredAppointments = appointments.filter(a => a.patient_username.toLowerCase().includes(searchAppointments.toLowerCase()));
  const filteredMessages = messages.filter(m => m.patientUsername.toLowerCase().includes(searchMessages.toLowerCase()));
  const activePatientsCount = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;

  const getCardColor = (status) => {
    if (status === 'confirmed') return '#DFF2BF';
    if (status === 'pending') return '#FEEFB3';
    if (status === 'cancelled') return '#FFBABA';
    return '#f0f0f0';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const renderAppointment = ({ item }) => (
    <View style={[styles.card, { backgroundColor: getCardColor(item.status) }]}>
      <Text style={styles.patient}>Pacienti: {item.patient_username}</Text>
      <Text>Emri: {item.name}</Text>
      <Text>Mosha: {item.age}</Text>
      <Text>Simptoma: {item.symptoms}</Text>
      <Text>Data: {formatDate(item.date)}</Text>
      <Text>Status: {item.status}</Text>

      {item.status === 'pending' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={() => updateStatus(item.id, 'confirmed')}>
            <Text style={styles.buttonText}>Konfirmo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={() => updateStatus(item.id, 'cancelled')}>
            <Text style={styles.buttonText}>Anulo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderMessage = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Chat', {
        doctorId: username,
        doctorName: full_name,
        patientId: item.patientUsername,
        patientName: item.patientUsername,
        role: 'doctor'
      })}
    >
      <Text style={styles.patient}>{item.patientUsername}</Text>
      <Text numberOfLines={1} style={{ color: 'gray' }}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Profil Card i rregulluar */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{full_name ? full_name.charAt(0) : 'D'}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Dr. {full_name}</Text>
          <Text style={styles.profileUsername}>@{username}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{activePatientsCount}</Text>
              <Text style={styles.statLabel}>Pacientë Aktivë</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Butoni Profil */}
      <TouchableOpacity
        style={[styles.tabButton, { backgroundColor: '#4A90E2', marginBottom: 10 }]}
        onPress={() => navigation.navigate('ProfileScreen', { username, full_name })}
      >
        <Text style={[styles.tabText, { color: 'white' }]}>Profili</Text>
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'appointments' && styles.activeTab]}
          onPress={() => setActiveTab('appointments')}
        >
          <Text style={styles.tabText}>Rezervimet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={styles.tabText}>Mesazhet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'calendar' && styles.activeTab]}
          onPress={() => setActiveTab('calendar')}
        >
          <Text style={styles.tabText}>Kalendari</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'appointments' ? (
        loadingAppointments ? (
          <ActivityIndicator size="large" color="cornflowerblue" style={{ marginTop: 20 }} />
        ) : (
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Kërko pacientin..."
              value={searchAppointments}
              onChangeText={setSearchAppointments}
              style={styles.searchInput}
            />
            <FlatList
              data={filteredAppointments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderAppointment}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        )
      ) : activeTab === 'messages' ? (
        loadingMessages ? (
          <ActivityIndicator size="large" color="cornflowerblue" style={{ marginTop: 20 }} />
        ) : (
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Kërko pacientin..."
              value={searchMessages}
              onChangeText={setSearchMessages}
              style={styles.searchInput}
            />
            <FlatList
              data={filteredMessages}
              keyExtractor={(item) => item.patientUsername}
              renderItem={renderMessage}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        )
      ) : (
        <ScrollView style={{ flex: 1, marginTop: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
            Datat e konfirmuara të pacientëve:
          </Text>
          <Text style={{ fontSize: 12, color: 'gray', marginBottom: 5 }}>
            Pikat e kuqe tregojnë datat që janë të zëna me takime të konfirmuara.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {appointments.filter(a => a.status === 'confirmed').map((a, index) => (
              <View key={index} style={{ 
                padding: 10, 
                margin: 5, 
                backgroundColor: '#fff', 
                borderRadius: 8, 
                elevation: 2,
                flexDirection: 'row', 
                alignItems: 'center' 
              }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'red', marginRight: 8 }} />
                <Text>{formatDate(a.date)}</Text>
              </View>
            ))}
            {appointments.filter(a => a.status === 'confirmed').length === 0 && (
              <Text style={{ color: 'gray', fontStyle: 'italic' }}>Nuk ka takime të konfirmuara.</Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F8FAFB' },
  tabRow: { flexDirection: 'row', marginVertical: 10 },
  tabButton: { flex: 1, paddingVertical: 10, backgroundColor: '#eee', marginHorizontal: 5, borderRadius: 10 },
  activeTab: { backgroundColor: '#4A90E2' },
  tabText: { textAlign: 'center', fontWeight: 'bold', color: 'black' },
  card: { padding: 15, marginBottom: 10, borderRadius: 12, backgroundColor: 'white', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5 },
  patient: { fontWeight: 'bold', fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { padding: 10, borderRadius: 8, flex: 0.48 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  searchInput: { padding: 10, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ccc' },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 7,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  avatarText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  profileUsername: { fontSize: 14, color: 'gray', marginBottom: 6 },
  statsRow: { flexDirection: 'row' },
  statItem: { marginRight: 25, alignItems: 'center' },
  statNumber: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: 'gray' },
});
