import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, DataTable, Text, RadioButton } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

const defaultCompetences = [
  { name: 'Compréhension', coef: 1 },
  { name: 'Réalisation technique', coef: 1 },
  { name: 'Qualité des résultats', coef: 1 },
  { name: 'Autonomie', coef: 1 }
];

export default function CompetencesScreen({ navigation, route }) {
  const [competences, setCompetences] = useState(defaultCompetences);
  const [customCompetences, setCustomCompetences] = useState([]);
  const [useCustom, setUseCustom] = useState('default'); // "default" or "custom"
  const [competencesImported, setCompetencesImported] = useState(false);
  const students = route.params?.students || [];

  const importCustomCompetences = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv'
      });

      if (result.assets && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);

        Papa.parse(fileContent, {
          delimiter: ";", // Use the correct delimiter for your file
          complete: (results) => {
            const importedCompetences = results.data
              .slice(1)
              .filter(row => row.length >= 2 && row[0].trim() !== '')
              .map(row => ({
                name: row[0].trim(),
                coef: parseFloat(row[1]) || 1
              }));

            if (importedCompetences.length > 0) {
              setCustomCompetences(importedCompetences);
              setCompetencesImported(true); // Mark as imported
            } else {
              alert("Le fichier CSV ne contient pas de compétences valides.");
            }
          },
          error: (error) => {
            alert('Erreur lors de la lecture du fichier CSV.');
          }
        });
      }
    } catch (error) {
      alert('Erreur lors de la sélection du fichier.');
    }
  };

  const goToEvaluation = () => {
    const competencesToUse = useCustom === 'custom' && competencesImported
      ? customCompetences
      : defaultCompetences;

    if (competencesToUse.length === 0) {
      alert("Veuillez choisir des compétences avant de continuer.");
      return;
    }

    navigation.navigate('Evaluation', {
      students: students,
      competences: competencesToUse
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Section choix des compétences */}
        <View style={styles.radioContainer}>
          <Text style={styles.info}>Sélectionnez les compétences à utiliser :</Text>
          <RadioButton.Group
            onValueChange={newValue => setUseCustom(newValue)}
            value={useCustom}
          >
            <View style={styles.radioOption}>
              <RadioButton value="default" />
              <Text>Compétences par défaut</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton value="custom" />
              <Text>Compétences personnalisées</Text>
            </View>
          </RadioButton.Group>
        </View>

        {/* Affichage du tableau par défaut */}
        {useCustom === 'default' && (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Compétences par défaut</Text>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Compétence</DataTable.Title>
                <DataTable.Title numeric>Coefficient</DataTable.Title>
              </DataTable.Header>

              {defaultCompetences.map((comp, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{comp.name}</DataTable.Cell>
                  <DataTable.Cell numeric>{comp.coef}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>
        )}

        {/* Importation et affichage du tableau personnalisé */}
        {useCustom === 'custom' && (
          <View style={styles.customCompetenceContainer}>
            <Button
              mode="contained"
              onPress={importCustomCompetences}
              style={styles.button}
            >
              Importer compétences personnalisées
            </Button>

            {competencesImported && (
              <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}>Compétences importées</Text>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Compétence</DataTable.Title>
                    <DataTable.Title numeric>Coefficient</DataTable.Title>
                  </DataTable.Header>

                  {customCompetences.map((comp, index) => (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>{comp.name}</DataTable.Cell>
                      <DataTable.Cell numeric>{comp.coef}</DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </View>
            )}
          </View>
        )}

        {/* Bouton Suivant */}
        <Button
          mode="contained"
          onPress={goToEvaluation}
          disabled={competences.length === 0}
          style={styles.button}
        >
          Suivant
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  radioContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableContainer: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    padding: 10,
  },
  tableTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    marginVertical: 10,
  },
  info: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
  customCompetenceContainer: {
    marginVertical: 20,
  },
});
