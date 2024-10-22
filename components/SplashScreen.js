import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/img/SOPHIE.png')}  // Remplacez 'your-image.png' par le chemin de votre image
        style={styles.image}
      />
      <Text style={styles.welcomeText}>
        Bienvenue sur SOPHIE,{'\n'} 
        Système Optimisé Pour Harmoniser les Interactions Éducatives.{'\n'} {'\n'}
        Cette application est dédiée à l'évaluation des travaux pratiques et des activités.
      </Text>
      <Button
        mode="contained" // Utilisez le mode "contained" pour un bouton rempli
        onPress={() => navigation.navigate('Initial')}
        style={styles.button}
      >
        Suivant
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: 300, // Ajustez la largeur de l'image selon vos besoins
    height: 200, // Ajustez la hauteur de l'image selon vos besoins
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    marginVertical: 10, // Ajoutez de l'espace vertical autour du bouton
    width: '100%', // Ajustez la largeur du bouton pour qu'il prenne toute la largeur disponible
    maxWidth: 300, // Optionnel : définir une largeur maximale
  },
});

export default SplashScreen;
