import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,ImageBackground,Image, StyleSheet } from 'react-native';

const Fjalekalimi = ({navigation}) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async() => {
   if (email === '') {
  alert('Ju lutem vendosni nje e-mail!');
   } else {
    alert('Fjalekalimi i ri u dergua me sukses ne e-mailin tuaj!');
    navigation.navigate ('Login');
   }
  };

  return (
    <View style={styles.container}>
    <ImageBackground source={require('./images/profile2.png')} style={styles.backgroundImage}>
     <View style={styles.headingContainer}>
      <Text style={styles.heading}>Vendosni e-maili tuaj ose numrin e telefonit per te vendosur nje fjalekalim te ri.</Text>
     </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-maili"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Dergo</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: "center",
    width: '100%',
    height: '100%',
  },
  headingContainer: {
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    paddingTop: 50,
    height: 200,
    width: 413,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  heading: {
    textAlign: "center",
    color: 'cornflowerblue',
    fontWeight: 400,
    paddingTop: 5,
    fontSize: 23,
    padding: 50,
    fontSize: 30,
    borderRadius: 20,
    fontSize: 20,
},
  form: {
    alignItems: 'center',
  },
  input: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    width: 250,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'cornflowerblue',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Fjalekalimi;