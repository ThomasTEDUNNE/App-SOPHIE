import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, DataTable, Text } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';

export default function InitialScreen({ navigation }) {
  const [students, setStudents] = useState([]);

  const pickCSV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv'
      });
      
      if (result.assets && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        
        Papa.parse(fileContent, {
          complete: (results) => {
            const studentList = results.data
              .slice(1) // Ignorer l'en-tête
              .filter(row => row.length > 0 && row[0] && row[0].trim() !== '')
              .map(row => ({
                name: row[0].trim()
              }));

            setStudents(studentList);
          },
          error: (error) => {
            alert('Erreur lors de la lecture du fichier CSV');
          }
        });
      }
    } catch (error) {
      alert('Erreur lors de la sélection du fichier');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Button 
          mode="contained" 
          onPress={pickCSV}
          style={styles.button}
        >
          Importer CSV des élèves
        </Button>

        <View style={styles.tableContainer}>
          {/* Ajouter ScrollView ici pour le défilement */}
          <ScrollView>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Nom</DataTable.Title>
              </DataTable.Header>

              {students && students.map((student, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{student.name}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
        </View>

        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Competences', { students })}
          disabled={!students || students.length === 0}
          style={styles.button}
        >
          Suivant
        </Button>

        <Text style={styles.info}>
          {students.length > 0 
            ? `${students.length} élève(s) importé(s)` 
            : 'Aucun élève importé'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    flex: 1,
  },
  tableContainer: {
    flex: 1,
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    // Limiter la hauteur pour que le ScrollView fonctionne bien
    maxHeight: 500,
  },
  button: {
    marginVertical: 10,
  },
  info: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
});
