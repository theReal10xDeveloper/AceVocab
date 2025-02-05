import { Settings } from "@/constants/Settings";
import SupabaseService from "./supabase";
import { WordData } from "./supabase";
import DatabaseService from "./local_database_service";

export class WordScheduler {
  private static presetWords: number[] = [];

  static async init() {
    try {
      const words = await SupabaseService.getWordsForPreset(
        Settings.currentPreset
      );
      if (!words || !Array.isArray(words)) {
        console.error("Invalid preset words format");
        return;
      }
      this.presetWords = words;
      console.log("Initialized presetWords:", this.presetWords);
    } catch (error) {
      console.error("Error initializing WordScheduler:", error);
      this.presetWords = [];
    }
  }

  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  static async getNextwords(): Promise<string[]> {
    try {
      if (this.presetWords.length === 0) {
        await this.init();
      }

      const userWords = SupabaseService.userWords;
      const wordsToReview: number[] = [];
      const numberOfWords = 4;

      // Sort user words by priority
      const sortedUserWords = Object.entries(userWords)
        .map(([id, data]) => ({
          id: parseInt(id),
          priority: data.getPriority(),
        }))
        .sort((a, b) => b.priority - a.priority);

      let userWordIndex = 0;

      // For each slot, decide whether to use review or new word
      for (let i = 0; i < numberOfWords; i++) {
        const shouldUseReview =
          this.shouldReview() && userWordIndex < sortedUserWords.length;

        if (shouldUseReview) {
          // Get next highest priority word
          const wordId = sortedUserWords[userWordIndex].id;
          if (!wordsToReview.includes(wordId)) {
            wordsToReview.push(wordId);
            userWordIndex++;
          }
        } else {
          // Get random preset word
          let attempts = 0;
          const maxAttempts = this.presetWords.length;

          while (attempts < maxAttempts) {
            const randomId =
              this.presetWords[
                Math.floor(Math.random() * this.presetWords.length)
              ];

            if (!wordsToReview.includes(randomId)) {
              wordsToReview.push(randomId);
              break;
            }
            attempts++;
          }
        }
      }

      // Convert IDs to words with validation
      const words = await Promise.all(
        wordsToReview.map(async (id) => {
          try {
            const word = await DatabaseService.getWord(id);
            if (!word) {
              console.error(`Word not found for ID: ${id}`);
              return null;
            }
            return word;
          } catch (error) {
            console.error(`Error fetching word ${id}:`, error);
            return null;
          }
        })
      );

      const validWords = words.filter(
        (word): word is string => typeof word === "string" && word.length > 0
      );

      return this.shuffleArray(validWords);
    } catch (error) {
      console.error("Error in getNextwords:", error);
      return [];
    }
  }

  static shouldReview(): boolean {
    return Math.random() < Settings.reviewToExploreRatio;
  }
}
