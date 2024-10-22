import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './theme';
import InitialScreen from './components/InitialScreen';
import CompetencesScreen from './components/CompetencesScreen';
import EvaluationScreen from './components/EvaluationScreen';
import SplashScreen from './components/SplashScreen'; // Importez le composant SplashScreen

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Initial" component={InitialScreen} options={{ title: 'Initialisation Liste Elève' }} />
          <Stack.Screen name="Competences" component={CompetencesScreen} options={{ title: 'Choix des Compétences' }} />
          <Stack.Screen name="Evaluation" component={EvaluationScreen} options={{ title: 'Évaluation' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
