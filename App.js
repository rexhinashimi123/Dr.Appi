import 'react-native-gesture-handler';
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';


import Login from "./screens/Login"; 
import Home from "./screens/Home";
import Perdoruesi from './screens/Perdoruesi';
import Formulari from './screens/Formulari';
import Regjistrohuni from './screens/Regjistrohuni';
import Fjalekalimi from './screens/Fjalekalimi';
import Analizat from './screens/Analizat';
import Recetat from './screens/Recetat';
import Review from './screens/Review';
import Chat from './screens/Chat';



import ChooseRolePage from './screens/ChooseRolePage'; // Faqja për të zgjedhur rol
import DoctorLogin from './screens/DoctorLogin';       // Login për doktorët
import DoctorDashboard from './screens/DoctorDashboard'; // Dashboard për doktorët
import DoctorListScreen from './screens/DoctorListScreen';
import DoctorLoginMySQL from './screens/DoctorLoginMySQL'; 

import ProfileScreen from './screens/ProfileScreen';
const Stack = createStackNavigator(); 

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        {}
        <Stack.Screen 
          name="ChooseRole" 
          component={ChooseRolePage} 
          options={{headerShown:false}} 
        />

        {/* --- Login për pacientët --- */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />

        {}
        <Stack.Screen 
          name="DoctorLogin" 
          component={DoctorLogin} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
  name="DoctorLoginMySQL" 
  component={DoctorLoginMySQL} 
  options={{ headerShown: false }} 
/>


        {}
        <Stack.Screen 
          name="DoctorDashboard" 
          component={DoctorDashboard} 
            options={{ headerShown: true, title: "Dashboard Doktor" }} 
        />



          <Stack.Screen
  name="DoctorListScreen"
  component={DoctorListScreen}
  options={{ headerShown: true, title: 'Doktorët' }}
           />


<Stack.Screen 
  name="ProfileScreen" 
  component={ProfileScreen} 
  options={{ headerShown: true, title: 'Profili i Doktorit' }} 
/>





        {}
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="Perdoruesi" component={Perdoruesi} options={{ headerShown: true }}/>
        <Stack.Screen name='Formulari' component={Formulari} options={{ headerShown: true }}/>
        <Stack.Screen name='Regjistrohuni' component={Regjistrohuni} options={{headerShown: true}}/>
        <Stack.Screen name='Fjalekalimi' component={Fjalekalimi} options={{headerShown: true}}/>
        <Stack.Screen name='Analizat' component={Analizat} options={{headerShown: true}}/>
        <Stack.Screen name='Recetat' component={Recetat} options={{headerShown: true}}/>
        <Stack.Screen name='Review' component={Review} options={{headerShown: true}}/>
        <Stack.Screen name='Chat' component={Chat} options={{headerShown: true}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};
