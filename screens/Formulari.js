import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, FlatList, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

export default function Formulari({ route, navigation }) {
  const { patientUsername, patientName } = route.params; 

  const [name, setName] = useState(patientName || '');
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [doctor, setDoctor] = useState('');
  const [doctorUsername, setDoctorUsername] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const DOCTORS = [
    { fullName: 'Dr. Arben Hoxha', username: 'arben.hoxha' },
    { fullName: 'Dr. Elira Dervishi', username: 'elira.dervishi' },
    { fullName: 'Dr. Gentian Kola', username: 'gentian.kola' },
  ];

  const handleFormSubmit = () => {
    if (!name || !age || !symptoms || !doctor || !formattedDate) {
      Alert.alert('Kujdes!', 'Plotesoni te gjitha fushat para se te dergoni formularin!');
      return;
    }

    axios.post('http://172.20.10.2:3000/appointments', {
      patient_username: patientUsername,
      doctor_username: doctorUsername,
      name,
      age,
      symptoms,
      date: formattedDate
    })
    .then(res => {
      if (res.data.success) {
        Alert.alert('Sukses!', res.data.message);
        // mund te navigosh mbrapa tek Home ose ta fshish formularin
        navigation.goBack();
      } else {
        Alert.alert('Gabim', res.data.message);
      }
    })
    .catch(err => {
      console.log(err);
      Alert.alert('Gabim', 'Nuk u ruajt formulari');
    });
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setFormattedDate(`${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
  };

  const dismissKeyboard = () => Keyboard.dismiss();

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>Plotesoni formularin:</Text>

        <TextInput
          style={styles.input}
          placeholder="Emri Mbiemri"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mosha"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Simptomat"
          value={symptoms}
          onChangeText={setSymptoms}
          multiline
        />

        {/* Fusha e doktorit si TouchableOpacity */}
        <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
          <Text style={{ color: doctor ? 'black' : 'grey' }}>
            {doctor ? doctor : 'Zgjidhni Mjekun e Familjes'}
          </Text>
        </TouchableOpacity>

        {/* Modal me doktorët */}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Zgjidhni një doktor</Text>
              <FlatList
                data={DOCTORS}
                keyExtractor={(item) => item.username}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.doctorOption}
                    onPress={() => {
                      setDoctor(item.fullName);
                      setDoctorUsername(item.username);
                      setModalVisible(false);
                    }}
                  >
                    <Text>{item.fullName}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={{ color: 'white', textAlign: 'center' }}>Mbyll</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Date picker */}
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={{ color: formattedDate ? 'black' : 'grey' }}>
            {formattedDate ? formattedDate : 'Zgjidhni daten'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
          <Text style={styles.buttonText}>Dergo</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E5E4E2' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'cornflowerblue',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '50%',
  },
  doctorOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  closeButton: {
    backgroundColor: 'cornflowerblue',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});
