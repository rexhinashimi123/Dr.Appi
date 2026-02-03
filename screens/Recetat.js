import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, StyleSheet, Dimensions,ImageBackground } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import ImageZoom from 'react-native-image-pan-zoom';
import { Ionicons } from '@expo/vector-icons';

const Recetat = ({navigation}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const analysisData = [
    { date: '01-03-2023', type: 'Receta mbi analizat e gjakut', photo: require('./images/receta.png') },
    { date: '02-04-2023', type: 'Receta mbi biopsin', photo: require('./images/receta.png') },
    { date: '04-05-2023', type: 'Receta mbi Check-up', photo: require('./images/receta.png') },
  ];

  const handleAnalysisPress = (analysis) => {
    setSelectedAnalysis(analysis);
  };

  const handleCloseAnalysis = () => {
    setSelectedAnalysis(null);
  };

  return (
    <View style={styles.container}>
    <ImageBackground source={require('./images/simple.png')} style={styles.backgroundImage}>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Recetat mjeksore tuaja mund t'i gjeni me poshte</Text>
      <Ionicons name='folder-outline' size={50} color="cornflowerblue" style={{position: 'absolute',left: 175,top: 136,}}/>
      </View>
      {analysisData.map((analysis, index) => (
        <TouchableOpacity key={index} onPress={() => handleAnalysisPress(analysis)}>
          <View style={styles.analysisItem}>
            <Text style={styles.dateText}>{analysis.date}</Text>
            <Text style={styles.typeText}>{analysis.type}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Modal visible={selectedAnalysis !== null} transparent={true} onRequestClose={handleCloseAnalysis}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseAnalysis}>
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>

          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height}
            imageWidth={500}
            imageHeight={500}
          >
            <Image
              source={selectedAnalysis?.photo}
              style={styles.modalImage}
              resizeMode="contain"
            />
          </ImageZoom>

        </View>
      </Modal>
      </ImageBackground>
    </View>
  );
};

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
  titleContainer: {
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    paddingTop: 50,
    height: 200,
    backgroundColor: 'white',
    bottom: 100,
  },
  title: {
    textAlign: "center",
    color: 'cornflowerblue',
    fontWeight: 400,
    paddingTop: 5,
    fontSize: 23,
    padding: 50,
    fontSize: 30,
    borderRadius: 20,
},
  analysisItem: {
    backgroundColor: 'aliceblue',
      borderRadius: 5,
      borderTopColor:'lightskyblue',
      borderTopWidth: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginHorizontal: 50,
      marginVertical: 30,
      marginTop: 20,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 5,
      bottom: 10,
     

  },
  dateText: {
    fontSize: 20,
    backgroundColor: 'lightblue',
    color:'white',
    textAlign: 'center',
    fontWeight:'500',
    
  },
  typeText: {
    fontSize: 18,
    color: 'lightskyblue',
    marginTop: 10,
    textAlign: 'center',
    fontWeight:'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});

export default Recetat;
