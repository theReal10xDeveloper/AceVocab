import { Auth } from "@/components/Auth.apple";
import { ThemedText } from "@/components/ThemedText";
import WordCard from "@/components/WordCard";
import SupabaseService from "@/services/supabase";
import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";

export default function WordView() {
  const [loading, setLoading] = useState(true);
  const [wordIds, setWordIds] = useState<number[]>([]);

  useEffect(() => {
    const loadWords = async () => {
      try {
        await SupabaseService.fetchUserWords();
        const userWords = SupabaseService.userWords;
        const ids = Object.keys(userWords).map(id => parseInt(id));
        setWordIds(ids);
      } catch (error) {
        console.error("Error loading words:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          {wordIds.map((wordId) => (
            <WordCard 
              key={wordId}
              wordId={wordId}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
