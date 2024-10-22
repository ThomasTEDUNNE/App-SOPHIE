import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, BackHandler } from 'react-native';
import { Button, Portal, Modal, DataTable, Text } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';

export default function EvaluationScreen({ route, navigation }) {
  const { students, competences } = route.params;

  // État pour les évaluations
  const [evaluations, setEvaluations] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Calcul de la note finale sur 20
  const calculateFinalGrade = (studentEvals) => {
    if (!studentEvals) return 0;
    const total = competences.reduce((acc, comp) => {
      return acc + (studentEvals[comp.name] || 0) * comp.coef;
    }, 0);
    const maxScore = competences.reduce((acc, comp) => acc + 4 * comp.coef, 0); // Maximum est 4 * coefficient
    return (total / maxScore) * 20;
  };

  // Export des évaluations en CSV
  const exportCSV = async () => {
    const rows = students.map(student => {
      const studentName = student.name;
      const evalData = evaluations[studentName] || {};
      const finalGrade = calculateFinalGrade(evalData);

      return [
        studentName,
        finalGrade.toFixed(2),
        ...competences.map(comp => evalData[comp.name] || 0)
      ].join(',');
    });

    const header = ['Nom', 'Note /20', ...competences.map(c => c.name)].join(',');
    const csv = [header, ...rows].join('\n');

    const fileName = `evaluation_${new Date().toISOString().split('T')[0]}.csv`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    try {
      await FileSystem.writeAsStringAsync(filePath, csv);
      await Sharing.shareAsync(filePath);
    } catch (error) {
      console.error(error);
    }
  };

  // Avertir si l'utilisateur essaie de quitter la page
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Quitter la page',
          'Si vous quittez la page, toutes les évaluations non enregistrées seront perdues. Voulez-vous continuer ?',
          [
            { text: 'Annuler', style: 'cancel', onPress: () => {} },
            { text: 'Quitter', onPress: () => navigation.goBack() },
          ],
          { cancelable: false }
        );
        return true;
      };

      // Ajouter l'écouteur pour le bouton retour
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Supprimer l'écouteur lorsque le composant est démonté
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  // Modal pour évaluer les compétences d'un élève
  const EvaluationModal = () => (
    <Portal>
      <Modal
        visible={!!selectedStudent}
        onDismiss={() => setSelectedStudent(null)}
        contentContainerStyle={styles.modal}
      >
        <ScrollView>
          {selectedStudent && competences.map((comp, index) => (
            <View key={index} style={styles.competenceContainer}>
              <Text>{comp.name}</Text>
              <View style={styles.buttonRow}>
                {[1, 2, 3, 4].map((score) => (
                  <Button
                    key={score}
                    mode={evaluations[selectedStudent]?.[comp.name] === score ? 'contained' : 'outlined'}
                    onPress={() => {
                      setEvaluations(prev => ({
                        ...prev,
                        [selectedStudent]: {
                          ...prev[selectedStudent],
                          [comp.name]: score
                        }
                      }));
                    }}
                  >
                    {score}
                  </Button>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.tableContainer}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Nom</DataTable.Title>
                <DataTable.Title numeric>Note /20</DataTable.Title>
              </DataTable.Header>

              {students.map((student, index) => (
                <DataTable.Row 
                  key={index}
                  onPress={() => setSelectedStudent(student.name)}
                >
                  <DataTable.Cell>{student.name}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    {calculateFinalGrade(evaluations[student.name]).toFixed(2)}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>
        </ScrollView>

        <EvaluationModal />

        <Button 
          mode="contained" 
          onPress={exportCSV}
          style={styles.button}
        >
          Exporter CSV
        </Button>
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
  scrollContainer: {
    flex: 1,
  },
  tableContainer: {
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  button: {
    marginVertical: 10,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  competenceContainer: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
