 import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Image, Alert
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

export default function Chat({ route }) {
  const { doctorId, doctorName, patientId, patientName, role } = route.params;
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const scrollViewRef = useRef();

  const myUsername = role === 'doctor' ? doctorId : patientId;
  const chatPartnerUsername = role === 'doctor' ? patientId : doctorId;

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://172.20.10.2:3000/messages/${myUsername}`);
      if (res.data.success) {
        const filtered = res.data.messages.filter(msg =>
          (msg.sender_username === myUsername && msg.receiver_username === chatPartnerUsername) ||
          (msg.sender_username === chatPartnerUsername && msg.receiver_username === myUsername)
        );
        setChat(filtered);
      }
    } catch (error) {
      console.log('Gabim gjatë marrjes së mesazheve:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 1500);
    return () => clearInterval(interval);
  }, [myUsername, chatPartnerUsername]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    try {
      await axios.post(`http://172.20.10.2:3000/messages`, {
        sender_username: myUsername,
        receiver_username: chatPartnerUsername,
        message,
        type: 'text'
      });
      setMessage('');
      fetchMessages();
      setTimeout(() => scrollViewRef.current.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.log('Gabim dërgimi mesazhi:', error);
    }
  };

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Leje e nevojshme', 'Duhet leje për të aksesuar fotot.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;

        await axios.post(`http://172.20.10.2:3000/messages`, {
          sender_username: myUsername,
          receiver_username: chatPartnerUsername,
          message: imageUri,
          type: 'image'
        });
        fetchMessages();
        setTimeout(() => scrollViewRef.current.scrollToEnd({ animated: true }), 100);
      }
    } catch (error) {
      console.log('Gabim zgjedhje imazhi:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{role === 'doctor' ? patientName : doctorName}</Text>

      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.chatContainer}
      >
        {chat.map((item, index) => (
          <View
            key={index}
            style={item.sender_username === myUsername ? styles.userMessageContainer : styles.otherMessageContainer}
          >
            {item.type === 'text' ? (
              <Text style={styles.messageText}>{item.message}</Text>
            ) : (
              <Image source={{ uri: item.message }} style={styles.image} resizeMode="cover" />
            )}
            <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleTimeString()}</Text>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Shkruaj mesazh..."
            value={message}
            onChangeText={setMessage}
            onFocus={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          />
          <TouchableOpacity style={styles.button} onPress={handlePickImage}>
            <Text style={styles.buttonText}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
            <Text style={styles.buttonText}>Dërgo</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5E4E2' },
  header: { textAlign: 'center', fontSize: 20, fontWeight: 'bold', padding: 15, backgroundColor: '#98AFC7' },
  chatContainer: { padding: 10 },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: 'cornflowerblue',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%'
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f0f0',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%'
  },
  messageText: { fontSize: 16 },
  image: { width: 200, height: 200, borderRadius: 10, marginVertical: 5 },
  timestamp: { fontSize: 10, color: '#555', marginTop: 3, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#ccc' },
  input: { flex: 1, height: 40, backgroundColor: '#f7f7f7', borderRadius: 20, paddingHorizontal: 10, borderColor: 'grey', borderWidth: 2 },
  button: { marginLeft: 5, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: 'cornflowerblue', borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
