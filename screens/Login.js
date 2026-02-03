import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import axios from 'axios';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Gabim', 'Ju lutem plotësoni username dhe fjalëkalimin!');
      return;
    }

    try {
     
      const response = await axios.post('http://172.20.10.2:3000/login-patient', {
        username: username.toLowerCase(), 
        password: password
      });

      if (response.data.success) {
        Alert.alert('Sukses', `Mirësevini ${response.data.full_name}!`);
       
        navigation.navigate('Home', { username: username.toLowerCase() });
      } else {
        Alert.alert('Gabim', response.data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Gabim', 'Probleme me serverin!');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <ImageBackground source={require('./images/Background.png')} style={styles.backgroundImage}>
          
          {}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ChooseRole')}>
            <Text style={styles.backText}>← Zgjidh Rolin</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>Identifikohuni</Text>

          <TextInput
            style={styles.input}
            placeholder="Username (emer.mbiemer)"
            onChangeText={(text) => setUsername(text)}
            value={username}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Fjalekalimi"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>HYR</Text>
          </TouchableOpacity>

          <Text style={styles.forgotPassword}>
            <Text style={styles.link} onPress={() => navigation.navigate('Fjalekalimi')}>Keni harruar fjalekalimin?</Text>
          </Text>

          <Text style={styles.signup}>
            <Text style={styles.signupText}>Nuk keni nje llogari?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Regjistrohuni')}>
              <Text style={[styles.link, styles.signupLink]}> Regjistrohuni</Text>
            </TouchableOpacity>
          </Text>

        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1, resizeMode: 'cover', justifyContent: 'center', width: '100%', height: '100%' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  subtitle: { textAlign: "center", marginTop: 120, color: 'white', fontSize: 20, marginBottom: 20 },
  input: { height: 40, backgroundColor: "white", borderRadius: 50, marginHorizontal: 50, marginVertical: 10, paddingLeft: 20 },
  button: { backgroundColor: 'cornflowerblue', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 50, marginVertical: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  forgotPassword: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  link: { color: 'blue', textDecorationLine:'underline' },
  signup: { position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', fontSize: 16 },
  signupText: { color: 'blue' },
  signupLink: { fontWeight: 'bold' },
});

export default Login;
