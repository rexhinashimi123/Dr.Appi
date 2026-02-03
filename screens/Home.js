import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, Alert, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Home = ({ navigation, route }) => {
  const { username } = route.params; 
  const [patientData, setPatientData] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [clickCount, setClickCount] = useState(0);

 
  useEffect(() => {
    if (username) {
      axios.get(`http://172.20.10.2:3000/patient/${username}`)
        .then(res => {
          if (res.data.success) {
            setPatientData(res.data.patient);
          }
        })
        .catch(err => console.log('Gabim me backend:', err));
    }
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleAnalizatClick = () => {
    setClickCount(clickCount + 1);
    if (clickCount === 2) {
      Alert.alert(
        'Analizat tuaja sapo jane perditesuar!',
        'Klikoni ne daten qe keni kryer analizat per te pare rezultatin e tyre.'
      );
      setClickCount(0);
    }
    navigation.navigate('Analizat');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./images/Background_user.png')} style={styles.backgroundImage}>

        {/* Butoni Menu */}
        <TouchableOpacity style={styles.button0} onPress={() => setModalVisible(true)}>
          <Ionicons name="menu" size={50} color="cornflowerblue" />
        </TouchableOpacity>

        {/* Modal Kryesor */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name='chevron-down' size={25} color="cornflowerblue" style={{ position: "absolute", left: 0, bottom: 10 }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Ionicons name='home' size={25} color="cornflowerblue" style={{ position: "absolute", left: 0, bottom: 13 }} />
                <Text style={styles.modalOption}>Faqja kryesore</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Perdoruesi', { username })}>
                <Ionicons name='person' size={25} color="cornflowerblue" style={{ position: "absolute", left: 0, bottom: 13 }} />
                <Text style={styles.modalOption}>Profili juaj</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setSubModalVisible(true)}>
                <Ionicons name='list' size={25} color="cornflowerblue" style={{ position: "absolute", left: 0, bottom: 10 }} />
                <Text style={styles.modalOption}>Sherbimet</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Ionicons name='exit' size={25} color="cornflowerblue" style={{ position: "absolute", left: 0, bottom: 10 }} />
                <Text style={styles.modalOption}>Dil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* SubModal për Sherbimet */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={subModalVisible}
          onRequestClose={() => setSubModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => setSubModalVisible(false)}>
                <Ionicons name='chevron-down' size={25} color="cornflowerblue" style={{ position: "absolute", left: 0, bottom: 10 }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Analizat')}>
                <Ionicons name='documents' size={25} color="cornflowerblue" style={{ position: "absolute", left: 0, bottom: 10 }} />
                <Text style={styles.modalOption}>Analizat</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Recetat')}>
                <Ionicons name='create' size={25} color="cornflowerblue" style={{ position: "absolute", left: 0, bottom: 10 }} />
                <Text style={styles.modalOption}>Recetat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (!patientData) {
                    Alert.alert('Duke u ngarkuar...', 'Prisni derisa te dhënat e pacientit te jenë gati.');
                    return;
                  }
                  navigation.navigate('Formulari', {
                    patientUsername: username,
                    patientName: patientData.full_name,
                  });
                }}
              >
                <Ionicons name='file-tray-stacked' size={25} color="cornflowerblue" style={{ position: "absolute", left: 0, bottom: 10 }} />
                <Text style={styles.modalOption}>Konsultat</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Review')}>
                <Ionicons name='thumbs-up' size={25} color="cornflowerblue" style={{ position: "absolute", left: 0, bottom: 10 }} />
                <Text style={styles.modalOption}>Komentet tuaja</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Emri i pacientit */}
        <Text style={styles.subtitle}>
          {patientData ? patientData.full_name : "Loading..."}
        </Text>

        {/* Butonat kryesor */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.button1} onPress={handleAnalizatClick}>
            <Text style={styles.buttonText}>Analizat</Text>
            <Ionicons name='documents-outline' size={60} color={'cornflowerblue'} style={{ textAlign: "center", marginTop: 5 }} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button1} onPress={() => navigation.navigate('Recetat')}>
            <Text style={styles.buttonText}>Recetat</Text>
            <Ionicons name='document-text-outline' size={60} color={'cornflowerblue'} style={{ textAlign: "center", marginTop: 5 }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button2}
          onPress={() => {
            if (!patientData) {
              Alert.alert('Duke u ngarkuar...', 'Prisni derisa te dhënat e pacientit te jenë gati.');
              return;
            }
            navigation.navigate('Formulari', {
              patientUsername: username,
              patientName: patientData.full_name,
            });
          }}
        >
          <Text style={styles.buttonText}>Aplikoni per konsult</Text>
          <Ionicons name='clipboard-outline' size={60} color={'cornflowerblue'} style={{ textAlign: "center", marginTop: 5 }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button3}
          onPress={() => {
            if (!patientData) {
              Alert.alert('Duke u ngarkuar...', 'Prisni derisa te dhënat e pacientit te jenë gati.');
              return;
            }
            navigation.navigate('DoctorListScreen', {
              patientId: username,
              patientName: patientData.full_name
            });
          }}
        >
          <Text style={styles.buttonText}>Bisedoni me mjekun tuaj</Text>
          <Ionicons name='chatbubbles-outline' size={60} color={'cornflowerblue'} style={{ textAlign: "center", marginTop: 5 }} />
        </TouchableOpacity>

      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, resizeMode: 'cover', justifyContent: "center", width: '100%', height: '100%' },
  modalContainer: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 60 },
  modalOption: { fontSize: 22, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "lightgray", marginLeft: 40, color: "cornflowerblue" },
  subtitle: { textAlign: "center", color: 'white', fontWeight: 'bold', fontSize: 23, marginTop: 180 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  button0: { backgroundColor: '#fff', position: 'absolute', right: 0, top: 30, width: 70 },
  button1: { backgroundColor: '#fff', width: 150, height: 110, borderRadius: 20, borderColor: 'cornflowerblue', borderWidth: 2, paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 15, marginVertical: 10, marginTop: 30 },
  button2: { backgroundColor: 'white', height: 110, borderRadius: 20, borderColor: 'cornflowerblue', borderWidth: 2, paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 40, marginVertical: 10 },
  button3: { backgroundColor: 'white', height: 110, borderRadius: 20, borderColor: 'cornflowerblue', borderWidth: 2, paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 40, marginVertical: 10 },
  buttonText: { color: 'cornflowerblue', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
});

export default Home;
