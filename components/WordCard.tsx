// WordCard.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import SupabaseService, { WordData } from '@/services/supabase';
import DatabaseService from '@/services/local_database_service';

interface WordCardProps {
  wordId: number;  // Added wordId prop
}

const WordCard: React.FC<WordCardProps> = ({ wordId }) => {
  const [word, setWord] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const wordData = SupabaseService.userWords[wordId];
  const proficiency = calculateProficiency(wordData);

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const fetchedWord = await DatabaseService.getWord(wordId);
        setWord(fetchedWord);
      } catch (error) {
        console.error('Error fetching word:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [wordId]);

  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.word}>{word}</Text>
      <View style={styles.proficiencyContainer}>
        <View style={[styles.proficiencyBar, { width: `${proficiency}%` }]} />
        <Text style={styles.proficiencyText}>{Math.round(proficiency)}%</Text>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>{wordData.correct}</Text>
        <Text style={styles.statsText}> {wordData.wrong}</Text>
        <Text style={styles.statsText}> {wordData.seenCorrect + wordData.seenWrong}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
        width: "45%",
        height: "20%",
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  word: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  proficiencyContainer: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  proficiencyBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    position: 'absolute',
    left: 0,
  },
  proficiencyText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  }
});

export default WordCard;




function calculateProficiency(wordData: WordData): number {
  const { seenCorrect, seenWrong, correct, wrong } = wordData;

  const totalExposure = correct + wrong + (0.5 * (seenCorrect + seenWrong));

  let proficiency;

  if (totalExposure === 0) {
    proficiency = 0; // Or set to a default value, e.g., 50
  } else {
    proficiency = 100 * (correct + (0.5 * seenCorrect)) / totalExposure;
  }

  // Ensure the proficiency is within the 0-100 range (optional)
  proficiency = Math.max(0, Math.min(100, proficiency));

  return proficiency;
}