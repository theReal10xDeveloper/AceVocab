import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import SupabaseService from "@/services/supabase";
import { UserWord } from "@/types/user";

interface WordCardProps {
  wordId: number;
  onPress?: (word: string) => void; // New prop for handling press
}

const WordCard: React.FC<WordCardProps> = ({ wordId, onPress }) => {
  const [wordData, setWordData] = useState<UserWord | null>(null);

  useEffect(() => {
    const word = SupabaseService.userWords[wordId];
    if (word) {
      setWordData(word);
    }
  }, [wordId]);

  // Handle card press
  const handlePress = () => {
    if (wordData && onPress) {
      onPress(wordData.word);
    }
  };

  if (!wordData) {
    return null;
  }

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <ThemedText style={styles.word}>{wordData.word}</ThemedText>
        <ThemedText style={styles.definition} numberOfLines={3}>
          {wordData.definition || "No definition available"}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: "48%",
    minHeight: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  definition: {
    fontSize: 14,
    color: "#aaa",
  },
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