import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function DoctorLoginMySQL({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 
  const usernameFocus = useRef(new Animated.Value(0)).current;
  const passwordFocus = useRef(new Animated.Value(0)).current;
 
  const btnScale = useRef(new Animated.Value(1)).current;

  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.03, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true })
      ])
    ).start();
  }, [pulse]);

  const animateLabelUp = (anim) => {
    Animated.timing(anim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  };
  const animateLabelDown = (anim) => {
    Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  };

  const onPressIn = () => {
    Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true, friction: 6 }).start();
  };
  const onPressOut = (cb) => {
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true, friction: 6 }).start(() => {
      if (cb) cb();
    });
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Kujdes!', 'Plotësoni username dhe password');
      return;
    }
    try {
      const response = await axios.post('http://172.20.10.2:3000/doctor/login', {
        username: username.trim(),
        password: password.trim()
      });

      if (response.data.success) {
        navigation.navigate('DoctorDashboard', {
          username: response.data.doctor.username,
          full_name: response.data.doctor.full_name
        });
      } else {
        Alert.alert('Gabim', response.data.message);
      }
    } catch (error) {
      console.log('Gabim gjatë login:', error);
      Alert.alert('Gabim', 'Nuk mund të lidhet me serverin!');
    }
  };


  const usernameLabelStyle = {
    transform: [
      {
        translateY: usernameFocus.interpolate({
          inputRange: [0, 1],
          outputRange: [18, -10]
        })
      },
      {
        scale: usernameFocus.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85]
        })
      }
    ],
    color: usernameFocus.interpolate({
      inputRange: [0, 1],
      outputRange: ['#AAB0BD', '#FF6B6B'] 
    })
  };
  const passwordLabelStyle = {
    transform: [
      {
        translateY: passwordFocus.interpolate({
          inputRange: [0, 1],
          outputRange: [18, -10]
        })
      },
      {
        scale: passwordFocus.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85]
        })
      }
    ],
    color: passwordFocus.interpolate({
      inputRange: [0, 1],
      outputRange: ['#AAB0BD', '#00C2A8'] 
    })
  };

  return (
    <View style={styles.screen}>
      {}
      <Animated.View style={[styles.blob1, { transform: [{ scale: pulse }] }]} />
      <View style={styles.blob2} />
      <View style={styles.blob3} />

      {/* main card */}
      <View style={styles.card}>
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>DA</Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.appName}>Doctor Appi</Text>
            <Text style={styles.appTag}>Lehtëson komunikimin pacient-doktor</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Hyr në llogarinë tënde</Text>

        {/* username fiel */}
        <View style={styles.field}>
          <Animated.Text style={[styles.floatingLabel, usernameLabelStyle]}>
            👤 Username
          </Animated.Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="" 
            placeholderTextColor="transparent"
            style={styles.input}
            onFocus={() => animateLabelUp(usernameFocus)}
            onBlur={() => !username && animateLabelDown(usernameFocus)}
            returnKeyType="next"
            onSubmitEditing={() => {  }}
          />
          {}
          <View style={styles.fieldAccentRight} />
        </View>

        {}
        <View style={styles.field}>
          <Animated.Text style={[styles.floatingLabel, passwordLabelStyle]}>
            🔒 Password
          </Animated.Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder=""
            placeholderTextColor="transparent"
            style={styles.input}
            onFocus={() => animateLabelUp(passwordFocus)}
            onBlur={() => !password && animateLabelDown(passwordFocus)}
            returnKeyType="done"
            onSubmitEditing={() => handleLogin()}
          />
          <View style={styles.fieldAccentRight} />
        </View>

        {}
        <Text style={styles.hintText}>
          Përdor kredencialet emer.mbiemer.
        </Text>

        {/* login button */}
        <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={() => onPressOut(handleLogin)}>
          <Animated.View style={[styles.loginButton, { transform: [{ scale: btnScale }] }]}>
            {}
            <View style={styles.buttonInner}>
              <Text style={styles.loginText}>HYR</Text>
            </View>
            <View style={styles.buttonStrip} />
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* small link */}
        <TouchableWithoutFeedback onPress={() => navigation.navigate('ChooseRole')}>
          <View style={styles.backRow}>
            <Text style={styles.backText}>← Kthehu</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0F1114', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  
  blob1: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: '#FF6B6B', 
    top: -120,
    left: -60,
  },
  blob2: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    backgroundColor: '#00C2A8', 
    opacity: 0.06,
    bottom: -80,
    right: -40,
  },
  blob3: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#F5A623', 
    opacity: 0.05,
    top: 40,
    right: -60,
  },

  card: {
    width: '100%',
    backgroundColor: '#0F1720', 
    borderRadius: 20,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 30,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'linear-gradient(45deg,#FF6B6B,#00C2A8)', // note: visual hint; actual gradient simulated by blobs/background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  logoText: {
    color: '#fff',
    fontWeight: '900',
    letterSpacing: 0.6,
    fontSize: 18,
  },
  appName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800'
  },
  appTag: {
    color: '#9AA1A6',
    fontSize: 12,
    marginTop: 2
  },

  sectionTitle: {
    color: '#E6E9EB',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 10
  },

  field: {
    marginBottom: 14,
    position: 'relative',
  },
  floatingLabel: {
    position: 'absolute',
    left: 14,
    top: 18,
    fontSize: 14,
    color: '#AAB0BD',
    zIndex: 5,
  },
  input: {
    height: 54,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.02)', 
    paddingHorizontal: 16,
    color: '#E6EEF3',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  fieldAccentRight: {
    position: 'absolute',
    right: 12,
    top: 14,
    width: 14,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.03)'
  },

  hintText: {
    color: '#9AA1A6',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16
  },

  loginButton: {
    marginTop: 6,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B', 
    
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 6,
    flexDirection: 'row'
  },
  buttonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18
  },
  loginText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.6
  },
  
  buttonStrip: {
    position: 'absolute',
    right: -30,
    width: 120,
    height: 160,
    backgroundColor: 'rgba(0,194,168,0.12)',
    transform: [{ rotate: '18deg' }],
  },

  backRow: {
    marginTop: 14,
    alignItems: 'center'
  },
  backText: {
    color: '#9AA1A6',
    fontSize: 14
  }
});
